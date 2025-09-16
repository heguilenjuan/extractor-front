import { useCallback } from 'react';
import { FieldDefinition } from '../components/FieldsList';

interface UseFieldsListProps {
  onAddField: (field: FieldDefinition) => void;
}

export const useFieldsList = ({ onAddField }: UseFieldsListProps) => {
  const defaultFields: FieldDefinition[] = [
    { id: 'name', name: 'Nombre completo', type: 'text', required: true },
    { id: 'email', name: 'Email', type: 'text', required: true },
    { id: 'phone', name: 'Teléfono', type: 'text' },
    { id: 'date', name: 'Fecha', type: 'date' },
    { id: 'amount', name: 'Monto', type: 'number' },
    { id: 'signature', name: 'Firma', type: 'signature' },
    { id: 'approved', name: 'Aprobado', type: 'checkbox' },
  ];

  const getFieldIcon = useCallback((type: string): string => {
    const icons: { [key: string]: string } = {
      text: '📝',
      number: '🔢',
      date: '📅',
      signature: '✍️',
      checkbox: '☑️'
    };
    return icons[type] || '📋';
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, field: FieldDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify(field));
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  const handleFieldClick = useCallback((field: FieldDefinition) => {
    onAddField(field);
  }, [onAddField]);

  return {
    defaultFields,
    getFieldIcon,
    handleDragStart,
    handleFieldClick
  };
};