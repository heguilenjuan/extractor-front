/* eslint-disable @typescript-eslint/no-explicit-any */
// ./Anchor/AnchorsOverlay.tsx
import { useRef } from 'react';
import type { Anchor } from '../Template/templates.types';

type Handle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

type Props = {
  width: number;
  height: number;
  anchors: Anchor[];
  selectedId: string | null;
  page: number;

  onBackgroundPointerDown: (x: number, y: number) => void;
  onBeginMove: (id: string, x: number, y: number) => void;
  onBeginResizeSearch: (id: string, handle: Handle, x: number, y: number) => void;
  onPointerMove: (x: number, y: number) => void;
  onPointerUp: () => void;

  onSelect: (id: string | null) => void;
  onRename: (name: string) => void;
  onDelete: (id: string) => void;
};

const HANDLE = 7;

export default function AnchorsOverlay({
  width, height, anchors, selectedId, page,
  onBackgroundPointerDown, onBeginMove, onBeginResizeSearch, onPointerMove, onPointerUp,
  onSelect, onRename, onDelete
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const lp = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    return { x: e.clientX - (r?.left ?? 0), y: e.clientY - (r?.top ?? 0) };
  };

  const list = anchors.filter(a => a.page === page);

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ width, height }}
      onPointerMove={(e) => {
        const { x, y } = lp(e);
        onPointerMove(x, y);
      }}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerDown={(e) => {
        const t = e.target as HTMLElement;

        // Evitar crear anclas si el click viene desde la UI
        if (t.closest('[data-ui="toolbar"]')) return;
        // Evitar si clic dentro de un pin/anchor o sus hijos
        if (t.closest('[data-anchorid]')) return;
        // Evitar si clic en handles de resize del searchBox
        if (t.closest('[data-handle]')) return;

        // Solo botón izquierdo
        if (e.button !== 0) return;

        const p = lp(e);
        onBackgroundPointerDown(p.x, p.y);
      }}
    >
      {list.map(a => {
        const isSel = a.id === selectedId;
        const sb = a.searchBox;

        return (
          <div key={a.id}>
            {/* SearchBox (rectángulo ámbar) */}
            {sb && (
              <div
                data-anchorid={a.id}
                className={`absolute border ${isSel ? 'border-amber-500' : 'border-amber-300'} bg-amber-200/10`}
                style={{ left: sb.x, top: sb.y, width: sb.w, height: sb.h }}
                onClick={(e) => { e.stopPropagation(); onSelect(a.id); }}
              >
                {/* Handles para redimensionar (mostrarlos solo si está seleccionado) */}
                {isSel && (['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] as const).map(h => {
                  const s: React.CSSProperties = {
                    position: 'absolute',
                    width: HANDLE,
                    height: HANDLE,
                    background: 'white',
                    border: '1px solid #f59e0b',
                    cursor:
                      h === 'n' || h === 's' ? 'ns-resize' :
                      h === 'w' || h === 'e' ? 'ew-resize' :
                      (h === 'ne' || h === 'sw') ? 'nesw-resize' : 'nwse-resize'
                  };
                  if (h.includes('n')) s.top = -HANDLE / 2;
                  if (h.includes('s')) s.bottom = -HANDLE / 2;
                  if (h.includes('w')) s.left = -HANDLE / 2;
                  if (h.includes('e')) s.right = -HANDLE / 2;
                  if (h === 'n' || h === 's') { s.left = '50%'; (s as any).transform = 'translateX(-50%)'; }
                  if (h === 'w' || h === 'e') { s.top = '50%'; (s as any).transform = 'translateY(-50%)'; }

                  return (
                    <div
                      key={h}
                      data-handle
                      style={s}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        const p = lp(e);
                        onBeginResizeSearch(a.id, h, p.x, p.y);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Pin del Anchor */}
            <div
              data-anchorid={a.id}
              className="absolute"
              style={{ left: a.x - 5, top: a.y - 5, width: 10, height: 10 }}
              onPointerDown={(e) => {
                e.stopPropagation();
                const p = lp(e);
                onBeginMove(a.id, p.x, p.y);
              }}
              onClick={(e) => { e.stopPropagation(); onSelect(a.id); }}
            >
              <div className={`w-full h-full rounded-full ${isSel ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="absolute left-2 -top-5 text-[11px] bg-gray-700 text-white px-1 rounded opacity-70">
                {a.name ?? 'ancla'}
              </div>
            </div>
          </div>
        );
      })}

      {/* Toolbar del seleccionado */}
      {selectedId && (() => {
        const a = list.find(x => x.id === selectedId); if (!a) return null;
        return (
          <div
            className="absolute right-1 top-2 flex items-center gap-2 px-2 py-1 bg-white/90 rounded shadow"
            data-ui="toolbar"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <input
              className="border rounded px-2 py-1 text-sm"
              value={a.name ?? ''}
              placeholder="Nombre ancla"
              onChange={(e) => onRename(e.target.value)}
            />
            <button
              className="px-2 py-1 text-sm bg-red-500 text-white rounded"
              onClick={() => onDelete(a.id)}
            >
              Borrar
            </button>
          </div>
        );
      })()}
    </div>
  );
}
