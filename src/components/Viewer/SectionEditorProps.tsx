interface SectionEditorProps {
  section: any;
  selectedSection: string | null;
  onUpdateSection: (id: string, updates: any) => void;
  onDeleteSection: (id: string) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  selectedSection,
  onUpdateSection,
  onDeleteSection
}) => {
  if (!section || !selectedSection) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border mt-3">
      <h3 className="font-semibold mb-3 text-center">Editor de Sección</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre del campo:</label>
          <input
            type="text"
            value={section.dataType}
            onChange={(e) => onUpdateSection(selectedSection, { dataType: e.target.value })}
            placeholder="Ej: razon_social, cuit, importe_total"
            className="w-full p-2 border rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de dato:</label>
          <select
            value={section.fieldType || 'text'}
            onChange={(e) => onUpdateSection(selectedSection, { fieldType: e.target.value })}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="date">Fecha</option>
            <option value="currency">Moneda</option>
            <option value="boolean">Sí/No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción:</label>
          <textarea
            value={section.description || ''}
            onChange={(e) => onUpdateSection(selectedSection, { description: e.target.value })}
            placeholder="Descripción del campo..."
            className="w-full p-2 border rounded text-sm h-16"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs bg-gray-100 p-2 rounded">
            <strong>Posición:</strong><br/>
            X: {Math.round(section.x)}px<br/>
            Y: {Math.round(section.y)}px
          </div>
          <div className="text-xs bg-gray-100 p-2 rounded">
            <strong>Tamaño:</strong><br/>
            Ancho: {Math.round(section.width)}px<br/>
            Alto: {Math.round(section.height)}px
          </div>
        </div>

        <button
          onClick={() => onDeleteSection(selectedSection)}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 w-full text-sm"
        >
          🗑️ Eliminar Esta Sección
        </button>
      </div>
    </div>
  );
};