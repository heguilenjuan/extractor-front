import { useState } from "react";

interface ViewDataProps {
  extractedData: { [key: string]: unknown };
  onCreateTemplate: (template: unknown) => void;
}

const ViewData = ({ extractedData, onCreateTemplate }: ViewDataProps) => {
  const [fields, setFields] = useState<{ [key: string]: string }>({});
  const [templateName, setTemplateName] = useState<string>(""); // Estado para el nombre de la plantilla
  const [templateDescription, setTemplateDescription] = useState<string>(""); // Estado para la descripción de la plantilla
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (field: string, key: string) => {
    setFields((prev) => ({ ...prev, [field]: key }));
  };

  const handleCreateTemplate = async () => {
    // Asegurarse de que el nombre y la descripción estén completos
    if (!templateName || !templateDescription) {
      setError("Por favor, ingresa un nombre y una descripción para la plantilla.");
      return;
    }

    const template = Object.keys(fields).map((field) => ({
      key: fields[field],
      value: extractedData[field],
    }));

    const templateData = {
      nombre: templateName,
      descripcion: templateDescription,
      datos: template,
    };

    setLoading(true);
    setError(null); // Reseteamos cualquier error previo

    try {
      const response = await fetch("http://127.0.0.1:5000/crear-plantilla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      const result = await response.json();
      if (response.ok) {
        // Si la respuesta es exitosa
        console.log("Plantilla creada:", result);
        onCreateTemplate(result); // Llamar a la función para manejar la plantilla
      } else {
        // Si hay algún error
        setError(result.error || "Hubo un error al crear la plantilla.");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos Extraídos</h2>

      {/* Campos para personalizar nombre y descripción de la plantilla */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-700 font-medium">Nombre de la Plantilla</label>
          <input
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ingresa el nombre de la plantilla"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Descripción de la Plantilla</label>
          <textarea
            className="w-full p-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ingresa la descripción de la plantilla"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {Object.keys(extractedData).map((field) => {
          const item = extractedData[field];

          return (
            <>
              <div key={field} className="flex justify-between items-center gap-4">
                <div className="flex-1">
                  <span className="text-gray-700 font-medium">{typeof item === 'object' ? (item as any).text : item}</span>
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Asignar clave..."
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                  />
                </div>
              </div>
              <hr />
            </>

          );
        })}
      </div>

      <button
        onClick={handleCreateTemplate}
        disabled={loading}
        className="mt-6 w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors focus:outline-none"
      >
        {loading ? "Creando..." : "Crear Plantilla"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ViewData;
