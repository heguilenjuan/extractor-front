import React from 'react';
import type { Box, TemplateField, WordBlock } from '../../types';

type Props = {
  page: number;
  scale: number;
  words: WordBlock[];
  fields: Record<string, TemplateField>;
  activeFieldName?: string;
  mode: 'word' | 'marquee';
  onPickWord?: (word: WordBlock) => void;
  onDrawBox?: (box: Box) => void;
};

const BlocksOverlay: React.FC<Props> = ({
  page, scale, words, fields, activeFieldName, mode, onPickWord, onDrawBox
}) => {
  const [dragStart, setDragStart] = React.useState<{x:number;y:number}|null>(null);
  const [dragBox, setDragBox] = React.useState<Box|null>(null);

  const toPx = (b: Box): Box => [b[0]*scale, b[1]*scale, b[2]*scale, b[3]*scale];

  const handleWordClick = (w: WordBlock) => {
    if (mode !== 'word') return;
    onPickWord?.(w);
  };

  const onMouseDown: React.MouseEventHandler = (e) => {
    if (mode !== 'marquee') return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragBox(null);
  };
  const onMouseMove: React.MouseEventHandler = (e) => {
    if (!dragStart || mode !== 'marquee') return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const x0 = Math.min(dragStart.x, x); const y0 = Math.min(dragStart.y, y);
    const x1 = Math.max(dragStart.x, x); const y1 = Math.max(dragStart.y, y);
    setDragBox([x0/scale, y0/scale, x1/scale, y1/scale]);
  };
  const onMouseUp: React.MouseEventHandler = () => {
    if (dragBox && mode === 'marquee') onDrawBox?.(dragBox);
    setDragStart(null); setDragBox(null);
  };

  return (
    <div className="pointer-events-auto absolute inset-0" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <svg className="absolute inset-0 h-full w-full">
        {words.map(w => {
          const [x0,y0,x1,y1] = toPx(w.coordinates);
          return (
            <rect
              key={w.block_number}
              x={x0} y={y0} width={x1-x0} height={y1-y0}
              className="fill-transparent stroke-blue-500/60"
              strokeWidth={1}
              onClick={() => handleWordClick(w)}
            />
          );
        })}

        {Object.entries(fields).map(([name, f]) => {
          if (f.page !== page) return null;
          const [x0,y0,x1,y1] = toPx(f.box);
          const active = name === activeFieldName;
          return (
            <g key={name}>
              <rect
                x={x0} y={y0} width={x1-x0} height={y1-y0}
                className={active ? 'fill-green-200/20 stroke-green-600' : 'fill-amber-200/10 stroke-amber-600'}
                strokeWidth={2}
              />
              <text x={x0+4} y={Math.max(y0-4, 10)} className="fill-gray-800 text-[10px]">{name}</text>
            </g>
          );
        })}

        {dragBox && (() => {
          const [x0,y0,x1,y1] = toPx(dragBox);
          return (
            <rect
              x={x0} y={y0} width={x1-x0} height={y1-y0}
              className="fill-indigo-200/20 stroke-indigo-600"
              strokeWidth={1.5}
            />
          );
        })()}
      </svg>
    </div>
  );
};

export default BlocksOverlay;
