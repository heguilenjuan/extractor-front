import { useState } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
    method?: Method;
    body?: unknown;
    headers?: HeadersInit;
    isFormData?: boolean;
}

export const useFetchApi = (baseUrl: string) => {
    const [data, setData] = useState<unknown>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (endpoint: string, options: FetchOptions = {}) => {
        setLoading(true);
        setError(null);

        const { method = "GET", body, headers, isFormData = false } = options;

        const requestOptions: RequestInit = {
            method,
            headers: isFormData
                ? headers
                : {
                    "Content-Type": "application/json",
                    ...headers,
                },
            body: isFormData ? (body as BodyInit) : JSON.stringify(body),
        };

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const result = await response.json();
            setData(result);
            return result;
        } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fetchData };
};
