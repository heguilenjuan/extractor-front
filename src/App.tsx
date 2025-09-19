import { useState } from "react";
import PdfViewer from "./components/Viewer/PdfViewerWithAnnotations";
import FileField from "./components/Fields/FileField";
import { convertPdfToImage } from "./utils/pdfToImage";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsConverting(true);
      
      try {
        const result = await convertPdfToImage(selectedFile, {
          scale: 2,
          dpi: 400,
          imageFormat: "png",
          imageQuality: 1.0,
          maxWidth: 1200,
        });
        
        if (result.success && result.imageData) {
          setImageData(result.imageData);
        } else {
          console.error("Error en conversión:", result.error);
        }
      } catch (error) {
        console.error("Error al convertir PDF:", error);
      } finally {
        setIsConverting(false);
      }
    }
  };

  return (
    <div className="p-6 flex flex-col text-center items-center">
      <FileField 
        onChange={handleChange} 
        label={isConverting ? "Convirtiendo PDF..." : "Seleccionar archivo PDF"}
      />
      
      {(file || imageData) && (
        <PdfViewer 
          file={file ?? undefined} 
          imageData={imageData || undefined}
          className="w-full max-w-7xl mt-6" 
        />
      )}
    </div>
  );
}