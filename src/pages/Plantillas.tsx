import { useEffect, useState } from "react";
import List from "../components/List";
import Modal from "../components/Modal";
import { useFetchApi } from "../hook/useFetchApi";
import Layout from "./Layout";

const Plantillas = () => {
    const { data, fetchData } = useFetchApi("http://localhost:5000");

    // Estado para la plantilla seleccionada y el modal
    const [selectedTemplate, setSelectedTemplate] = useState<unknown>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData("/plantillas");
    }, [fetchData]);

    return (
        <Layout>
            <List 
                data={data} 
                onDoubleClickTemplate={(template: unknown) => {
                    setSelectedTemplate(template);
                    setIsModalOpen(true);
                }} 
            />
            
            <Modal 
                isOpen={isModalOpen} 
                templateData={selectedTemplate} 
                onClose={() => setIsModalOpen(false)} 
            />
        </Layout>
    );
};

export default Plantillas;
