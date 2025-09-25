import React, { useRef } from "react";
import type { Box, DragHandle } from "./overlay.types";

type Props = {
    width: number;
    height: number;
    boxes: Box[];
    selectedId: string | null;

    // handlers provistos por el hook
    onBackgroundPointerDown: (x: number, y: number) => void;
    onBeginMove: (id: string, x: number, y: number) => void;
    onBeginResize: (id: string, handle: DragHandle, x: number, y: number) => void;
    onPointerMove: (x: number, y: number) => void;
    onPointerUp: () => void;

    onSelect: (id: string | null) => void;
    onRename: (name: string) => void;
    onDelete: () => void;
};

const HANDLE_SIZE = 8;

export default function Overlay({
    width, height, boxes, selectedId,
    onBackgroundPointerDown, onBeginMove, onBeginResize, onPointerMove, onPointerUp,
    onSelect, onRename, onDelete
}: Props) {
    const ref = useRef<HTMLDivElement | null>(null);

    const getLocalPoint = (e: React.PointerEvent) => {
        const r = ref.current?.getBoundingClientRect();
        const x = e.clientX - (r?.left ?? 0);
        const y = e.clientY - (r?.top ?? 0);
        return { x, y };
    };

    return (
        <div
            ref={ref}
            className="relative"
            style={{ width, height }}
            onPointerMove={(e) => {
                const p = getLocalPoint(e);
                onPointerMove(p.x, p.y);
            }}
            onPointerUp={() => onPointerUp()}
            onPointerLeave={() => onPointerUp()}
        >
            {/* capturamos clicks de fondo para crear o deseleccionar */}
            <div
                className="absolute inset-0"
                onPointerDown={(e) => {
                    // si clic en vacío: crear inicio de box con botón izquierdo; con ctrl: deseleccionar
                    const p = getLocalPoint(e);
                    if ((e.target as HTMLElement).dataset.handle) return; // si clic en handle, no crear
                    if ((e.target as HTMLElement).dataset.boxid) return;  // si clic en box, no crear
                    if (e.ctrlKey) { onSelect(null); return; }
                    onBackgroundPointerDown(p.x, p.y);
                }}
            />

            {boxes.map((b) => {
                const isSel = b.id === selectedId;
                return (
                    <div
                        key={b.id}
                        data-boxid={b.id}
                        className="absolute cursor-move"
                        style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
                        onPointerDown={(e) => {
                            const p = getLocalPoint(e);
                            onBeginMove(b.id, p.x, p.y);
                        }}
                        onClick={(e) => { e.stopPropagation(); onSelect(b.id); }}
                    >
                        {/* borde del box */}
                        <div className={`w-full h-full ${isSel ? "border-2 border-red-500" : "border border-blue-400"} bg-blue-500/10`} />

                        {/* etiqueta / nombre */}
                        <div className="absolute left-0 top-0 translate-y-[-60%] px-2 py-0.5 text-xs rounded bg-gray-500 opacity-45 text-white">
                            {b.name || "sin nombre"}
                        </div>

                        {/* handles para resize (solo si seleccionado) */}
                        {isSel && (
                            <>
                                {(["nw", "n", "ne", "w", "e", "sw", "s", "se"] as DragHandle[]).map(h => {
                                    const style: React.CSSProperties = {
                                        width: HANDLE_SIZE, height: HANDLE_SIZE,
                                        position: "absolute", background: "white", border: "1px solid #3b82f6",
                                    };
                                    // posicionar
                                    if (h.includes("n")) style.top = -HANDLE_SIZE / 2;
                                    if (h.includes("s")) style.bottom = -HANDLE_SIZE / 2;
                                    if (h.includes("w")) style.left = -HANDLE_SIZE / 2;
                                    if (h.includes("e")) style.right = -HANDLE_SIZE / 2;
                                    if (h === "n" || h === "s") { style.left = "50%"; style.transform = "translateX(-50%)"; }
                                    if (h === "w" || h === "e") { style.top = "50%"; style.transform = "translateY(-50%)"; }
                                    if (h === "nw" || h === "ne" || h === "sw" || h === "se") {
                                        // corners ya posicionados por top/bottom/left/right
                                    }

                                    const cursorMap: Record<DragHandle, string> = {
                                        move: "move",
                                        n: "ns-resize", s: "ns-resize",
                                        e: "ew-resize", w: "ew-resize",
                                        ne: "nesw-resize", sw: "nesw-resize",
                                        nw: "nwse-resize", se: "nwse-resize",
                                    };

                                    return (
                                        <div
                                            key={h}
                                            data-handle
                                            style={{ ...style, cursor: cursorMap[h] }}
                                            onPointerDown={(e) => {
                                                e.stopPropagation();
                                                const p = getLocalPoint(e);
                                                onBeginResize(b.id, h, p.x, p.y);
                                            }}
                                        />
                                    );
                                })}
                            </>
                        )}
                    </div>
                );
            })}

            {/* barra de acciones sobre el seleccionado */}
            {selectedId && (
                <div className="absolute right-1 top-2 flex items-center gap-2 bg-transparent px-2 py-1 rounded shadow focus:bg-white">
                    <input
                        className="border rounded px-2 py-1 text-sm bg-transparent focus:bg-white"
                        placeholder="Nombre de seccion"
                        value={boxes.find(b => b.id === selectedId)?.name ?? ""}
                        onChange={(e) => onRename(e.target.value)}
                    />
                    <button
                        className="px-2 py-1 text-sm bg-red-500  text-white rounded hover:bg-red-600"
                        onClick={onDelete}
                    >
                        Borrar
                    </button>
                </div>
            )}
        </div>
    );
}
