import { useState } from "react";

interface SelectInputProps {
  options: { id: string; name: string }[]; // Cambié para que sea más específico
  selectedOptions: string | null; // Se asume solo una opción seleccionada
  onChange: (selected: string) => void;
}

const SelectInput = ({ options, selectedOptions, onChange }: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selectedOptions === option) {
      onChange(null); // Deseleccionar si ya está seleccionado
    } else {
      onChange(option); // Seleccionar opción
    }
    setIsOpen(false); // Cierra el menú al seleccionar
  };

  return (
    <div className="relative max-w-md mx-auto mt-4">
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate">
          {selectedOptions ? options.find(opt => opt.id === selectedOptions)?.name : "Seleccionar opción"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
              onClick={() => toggleOption(option.id)}
            >
              <span className="block truncate">{option.name}</span>
              {selectedOptions === option.id && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectInput;
