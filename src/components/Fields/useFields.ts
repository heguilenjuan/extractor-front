import { useCallback, useState } from "react";
import type { Field } from "./fields.types";


export function useFields() {
    const [fieldsByBox, setFieldsByBox] = useState<Record<string, Field[]>>({});
    const forBox = useCallback((boxId: string) => fieldsByBox[boxId] ?? [], [fieldsByBox]);

    const add = useCallback((boxId: string) => {
        const id = crypto.randomUUID();
        setFieldsByBox(prev => ({
            ...prev,
            [boxId]: [...(prev[boxId] ?? []), { id, boxId, key: 'nuevo_campo', required: true, normalizers: ['trim'] }]
        }));
    }, []);

    const patch = useCallback((boxId: string, fieldId: string, p: Partial<Field>) => {
        setFieldsByBox(prev => ({
            ...prev,
            [boxId]: (prev[boxId] ?? []).map(f => f.id === fieldId ? { ...f, ...p } : f),
        }));
    }, []);

    const remove = useCallback((boxId: string, fieldId: string) => {
        setFieldsByBox(prev => ({
            ...prev,
            [boxId]: (prev[boxId] ?? []).filter(f => f.id !== fieldId),
        }));
    }, []);

    const clearBox = useCallback((boxId: string) => {
        setFieldsByBox(prev => {
            const { [boxId]: _, ...rest } = prev;
            return rest;
        });
    }, [])

    return { fieldsByBox, forBox, add, patch, remove, clearBox }
}