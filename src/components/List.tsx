/* eslint-disable @typescript-eslint/no-explicit-any */
const List = ({ data, onDoubleClickTemplate }: { data: any, onDoubleClickTemplate: (template: any) => void }) => {
    return (
        <>
            {data?.plantillas && data.plantillas.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Nombre</th>
                                <th className="py-3 px-6 text-left">Descripción</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {data.plantillas.map((plantilla: any, index: number) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                    onDoubleClick={() => onDoubleClickTemplate(plantilla)} // 👈 Manejo del doble clic
                                >
                                    <td className="py-3 px-6 text-left">{plantilla.id}</td>
                                    <td className="py-3 px-6 text-left">{plantilla.nombre}</td>
                                    <td className="py-3 px-6 text-left">{plantilla.descripcion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <h2 className="w-full text-center py-4">No hay plantillas creadas</h2>
            )}
        </>
    );
};

export default List;
