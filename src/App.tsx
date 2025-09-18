import { useState } from "react";
import { pdfjs } from "react-pdf";
import PdfViewer from "./components/Viewer/PdfViewerWithAnnotations";
import FileField from "./components/Fields/FileField";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 flex flex-col text-center items-center">
      <FileField onChange={handleChange} />
      {file && <PdfViewer file={file} className="w-full max-w-7xl" />}
    </div>
  );
}
