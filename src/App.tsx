import { useState } from "react";
import { pdfjs } from 'react-pdf';
import PdfViewer from "./components/Viewer/PdfViewerWithAnnotations";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
      />
      <div style={{ marginTop: "20px" }}>
        {file && <PdfViewer file={file} />}
      </div>
    </div>
  );
}