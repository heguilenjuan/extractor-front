import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
// Configuración global de pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface PdfConversionOptions {
  scale?: number;
  pageNumber?: number;
  imageFormat?: 'png' | 'jpeg' | 'webp';
  imageQuality?: number;
  maxWidth?: number;
  dpi?: number;
}

export interface ConversionResult {
  success: boolean;
  imageData?: string;
  error?: string;
  pageCount?: number;
  width?: number;
  height?: number;
  pageNumber?: number;
}

/* Convierte un archivo PDF a imagen (Data URL) usando solo pdfjs-dist*/

export const convertPdfToImage = async (
  pdfFile: File,
  options: PdfConversionOptions = {}
): Promise<ConversionResult> => {
  try {
    const {
      scale = 2.0,
      pageNumber = 1,
      imageFormat = 'png',
      imageQuality = 0.99,
      maxWidth = 1600,
      dpi = 150
    } = options;

    // 1. Leer el archivo como ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();

    // 2. Cargar el documento PDF
    const pdfDocument = await pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0 // Reduce logs para mejor performance
    }).promise;

    const totalPages = pdfDocument.numPages;

    // Validar número de página
    if (pageNumber < 1 || pageNumber > totalPages) {
      return {
        success: false,
        error: `Número de página inválido. El PDF tiene ${totalPages} páginas.`
      };
    }

    // 3. Obtener la página específica
    const page = await pdfDocument.getPage(pageNumber);

    // Calcular escala basada en DPI si se especifica
    const actualScale = dpi ? dpi / 72 : scale;
    const viewport = page.getViewport({ scale: actualScale });

    // 4. Crear canvas para renderizar el PDF
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return {
        success: false,
        error: 'No se pudo obtener el contexto del canvas'
      };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // 5. Renderizar la página en el canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;

    // 6. Optimizar tamaño si es necesario
    const optimizedCanvas = await optimizeCanvasSize(canvas, maxWidth, imageFormat, imageQuality);

    // 7. Convertir canvas a Data URL
    const imageData = optimizedCanvas.toDataURL(
      `image/${imageFormat}`,
      imageQuality
    );

    return {
      success: true,
      imageData,
      pageCount: totalPages,
      width: optimizedCanvas.width,
      height: optimizedCanvas.height,
      pageNumber
    };

  } catch (error) {
    console.error('Error converting PDF to image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al convertir PDF'
    };
  }
};

/**
 * Optimiza el tamaño del canvas si excede el máximo ancho
 */
const optimizeCanvasSize = async (
  canvas: HTMLCanvasElement,
  maxWidth: number,
): Promise<HTMLCanvasElement> => {
  if (!maxWidth || canvas.width <= maxWidth) {
    return canvas;
  }

  const scaleFactor = maxWidth / canvas.width;
  const scaledCanvas = document.createElement('canvas');
  const context = scaledCanvas.getContext('2d');

  if (!context) {
    return canvas;
  }

  scaledCanvas.width = maxWidth;
  scaledCanvas.height = canvas.height * scaleFactor;

  // Usar renderizado de alta calidad para el escalado
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  context.drawImage(
    canvas,
    0, 0, canvas.width, canvas.height,
    0, 0, scaledCanvas.width, scaledCanvas.height
  );

  return scaledCanvas;
};

/**
 * Convierte todas las páginas de un PDF a imágenes
 */
export const convertAllPdfPages = async (
  pdfFile: File,
  options: PdfConversionOptions = {}
): Promise<ConversionResult[]> => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdfDocument.numPages;

    const results: ConversionResult[] = [];

    for (let i = 1; i <= totalPages; i++) {
      const result = await convertPdfToImage(pdfFile, {
        ...options,
        pageNumber: i
      });
      results.push(result);
    }

    return results;

  } catch (error) {
    console.error('Error converting all PDF pages:', error);
    return [{
      success: false,
      error: error instanceof Error ? error.message : 'Error al convertir todas las páginas'
    }];
  }
};

/**
 * Obtiene metadatos del PDF sin convertirlo
 */
export const getPdfMetadata = async (pdfFile: File): Promise<{
  pageCount: number;
  fileName: string;
  fileSize: number;
}> => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    return {
      pageCount: pdfDocument.numPages,
      fileName: pdfFile.name,
      fileSize: pdfFile.size
    };
  } catch (error) {
    throw new Error(`No se pudieron obtener los metadatos del PDF ${error}`);
  }
};

/**
 * Utilidad para descargar la imagen convertida
 */
export const downloadImage = (
  imageData: string,
  fileName: string = 'converted-image',
  format: string = 'png'
): void => {
  const link = document.createElement('a');
  link.href = imageData;
  link.download = `${fileName}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Previsualización rápida para selección de plantillas
 */
export const createPdfThumbnail = async (
  pdfFile: File,
  maxWidth: number = 300
): Promise<string> => {
  const result = await convertPdfToImage(pdfFile, {
    scale: 0.5,
    maxWidth,
    imageQuality: 0.7
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.imageData!;
};