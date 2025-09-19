interface PdfErrorProps {
    error: string | null;
}

const PdfError = ({ error }: PdfErrorProps) => {
    if (!error) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg border border-red-200 z-50">
            <p className="text-red-500 text-center p-4">{error}</p>
        </div>
    )
}

export default PdfError;