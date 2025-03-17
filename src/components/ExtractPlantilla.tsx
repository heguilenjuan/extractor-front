/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import SelectInput from "./SelectInput";
import Layout from "../pages/Layout";
import Input from "./Input";

const ExtractPlantilla = ({ plantillas }: any) => {
    const [selectedPlantilla, setSelectedPlantilla] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    console.log(plantillas)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            setFile(event.target.files[0]);
        }
    };

    const handleExtractData = async () => {
        if (!selectedPlantilla || !file) {
            setError("Debe seleccionar una plantilla y subir un archivo.");
            return;
        }

        setLoading(true);
        setError(null);
        setExtractedData(null);

        const formData = new FormData();
        formData.append("plantilla_id", selectedPlantilla);
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/extraer-datos-plantilla", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setExtractedData(result.data);
            } else {
                setError(result.error || "Error al extraer los datos.");
            }
        } catch (error) {
            setError("Error en la conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Extraer Datos desde PDF</h2>

                <Input handleFileChange={handleFileChange} file={file} />

                {/* Validación de plantillas antes de intentar mapear */}
                {plantillas && plantillas.length > 0 ? (
                    <>
                        {/* Selección de Plantilla */}
                        <label className="block text-gray-700 font-medium mb-2 pt-5">Seleccionar Plantilla</label>
                        <SelectInput
                            options={plantillas.map((plantilla: any) => ({
                                id: plantilla.id,
                                name: plantilla.nombre,
                            }))}
                            selectedOptions={selectedPlantilla}
                            onChange={(selected: string) => setSelectedPlantilla(selected)}
                        />
                    </>
                ) : (
                    <p className="text-red-600">No hay plantillas disponibles</p>
                )}

                {/* Botón para extraer datos */}
                <button
                    onClick={handleExtractData}
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded-md w-full mt-3 transition ${!file || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Extrayendo..." : "Extraer Datos"}
                </button>

                {/* Mostrar error si hay */}
                {error && <p className="mt-4 text-red-600">{error}</p>}

                {/* Mostrar datos extraídos */}
                {extractedData && (
                    <div className="mt-6 p-4 bg-gray-100 border rounded-md">
                        <h3 className="font-semibold mb-2">Datos Extraídos:</h3>
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                            {JSON.stringify(extractedData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ExtractPlantilla;

