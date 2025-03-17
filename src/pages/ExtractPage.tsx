import { useEffect } from 'react';
import ExtractPlantilla from '../components/ExtractPlantilla'
import { useFetchApi } from '../hook/useFetchApi';

const ExtractPage = () => {
    const { data, fetchData } = useFetchApi<Data>("http://localhost:5000");

    useEffect(() => {
        fetchData("/plantillas");
    }, []);


    const data_plantillas = data && data.plantillas.length !== 0 ? data.plantillas : [];

    console.log(data_plantillas)
    return (
        <ExtractPlantilla plantillas={data_plantillas} />
    )
}

export default ExtractPage