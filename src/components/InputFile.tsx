import { useState } from "react";
import { useExtractionService } from "./extractionService";

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
                <div className={"items-center justify-center max-w-xl mx-auto"}>
                    <label
                        className={"flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"}
                        id="drop"
                    >
                        <span className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <span className="font-medium text-gray-600">
                                Arrastra el archivo, o
                                <span className="text-blue-600 underline ml-[4px]">buscalo</span>
                            </span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    {file && <p className="mt-2 text-sm text-gray-500 text-center">📄 {file.name}</p>}
                </div>

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
