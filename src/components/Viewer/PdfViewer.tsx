interface Props {
    imageData: string | "";
}

const PdfViewer = ({ imageData }: Props) => {
    return (
        <div className={''}>
            <img
                src={imageData}
                alt="Vista previa del PDF convertido"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg border"
            />
        </div>
    )
}

export default PdfViewer