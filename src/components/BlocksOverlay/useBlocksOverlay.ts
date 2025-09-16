import { useCallback } from 'react';
import { FieldDefinition } from '../components/FieldsList';
import { PlacedField } from './usePdfFields';

interface UseBlocksOverlayProps {
  onFieldSelect: (field: PlacedField) => void;
  onFieldAdd: (field: FieldDefinition, x: number, y: number, page: number) => void;
  currentPage: number;
}

export const useBlocksOverlay = ({ onFieldSelect, onFieldAdd, currentPage }: UseBlocksOverlayProps) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const fieldData = e.dataTransfer.getData('application/json');
      if (!fieldData) return;

      const field: FieldDefinition = JSON.parse(fieldData);
      const rect = e.currentTarget.getBoundingClientRect();
      
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      
      onFieldAdd(field, x, y, currentPage);
    } catch (error) {
      console.error('Error processing dropped field:', error);
    }
  }, [onFieldAdd, currentPage]);

  const getFieldStyle = useCallback((field: PlacedField) => ({
    left: `${field.x}%`,
    top: `${field.y}%`,
    width: `${field.width}%`,
    height: `${field.height}%`,
  }), []);

  const getFieldColor = useCallback((type: string): string => {
    const colors: { [key: string]: string } = {
      text: 'bg-blue-200 border-blue-400',
      number: 'bg-green-200 border-green-400',
      date: 'bg-purple-200 border-purple-400',
      signature: 'bg-yellow-200 border-yellow-400',
      checkbox: 'bg-red-200 border-red-400'
    };
    return colors[type] || 'bg-gray-200 border-gray-400';
  }, []);

  return {
    handleDragOver,
    handleDrop,
    getFieldStyle,
    getFieldColor
  };
};