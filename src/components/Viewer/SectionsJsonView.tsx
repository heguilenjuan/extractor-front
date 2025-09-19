interface SectionsJsonViewProps {
    sections: any[];
}

export const SectionsJsonView = ({ sections }: SectionsJsonViewProps) => {
    const formatSection = (section: any) => ({
        id: section.id,
        name: section.dataType || 'sin_nombre',
        type: section.fieldType || 'text',
        coordinates: {
            x: Math.round(section.x),
            y: Math.round(section.y),
            width: Math.round(section.width),
            height: Math.round(section.height)
        },
        description: section.description || '',
        validation: section.validationRules || ['required']
    });

    const jsonData = sections.map(formatSection)

    return (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg shadow-lg border border-gray-700 h-full overflow-auto">
            <h3 className="font-mono font-semibold mb-3 text-center text-green-300">VISTA JSON</h3>

            <div className="text-xs font-mono">
                {sections.length === 0 ? (
                    <p className="text-gray-400 text-center">No hay secciones creadas</p>
                ) : (
                    <pre className="overflow-auto max-h-96">
                        {JSON.stringify(jsonData, null, 2)}
                    </pre>
                )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-gray-400 text-xs">
                    <strong>Total:</strong>{sections.length} seccion(es)
                </p>
                <p className="text-gray-400 text-xs">
                    <strong>Ultima actualizacion:</strong> {new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    )
}
