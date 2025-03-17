import { useState } from "react";
import InputFile from "../components/InputFile"
import Modal from "../components/Modal"
import ViewData from "../components/ViewData"
import Layout from "./Layout";

const Home = () => {
    const [data, setData] = useState<Record<string, unknown> | null>(null);
    const [template, setTemplate] = useState<unknown>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Layout>
            <InputFile onDataExtracted={setData} />
            {data && (
                <ViewData extractedData={data} onCreateTemplate={(template) => {
                    setTemplate(template);
                    setIsModalOpen(true);
                }} />
            )}
            <Modal isOpen={isModalOpen} templateData={template} onClose={() => setIsModalOpen(false)} />

        </Layout>
    )
}

export default Home