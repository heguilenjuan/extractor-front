import React from 'react';

const FileDrop: React.FC<{ onFile: (f: File) => void; accept?: string }> = ({ onFile, accept }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };
  return (
    <label className="grid h-40 place-items-center rounded-xl border-2 border-dashed text-gray-500">
      <div>
        <div className="font-medium">Arrastrá un PDF o hacé click</div>
        <div className="text-xs">Solo .pdf</div>
      </div>
      <input type="file" className="hidden" accept={accept || 'application/pdf'} onChange={onChange} />
    </label>
  );
};

export default FileDrop;
