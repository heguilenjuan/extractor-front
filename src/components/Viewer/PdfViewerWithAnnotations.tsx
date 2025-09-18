import React from 'react';
import { usePdfAnnotations, type Section } from './usePdfAnnotations';

interface Props {
  file?: File;
  className?: string;
  onSectionsChange?: (sections: Section[]) => void;
}

const PdfViewerWithAnnotations: React.FC<Props> = ({ file, className, onSectionsChange }) => {
  const {
    error,
    sections,
    isDrawing,
    currentSection,
    selectedSection,
    selectedSectionData,
    url,
    containerRef,
    setError,
    startDrawing,
    whileDrawing,
    stopDrawing,
    updateSection,
    deleteSection,
    setSelectedSection,
    setIsDrawing
  } = usePdfAnnotations({ file, onSectionsChange });

  if (!file) return null;

  return (
    <div className={`${className} relative`} ref={containerRef}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg border border-red-200 z-50">
          <p className="text-red-500 text-center p-4">{error}</p>
        </div>
      )}

      {/* Controles */}
      <div className="absolute top-4 left-4 z-30 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">Herramientas</h3>
        <button
          onClick={() => setIsDrawing(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded mb-2 hover:bg-blue-600"
        >
          🖌️ Dibujar Sección
        </button>
        <p className="text-sm text-gray-600">Haz clic y arrastra sobre el PDF</p>
      </div>

      {/* Panel de edición */}
      {selectedSectionData && (
        <div className="absolute right-4 top-4 z-30 bg-white p-4 rounded-lg shadow-lg w-80">
          <h3 className="font-semibold mb-3">Editar Sección</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Dato</label>
              <input
                type="text"
                value={selectedSectionData.dataType}
                onChange={(e) => updateSection(selectedSection!, { dataType: e.target.value })}
                placeholder="Ej: Nombre, Email, Teléfono..."
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Regex Validación</label>
              <input
                type="text"
                value={selectedSectionData.regex}
                onChange={(e) => updateSection(selectedSection!, { regex: e.target.value })}
                placeholder="Ej: ^[a-zA-Z ]+$"
                className="w-full p-2 border rounded font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={selectedSectionData.description}
                onChange={(e) => updateSection(selectedSection!, { description: e.target.value })}
                placeholder="Describe qué dato extraer..."
                className="w-full p-2 border rounded resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={() => deleteSection(selectedSection!)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
            >
              Eliminar Sección
            </button>
          </div>
        </div>
      )}

      {/* Lista de secciones */}
      <div className="absolute left-4 bottom-4 z-30 bg-white p-4 rounded-lg shadow-lg max-w-sm">
        <h3 className="font-semibold mb-2">Secciones ({sections.length})</h3>
        <div className="max-h-40 overflow-y-auto">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`p-2 mb-1 rounded cursor-pointer ${
                selectedSection === section.id ? 'bg-blue-100' : 'bg-gray-100'
              }`}
              onClick={() => setSelectedSection(section.id)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {section.dataType || "Sin nombre"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSection(section.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              {section.description && (
                <p className="text-xs text-gray-600 truncate">{section.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Canvas para dibujar */}
      <div
        className="absolute inset-0 z-20 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={whileDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ display: isDrawing ? 'block' : 'none' }}
      />

      {/* Renderizar secciones */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {sections.map((section) => (
          <div
            key={section.id}
            className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20 hover:bg-opacity-30 cursor-pointer"
            style={{
              left: section.x,
              top: section.y,
              width: section.width,
              height: section.height,
              border: selectedSection === section.id ? '3px solid red' : '2px solid blue'
            }}
            onClick={() => setSelectedSection(section.id)}
          >
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {section.dataType || "Sección"}
            </div>
          </div>
        ))}

        {currentSection && (
          <div
            className="absolute border-2 border-dashed border-green-500 bg-green-200 bg-opacity-20"
            style={{
              left: currentSection.x,
              top: currentSection.y,
              width: currentSection.width,
              height: currentSection.height
            }}
          />
        )}
      </div>

      <iframe
        src={url}
        className="w-full h-[70vh] rounded-lg border"
        onError={() => setError("Error al cargar el PDF")}
        title="Vista previa del PDF"
      />
    </div>
  );
};

export default PdfViewerWithAnnotations;