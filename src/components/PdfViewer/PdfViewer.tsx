import { useEffect, useMemo, useState } from "react";

interface Props {
    file?: File;
    className?: string;
}

const PdfViewer = ({ file, className }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const url = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

    useEffect(() => {
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [url]);

    if (!file) return null;

    return (
        <div className={`${className} relative`}>
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-500 text-center p-4">{error}</p>
                </div>
            )}
            <iframe
                src={url}
                className="w-full h-[70vh] rounded-lg border"
                onError={() => setError("Error al cargar el PDF. Asegúrate de que es un archivo válido.")}
                title="Vista previa del PDF"
            />
        </div>
    );
};

export default PdfViewer;