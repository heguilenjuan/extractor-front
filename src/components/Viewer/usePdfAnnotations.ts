import { useState, useRef, useMemo, useCallback, useEffect } from 'react';

export interface Section {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dataType: string;
  regex: string;
  description: string;
}

interface UsePdfAnnotationsProps {
  file?: File;
  onSectionsChange?: (sections: Section[]) => void;
}

export const usePdfAnnotations = ({ file, onSectionsChange }: UsePdfAnnotationsProps) => {
  //Manejo de
  const [error, setError] = useState<string | null>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<Section> | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const url = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  // Cleanup URL cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  // Notificar cambios en las secciones
  useEffect(() => {
    onSectionsChange?.(sections);
  }, [sections, onSectionsChange]);

  const startDrawing = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentSection({
      x,
      y,
      width: 0,
      height: 0,
      dataType: "",
      regex: "",
      description: ""
    });
  }, []);

  const whileDrawing = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !currentSection || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentSection(prev => ({
      ...prev,
      width: x - (prev?.x || 0),
      height: y - (prev?.y || 0)
    }));
  }, [isDrawing, currentSection]);

  const stopDrawing = useCallback(() => {
    if (!currentSection || !currentSection.width || !currentSection.height) {
      setIsDrawing(false);
      setCurrentSection(null);
      return;
    }

    const newSection: Section = {
      id: Date.now().toString(),
      x: currentSection.x || 0,
      y: currentSection.y || 0,
      width: currentSection.width || 0,
      height: currentSection.height || 0,
      dataType: "",
      regex: "",
      description: ""
    };

    setSections(prev => [...prev, newSection]);
    setSelectedSection(newSection.id);
    setIsDrawing(false);
    setCurrentSection(null);
  }, [currentSection]);

  const updateSection = useCallback((id: string, updates: Partial<Section>) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    setSelectedSection(null);
  }, []);

  const clearSections = useCallback(() => {
    setSections([]);
    setSelectedSection(null);
  }, []);

  const selectedSectionData = sections.find(section => section.id === selectedSection);

  return {
    // State
    error,
    sections,
    isDrawing,
    currentSection,
    selectedSection,
    selectedSectionData,
    url,
    containerRef,
    
    // Refs
    setError,
    
    // Actions
    startDrawing,
    whileDrawing,
    stopDrawing,
    updateSection,
    deleteSection,
    clearSections,
    setSelectedSection,
    setIsDrawing
  };
};