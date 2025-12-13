declare module 'pdfjs-dist/build/pdf.mjs' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export function getDocument(params: { data: ArrayBuffer }): {
    promise: Promise<{
      getPage(pageNumber: number): Promise<{
        getViewport(params: { scale: number }): {
          width: number;
          height: number;
        };
        render(params: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }): {
          promise: Promise<void>;
        };
      }>;
    }>;
  };
  const pdfjs: typeof import('pdfjs-dist/build/pdf.mjs');
  export default pdfjs;
}

declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export function getDocument(params: { data: ArrayBuffer }): {
    promise: Promise<{
      getPage(pageNumber: number): Promise<{
        getViewport(params: { scale: number }): {
          width: number;
          height: number;
        };
        render(params: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }): {
          promise: Promise<void>;
        };
      }>;
    }>;
  };
  const pdfjs: typeof import('pdfjs-dist/legacy/build/pdf.mjs');
  export default pdfjs;
}

