interface DrawingCanvasProps {
  isDrawing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  isDrawing,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}) => {
  return (
    <div
      className="absolute inset-0 z-20 cursor-crosshair"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      style={{ display: isDrawing ? 'block' : 'none' }}
    />
  );
};