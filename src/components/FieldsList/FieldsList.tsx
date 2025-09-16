import React from 'react';
import type { FieldDefinition } from '../PdfViewer/usePdfViewer';
import { useFieldsList } from './useFieldsList';

interface FieldsListProps {
  fields?: FieldDefinition[];
  onAddField: (field: FieldDefinition) => void;
}

export const FieldsList: React.FC<FieldsListProps> = ({ 
  fields, 
  onAddField 
}) => {
  const {
    defaultFields,
    getFieldIcon,
    handleDragStart,
    handleFieldClick
  } = useFieldsList({ onAddField });

  const displayFields = fields || defaultFields;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Campos disponibles</h3>
      <div className="space-y-2">
        {displayFields.map((field) => (
          <div
            key={field.id}
            draggable
            onDragStart={(e) => handleDragStart(e, field)}
            onClick={() => handleFieldClick(field)}
            className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors group"
          >
            <span className="text-xl mr-3">{getFieldIcon(field.type)}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-800 group-hover:text-blue-600">
                {field.name}
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {field.type} {field.required && '• Requerido'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};