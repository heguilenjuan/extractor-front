import { useFetchApi } from "../hook/useFetchApi";

export const useExtractionService = () => {
  const { loading, error, fetchData } = useFetchApi("http://127.0.0.1:5000/extract_data");

  const extractData = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetchData("", {
        method: "POST",
        body: formData,
        isFormData: true, 
      });

      return response.data; 
    } catch (err) {
      console.error(err); 
      return null; 
    }
  };

  return { extractData, loading, error };
};
