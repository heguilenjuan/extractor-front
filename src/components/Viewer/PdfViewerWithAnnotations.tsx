import React, { useState } from 'react';
import { usePdfAnnotations, type Section } from './usePdfAnnotations';
import { PdfTools } from './PdfTools';
import { SectionsJsonView } from './SectionsJsonView';
import PdfError from './PdfError';
import { SectionEditor } from './SectionEditorProps';
import { SectionsOverlay } from './SectionOverlay';
import { DrawingCanvas } from './DrawingCanvas';


interface Props {
  file?: File;
  imageData?: string;
  className?: string;
  onSectionsChange?: (sections: Section[]) => void;
  onSaveTemplate?: (sections: Section[], templateName: string) => void;
}

const PdfViewerWithAnnotations: React.FC<Props> = ({
  file,
  imageData,
  className,
  onSectionsChange,
  onSaveTemplate
}) => {
  const [templateName, setTemplateName] = useState('');
  const [showJson, setShowJson] = useState(true);

  const {
    error,
    sections,
    isDrawing,
    currentSection,
    selectedSection,
    selectedSectionData,
    containerRef,
    setError,
    startDrawing,
    whileDrawing,
    stopDrawing,
    updateSection,
    deleteSection,
    setSelectedSection,
    setIsDrawing
  } = usePdfAnnotations({ file, onSectionsChange });

  const handleSaveTemplate = () => {
    if (onSaveTemplate && templateName.trim() && sections.length > 0) {
      onSaveTemplate(sections, templateName.trim());
      setTemplateName('');
    }
  };

  if (!file && !imageData) return null;

  return (
    <div className="flex flex-col content-center h-full w-full">
      {/*Visualización del PDF/Imagen */}
      <div className={`${className} relative mb-4`} ref={containerRef}>
        <PdfError error={error} />
        
        <SectionsOverlay
          sections={sections}
          currentSection={currentSection}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
        />

        {imageData ? (
          <img
            src={imageData}
            alt="Vista previa del PDF convertido"
            className="w-full h-full max-h-[60vh] object-contain rounded-lg border"
            onError={() => setError("Error al cargar la imagen")}
          />
        ) : null}
      </div>

      {/* Área inferior: Herramientas y JSON */}
      <div className="flex gap-4">
        {/* Panel izquierdo: Herramientas */}
        <div className="flex-1">
          <PdfTools
            isDrawing={isDrawing}
            sections={sections}
            selectedSection={selectedSection}
            templateName={templateName}
            onStartDrawing={() => setIsDrawing(true)}
            onSaveTemplate={handleSaveTemplate}
            onTemplateNameChange={setTemplateName}
            onDeleteSection={deleteSection}
            onToggleJson={() => setShowJson(!showJson)}
            showJson={showJson}
          />

          <DrawingCanvas
            isDrawing={isDrawing}
            onMouseDown={startDrawing}
            onMouseMove={whileDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />

          {selectedSectionData && (
            <SectionEditor
              section={selectedSectionData}
              selectedSection={selectedSection}
              onUpdateSection={updateSection}
              onDeleteSection={deleteSection}
            />
          )}
        </div>

        {/* Panel derecho: Vista JSON (condicional) */}
        {showJson && (
          <div className="w-80">
            <SectionsJsonView sections={sections} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewerWithAnnotations;