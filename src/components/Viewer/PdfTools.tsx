interface Props {
    isDrawing: boolean;
    sections: any[];
    selectedSection: string | null;
    templateName: string;
    showJson: boolean;
    onStartDrawing: () => void;
    onSaveTemplate: () => void;
    onTemplateNameChange: (name: string) => void;
    onDeleteSection: (id: string) => void;
    onToggleJson: () => void;
}

export const PdfTools = ({
    isDrawing,
    sections,
    selectedSection,
    templateName,
    showJson,
    onStartDrawing,
    onSaveTemplate,
    onTemplateNameChange,
    onDeleteSection,
    onToggleJson
}: Props) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
            <h3 className="font-semibold mb-3 text-center">Herramientas de secciones</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                    onClick={onStartDrawing}
                    className={`px-3 py-2 rounded ${isDrawing ?
                            'bg-blue-600 text-white' :
                            'bg-blue-500 text-white hover:bg-blue-600'}`
                    }
                >
                    {showJson ? '⬅ Ocultar JSON': '➡ Mostrar JSON'}
                </button>
            </div>

            {selectedSection && (
                <button
                    onClick={() => onDeleteSection(selectedSection)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 w-full mb-3"
                >
                    🗑 Eliminar seccion seleccionada
                </button>
            )}
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Nombre de Plantilla:</label>
                <input
                    type="text"
                    value={templateName}
                    onChange={(e) => onTemplateNameChange(e.target.value)}
                    placeholder="Ej: Factura Proveedor X"
                    className="w-full p-2 border rounded text-sm"
                />
            </div>

            <button
                onClick={onSaveTemplate}
                disabled={!templateName.trim() ||sections.length === 0}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 w-full disbled:opacity-50 disabled:cursor-not-allowed"
            >
                💾 Guardar Secciones
            </button>

            <div className="mt-3 p-2 bg-gray-100 rounded">
                <p className="text-xs text-gray-600 text-center">
                    Secciones creadas: <strong>{sections.length}</strong>
                </p>
                <p className="text-xs text-gray-600 text-center">
                    {isDrawing && 'Haz clic y arrastra sobre la imagen'}
                </p>
            </div>
        </div>
    )
}