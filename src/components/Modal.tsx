interface ModalProps {
  isOpen: boolean;
  templateData: unknown;
  onClose: () => void;
}

const Modal = ({ isOpen, templateData, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative">
        <h2 className="text-lg font-semibold">Plantilla Generada</h2>
        <pre className="bg-gray-100 p-3 mt-2 text-sm overflow-auto max-h-80">
          {JSON.stringify(templateData, null, 2)}
        </pre>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
