import React from 'react';
import type { CastKind, TemplateField } from '../../types';

export interface FieldFormValue extends TemplateField { name: string; }

export interface FieldFormProps {
  initial?: Partial<FieldFormValue>;
  onSave: (value: FieldFormValue) => void;
  onCancel?: () => void;
}

const FieldForm: React.FC<FieldFormProps> = ({ initial, onSave, onCancel }) => {
  const [name, setName] = React.useState(initial?.name ?? '');
  const [page, setPage] = React.useState(initial?.page ?? 0);
  const [x0, setX0] = React.useState(initial?.box?.[0] ?? 0);
  const [y0, setY0] = React.useState(initial?.box?.[1] ?? 0);
  const [x1, setX1] = React.useState(initial?.box?.[2] ?? 100);
  const [y1, setY1] = React.useState(initial?.box?.[3] ?? 30);
  const [pad, setPad] = React.useState(initial?.pad ?? 2);
  const [join, setJoin] = React.useState(initial?.join_with_space ?? true);
  const [regex, setRegex] = React.useState(initial?.regex ?? '');
  const [cast, setCast] = React.useState<CastKind>(initial?.cast ?? 'text');

  React.useEffect(() => {
    if (!initial) return;
    setName(initial.name ?? '');
    setPage(initial.page ?? 0);
    setX0(initial.box?.[0] ?? 0);
    setY0(initial.box?.[1] ?? 0);
    setX1(initial.box?.[2] ?? 100);
    setY1(initial.box?.[3] ?? 30);
    setPad(initial.pad ?? 2);
    setJoin(initial.join_with_space ?? true);
    setRegex(initial.regex ?? '');
    setCast((initial.cast as CastKind) ?? 'text');
  }, [initial]);

  const submit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name,
      page,
      box: [x0, y0, x1, y1],
      pad,
      join_with_space: join,
      regex: regex || null,
      cast
    });
  };

  return (
    <form onSubmit={submit} className="w-full rounded-2xl bg-white p-4 shadow">
      <h3 className="mb-2 text-lg font-semibold">Campo de plantilla</h3>

      <div className="mb-2">
        <label className="text-sm text-gray-600">Nombre</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="text-sm text-gray-600">Página</label>
        <input type="number" value={page} onChange={(e)=>setPage(+e.target.value)} className="w-full rounded border px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="text-sm text-gray-600">Caja (puntos PDF)</label>
        <div className="grid grid-cols-4 gap-2">
          <input type="number" step="any" value={x0} onChange={(e)=>setX0(+e.target.value)} className="rounded border px-2 py-1" placeholder="x0" />
          <input type="number" step="any" value={y0} onChange={(e)=>setY0(+e.target.value)} className="rounded border px-2 py-1" placeholder="y0" />
          <input type="number" step="any" value={x1} onChange={(e)=>setX1(+e.target.value)} className="rounded border px-2 py-1" placeholder="x1" />
          <input type="number" step="any" value={y1} onChange={(e)=>setY1(+e.target.value)} className="rounded border px-2 py-1" placeholder="y1" />
        </div>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm text-gray-600">Pad</label>
          <input type="number" value={pad} onChange={(e)=>setPad(+e.target.value)} className="w-full rounded border px-2 py-1" />
        </div>
        <label className="flex items-end gap-2">
          <input type="checkbox" checked={join} onChange={(e)=>setJoin(e.target.checked)} />
          <span className="text-sm">Unir con espacio</span>
        </label>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm text-gray-600">Cast</label>
          <select value={cast} onChange={(e)=>setCast(e.target.value as CastKind)} className="w-full rounded border px-2 py-1">
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="currency">Moneda</option>
            <option value="date">Fecha</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Regex</label>
          <input value={regex} onChange={(e)=>setRegex(e.target.value)} className="w-full rounded border px-2 py-1" placeholder="\\d{2}/\\d{2}/\\d{4}" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && <button type="button" onClick={onCancel} className="rounded border px-3 py-1">Cancelar</button>}
        <button type="submit" className="rounded bg-indigo-600 px-3 py-1 text-white">Guardar</button>
      </div>
    </form>
  );
};

export default FieldForm;
