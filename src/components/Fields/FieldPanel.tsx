// FieldPanel.tsx

import type { Field, Normalizer } from "./fields.types";

export default function FieldPanel({
  boxName, fields, onAdd, onUpdate, onRemove,
}: {
  boxName: string; fields: Field[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Field>) => void;
  onRemove: (id: string) => void;
}) {
  const norms: Normalizer[] = ['trim', 'toUpper', 'toLower', 'removeSpaces', 'keepDigits'];

  const toggle = (f: Field, n: Normalizer) => {
    const set = new Set(f.normalizers ?? []);
    if (set.has(n)) set.delete(n); else set.add(n);
    onUpdate(f.id, { normalizers: Array.from(set) });
  };

  return (
    <div className="w-full max-w-3xl border rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          Campos del box: <span className="text-blue-600">{boxName || 'sin nombre'}</span>
        </h3>
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={onAdd}>+ Agregar campo</button>
      </div>

      {fields.length === 0 && <div className="text-sm text-gray-500">No hay campos aún.</div>}

      {fields.map(f => (
        <div key={f.id} className="border rounded p-3 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="border rounded px-2 py-1"
              value={f.key ?? ''}                       
              onChange={e => onUpdate(f.id, { key: e.target.value })}
              placeholder="nombre del campo"
            />
            <input
              className="border rounded px-2 py-1"
              value={f.regex ?? ''}
              onChange={e => onUpdate(f.id, { regex: e.target.value })}
              placeholder="regex (opcional)"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {norms.map(n => {
              const active = f.normalizers?.includes(n);
              return (
                <button
                  key={n}
                  className={`px-2 py-1 rounded border ${active ? 'bg-blue-600 text-white' : ''}`}
                  onClick={() => toggle(f, n)}
                  type="button"
                >
                  {n}
                </button>
              );
            })}
            <label className="ml-auto flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!f.required}
                onChange={e => onUpdate(f.id, { required: e.target.checked })}
              />
              requerido
            </label>
          </div>

          <div className="text-right">
            <button className="text-red-600" onClick={() => onRemove(f.id)} type="button">
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
