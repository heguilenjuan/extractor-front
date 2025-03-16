import { useEffect } from "react";
import List from "../components/List"
import { useFetchApi } from "../hook/useFetchApi"
import Layout from "./Layout"



const Plantillas = () => {
    const { data, fetchData } = useFetchApi("http://localhost:5000");

    useEffect(() => {
        fetchData("/plantillas");
    }, []);

    return (
        <Layout>
            <List data={data} />
        </Layout>
    )
}

export default Plantillas


