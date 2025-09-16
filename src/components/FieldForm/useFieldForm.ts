import { useCallback } from 'react';
import { PlacedField } from './usePdfFields';

interface UseFieldFormProps {
  field: PlacedField;
  onUpdate: (fieldId: string, updates: Partial<PlacedField>) => void;
  onDelete: (fieldId: string) => void;
}

export const useFieldForm = ({ field, onUpdate, onDelete }: UseFieldFormProps) => {
  const handleNameChange = useCallback((name: string) => {
    onUpdate(field.id, { name });
  }, [field.id, onUpdate]);

  const handleTypeChange = useCallback((type: string) => {
    onUpdate(field.id, { type: type as any });
  }, [field.id, onUpdate]);

  const handleWidthChange = useCallback((width: number) => {
    onUpdate(field.id, { width: Math.max(5, Math.min(100, width)) });
  }, [field.id, onUpdate]);

  const handleHeightChange = useCallback((height: number) => {
    onUpdate(field.id, { height: Math.max(5, Math.min(100, height)) });
  }, [field.id, onUpdate]);

  const handleRequiredChange = useCallback((required: boolean) => {
    onUpdate(field.id, { required });
  }, [field.id, onUpdate]);

  const handleDelete = useCallback(() => {
    onDelete(field.id);
  }, [field.id, onDelete]);

  return {
    handleNameChange,
    handleTypeChange,
    handleWidthChange,
    handleHeightChange,
    handleRequiredChange,
    handleDelete
  };
};