interface SectionsOverlayProps {
  sections: any[];
  currentSection: any;
  selectedSection: string | null;
  onSelectSection: (id: string) => void;
}

export const SectionsOverlay: React.FC<SectionsOverlayProps> = ({
  sections,
  currentSection,
  selectedSection,
  onSelectSection
}) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {sections.map((section) => (
        <div
          key={section.id}
          className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20 hover:bg-opacity-30 cursor-pointer pointer-events-auto"
          style={{
            left: section.x,
            top: section.y,
            width: section.width,
            height: section.height,
            border: selectedSection === section.id ? '3px solid red' : '2px solid blue'
          }}
          onClick={() => onSelectSection(section.id)}
        >
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {section.dataType || "Sección"}
          </div>
        </div>
      ))}

      {currentSection && (
        <div
          className="absolute border-2 border-dashed border-green-500 bg-green-200 bg-opacity-20"
          style={{
            left: currentSection.x,
            top: currentSection.y,
            width: currentSection.width,
            height: currentSection.height
          }}
        />
      )}
    </div>
  );
};