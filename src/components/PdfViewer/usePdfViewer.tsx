import { useState, useCallback } from 'react';

export interface FieldDefinition {
  name: string | number | readonly string[] | undefined;
  type: string | number | readonly string[] | undefined;
  required: boolean;
  id: string;
}

export interface PlacedField extends FieldDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

interface UsePdfFieldsReturn {
  fields: PlacedField[];
  selectedField: PlacedField | null;
  addField: (field: FieldDefinition, x: number, y: number, page: number) => void;
  updateField: (fieldId: string, updates: Partial<PlacedField>) => void;
  updateFieldPosition: (fieldId: string, x: number, y: number) => void;
  updateFieldSize: (fieldId: string, width: number, height: number) => void;
  removeField: (fieldId: string) => void;
  clearFields: () => void;
  setSelectedField: (field: PlacedField | null) => void;
}

export const usePdfFields = (): UsePdfFieldsReturn => {
  const [fields, setFields] = useState<PlacedField[]>([]);
  const [selectedField, setSelectedField] = useState<PlacedField | null>(null);

  const addField = useCallback((fieldDefinition: FieldDefinition, x: number, y: number, page: number) => {
    const newField: PlacedField = {
      ...fieldDefinition,
      id: `${fieldDefinition.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      width: 20,
      height: 8,
      page
    };
    
    setFields(prev => [...prev, newField]);
    setSelectedField(newField);
  }, []);

  const updateField = useCallback((fieldId: string, updates: Partial<PlacedField>) => {
    setFields(prev => prev.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ));
    
    if (selectedField?.id === fieldId) {
      setSelectedField(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedField]);

  const updateFieldPosition = useCallback((fieldId: string, x: number, y: number) => {
    updateField(fieldId, { x, y });
  }, [updateField]);

  const updateFieldSize = useCallback((fieldId: string, width: number, height: number) => {
    updateField(fieldId, { width, height });
  }, [updateField]);

  const removeField = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  }, [selectedField]);

  const clearFields = useCallback(() => {
    setFields([]);
    setSelectedField(null);
  }, []);

  return {
    fields,
    selectedField,
    addField,
    updateField,
    updateFieldPosition,
    updateFieldSize,
    removeField,
    clearFields,
    setSelectedField
  };
};