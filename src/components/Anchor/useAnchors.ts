// ./Anchor/useAnchors.ts
import { useRef, useState, useCallback } from "react";
import type { Anchor, SearchBox } from "../Template/templates.types";

type Handle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';
type Drag =
  | { type: 'move'; id: string; ox: number; oy: number }
  | { type: 'resizeSearch'; id: string; handle: Handle; ox: number; oy: number }
  | null;

export function useAnchors() {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dragRef = useRef<Drag>(null);

  const getById = useCallback(
    (id: string | null) => anchors.find(a => a.id === id) ?? null,
    [anchors]
  );

  const createAt = useCallback((x: number, y: number, page: number) => {
    const id = crypto.randomUUID();
    const a: Anchor = {
      id, page, x, y,
      name: 'ancla',
      kind: 'regex',
      pattern: 'TOTAL\\s*:?',
      caseSensitive: false,
      weight: 1,
      searchBox: { x: Math.max(0, x - 100), y: Math.max(0, y - 40), w: 200, h: 80 }
    };
    setAnchors(prev => [...prev, a]);
    setSelectedId(id);
  }, []);

  const select = useCallback((id: string | null) => setSelectedId(id), []);

  const beginMove = useCallback((id: string, x: number, y: number) => {
    const a = anchors.find(a => a.id === id);
    if (!a) return;
    // guardamos offset respecto del punto del ancla
    dragRef.current = { type: 'move', id, ox: x - a.x, oy: y - a.y };
  }, [anchors]);

  const beginResizeSearch = useCallback((id: string, handle: Handle, x: number, y: number) => {
    dragRef.current = { type: 'resizeSearch', id, handle, ox: x, oy: y };
  }, []);

  const onPointerMove = useCallback((x: number, y: number) => {
    const d = dragRef.current;
    if (!d) return;

    if (d.type === 'move') {
      setAnchors(prev => prev.map(a =>
        a.id === d.id ? { ...a, x: x - d.ox, y: y - d.oy } : a
      ));
    } else if (d.type === 'resizeSearch') {   // ← comparación correcta
      setAnchors(prev => prev.map(a => {
        if (a.id !== d.id) return a;
        const sb = a.searchBox ?? { x: a.x - 50, y: a.y - 20, w: 100, h: 40 };
        let { x: sx, y: sy, w, h } = sb;
        const dx = x - d.ox;
        const dy = y - d.oy;
        const min = 10;
        if (d.handle.includes('n')) { sy += dy; h = Math.max(min, h - dy); }
        if (d.handle.includes('s')) { h = Math.max(min, h + dy); }
        if (d.handle.includes('w')) { sx += dx; w = Math.max(min, w - dx); }
        if (d.handle.includes('e')) { w = Math.max(min, w + dx); }
        return { ...a, searchBox: { x: sx, y: sy, w, h } as SearchBox };
      }));
      // actualizamos la referencia del drag con el nuevo origen
      dragRef.current = { ...d, ox: x, oy: y };
    }
  }, []);

  const endInteraction = useCallback(() => { dragRef.current = null; }, []);

  const rename = useCallback((name: string) => {
    setAnchors(prev => prev.map(a => a.id === selectedId ? { ...a, name } : a));
  }, [selectedId]);

  const patch = useCallback((id: string, p: Partial<Anchor>) => {
    setAnchors(prev => prev.map(a => a.id === id ? { ...a, ...p } : a));
  }, []);

  const remove = useCallback((id: string) => {
    setAnchors(prev => prev.filter(a => a.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  }, []);

  return {
    anchors,
    selectedId,
    getById,
    createAt,
    select,
    beginMove,
    beginResizeSearch,
    onPointerMove,
    endInteraction,
    rename,
    patch,
    remove,
    setAnchors,
  };
}
