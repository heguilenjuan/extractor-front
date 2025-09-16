import { useState, useRef, useCallback } from "react";

interface UseFileDropProps {
  onFileLoad?: (file: File) => void;
  maxSizeMB?: number;
}

export const useFileDrop = ({ onFileLoad, maxSizeMB = 10 }: UseFileDropProps = {}) => {
    const [state, setState] = useState({
        file: null as File | null,
        isDragOver: false,
        isLoading: false,
        error: null as string | null,
        isSuccess: false
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Solo se permiten archivos PDF';
        }
        
        const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            return `El archivo es demasiado grande (máximo ${maxSizeMB}MB)`;
        }
        
        return null;
    }, [maxSizeMB]);

    const processFile = useCallback((file: File) => {
        const validationError = validateFile(file);

        if (validationError) {
            setState(prev => ({ ...prev, error: validationError, isSuccess: false }));
            return;
        }

        setState(prev => ({ ...prev, error: null, isLoading: true, isSuccess: false }));

        setTimeout(() => {
            setState(prev => ({
                ...prev,
                file,
                isLoading: false,
                isSuccess: true
            }));

            onFileLoad?.(file);
        }, 1000);
    }, [validateFile, onFileLoad]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState(prev => ({ ...prev, isDragOver: true }));
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState(prev => ({ ...prev, isDragOver: false }));
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState(prev => ({ ...prev, isDragOver: false }));

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    }, [processFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    }, [processFile]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const reset = useCallback(() => {
        setState({
            file: null,
            isDragOver: false,
            isLoading: false,
            error: null,
            isSuccess: false
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    return {
        ...state,
        fileInputRef,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileSelect,
        handleClick,
        reset,
        setError: (error: string | null) => setState(prev => ({ ...prev, error }))
    };
};