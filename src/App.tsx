import { useState } from "react";
import InputFile from "./components/InputFile";
import Modal from "./components/Modal";
import ViewData from "./components/ViewData";

function App() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [template, setTemplate] = useState<unknown>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debugging console log
  console.log("Data en App:", data);

  return (
    <main className="p-5">
      <InputFile onDataExtracted={setData} />
      {data && (
        <ViewData extractedData={data} onCreateTemplate={setTemplate} />
      )}
      <Modal isOpen={isModalOpen} templateData={template} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}

export default App;
