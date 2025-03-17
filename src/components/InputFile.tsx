import { useState } from "react";
import { useExtractionService } from "./extractionService";
import Input from "./Input";

interface InputFileProps {
    onDataExtracted: (data: Record<string, unknown>) => void;
}

const InputFile = ({ onDataExtracted }: InputFileProps) => {
    const [file, setFile] = useState<File | null>(null);
    const { extractData, loading, error } = useExtractionService();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const extractedData = await extractData(file);
        if (extractedData) {
            onDataExtracted(extractedData);
            setFile(null);
        }
    };

    return (
        <div className={"flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0"}>
            <div className={"relative w-full"}>
                <Input handleFileChange={handleFileChange} file={file} />

                {/* Botón deshabilitado hasta que haya un archivo */}
                <button
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`px-4 py-2 text-white rounded-md w-full mt-3 transition ${!file || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Extrayendo..." : "Extraer Datos"}
                </button>
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default InputFile;
