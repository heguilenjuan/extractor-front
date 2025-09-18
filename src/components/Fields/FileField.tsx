import React from "react";

type FileFieldProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  label?: string;
};

export default function FileField({
  onChange,
  accept = ".pdf,application/pdf",
  label = "Seleccionar archivo PDF",
}: FileFieldProps) {
  const inputId = "file-field";

  return (
    <div className="flex flex-col gap-2 w-64 p-4">
      {label && <span className="text-sm font-semibold text-gray-800">{label}</span>}
      <label
        htmlFor={inputId}
        className="inline-block cursor-pointer rounded-lg px-4 py-2 text-sm font-medium 
        shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Subir archivo
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
