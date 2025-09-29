import { useCallback, useMemo, useRef, useState } from "react";
import type { Box, DragHandle } from "./overlay.types";

type Mode = "idle" | "creating" | "moving" | "resizing" | "naming";

export function useOverlay({ width, height }: { width: number; height: number }) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("idle");

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const origRef = useRef<{ box: Box; handle: DragHandle | null } | null>(null);

  const getBoxById = useCallback((id: string | null) => {
    if (!id) return null;
    return boxes.find(b => b.id === id) ?? null;
  }, [boxes]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const selectBox = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const createAt = useCallback((x: number, y: number, pageNumber:number) => {
    const id = crypto.randomUUID();
    const box: Box = { id, x, y, w: 0, h: 0, name: "", page:pageNumber };
    setBoxes(prev => [...prev, box]);
    setSelectedId(id);
    setMode("creating");
    startRef.current = { x, y };
    origRef.current = { box, handle: null };
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setBoxes(prev => prev.filter(b => b.id !== selectedId));
    setSelectedId(null);
    setMode("idle");
  }, [selectedId]);

  const renameSelected = useCallback((name: string) => {
    if (!selectedId) return;
    setBoxes(prev => prev.map(b => b.id === selectedId ? { ...b, name } : b));
  }, [selectedId]);

  const beginMove = useCallback((id: string, startX: number, startY: number) => {
    const box = boxes.find(b => b.id === id);
    if (!box) return;
    selectBox(id);
    setMode("moving");
    startRef.current = { x: startX, y: startY };
    origRef.current = { box: { ...box }, handle: "move" };
  }, [boxes, selectBox]);

  const beginResize = useCallback((id: string, handle: DragHandle, startX: number, startY: number) => {
    const box = boxes.find(b => b.id === id);
    if (!box) return;
    selectBox(id);
    setMode("resizing");
    startRef.current = { x: startX, y: startY };
    origRef.current = { box: { ...box }, handle };
  }, [boxes, selectBox]);

  const onPointerMove = useCallback((x: number, y: number) => {
    if (mode === "idle" || !origRef.current || !startRef.current) return;

    const start = startRef.current;
    const dx = x - start.x;
    const dy = y - start.y;

    if (mode === "creating" && origRef.current.box) {
      const base = origRef.current.box;
      const nx = clamp(Math.min(base.x, x), 0, width);
      const ny = clamp(Math.min(base.y, y), 0, height);
      const nw = clamp(Math.abs(x - base.x), 0, width - nx);
      const nh = clamp(Math.abs(y - base.y), 0, height - ny);
      setBoxes(prev => prev.map(b => b.id === base.id ? { ...b, x: nx, y: ny, w: nw, h: nh } : b));
    }

    if (mode === "moving" && origRef.current.handle === "move") {
      const base = origRef.current.box;
      if (!base) return;
      const nx = clamp(base.x + dx, 0, width - base.w);
      const ny = clamp(base.y + dy, 0, height - base.h);
      setBoxes(prev => prev.map(b => b.id === base.id ? { ...b, x: nx, y: ny } : b));
    }

    if (mode === "resizing" && origRef.current.handle) {
      const base = origRef.current.box;
      if (!base) return;
      let { x: bx, y: by, w: bw, h: bh } = base;

      const apply = (nx: number, ny: number, nw: number, nh: number) => {
        const cx = clamp(nx, 0, width);
        const cy = clamp(ny, 0, height);
        const cw = clamp(nw, 0, width - cx);
        const ch = clamp(nh, 0, height - cy);
        setBoxes(prev => prev.map(b => b.id === base.id ? { ...b, x: cx, y: cy, w: cw, h: ch } : b));
      };

      const h = origRef.current.handle;
      if (h.includes("e")) bw = clamp(bw + dx, 0, width - bx);
      if (h.includes("s")) bh = clamp(bh + dy, 0, height - by);
      if (h.includes("w")) { bx = clamp(bx + dx, 0, base.x + base.w); bw = clamp(base.w - dx, 0, width - bx); }
      if (h.includes("n")) { by = clamp(by + dy, 0, base.y + base.h); bh = clamp(base.h - dy, 0, height - by); }

      apply(bx, by, bw, bh);
    }
  }, [mode, width, height]);

  const endInteraction = useCallback(() => {
    if (mode === "creating") {
      // limpiar cajas con tamaño casi cero
      setBoxes(prev => prev.filter(b => !(b.w < 3 || b.h < 3)));
    }
    setMode("idle");
    startRef.current = null;
    origRef.current = null;
  }, [mode]);

  const setSelectedName = useCallback((name: string) => {
    if (!selectedId) return;
    setBoxes(prev => prev.map(b => b.id === selectedId ? { ...b, name } : b));
  }, [selectedId]);

  const api = useMemo(() => ({
    boxes, selectedId, mode,
    selectBox,
    createAt,
    beginMove,
    beginResize,
    onPointerMove,
    endInteraction,
    deleteSelected,
    renameSelected: setSelectedName,
    getBoxById,
    setBoxes, // opcional: por si querés hidratar desde backend
  }), [boxes, selectedId, mode, selectBox, createAt, beginMove, beginResize, onPointerMove, endInteraction, deleteSelected, setSelectedName, getBoxById]);

  return api;
}
