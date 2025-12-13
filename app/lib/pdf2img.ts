export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    try {
        // Import pdfjs-dist - for v5, use the correct import path
        let lib: any;
        try {
            // Try the standard build path first
            const module = await import("pdfjs-dist/build/pdf.mjs");
            lib = module.default || module;
        } catch (e1) {
            try {
                // Fallback: try importing from the package root
                const module = await import("pdfjs-dist");
                lib = module.default || module;
            } catch (e2) {
                // Last resort: try legacy path
                const module = await import("pdfjs-dist/legacy/build/pdf.mjs");
                lib = module.default || module;
            }
        }
        
        // Set the worker source - use worker from the package itself to ensure version match
        if (lib && lib.GlobalWorkerOptions) {
            try {
                // Use Vite's ?url import to get the worker file URL from node_modules
                // This ensures the worker version matches the package version
                const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
                const workerUrl = workerModule.default || workerModule;
                lib.GlobalWorkerOptions.workerSrc = workerUrl;
            } catch (workerError) {
                // Fallback: use jsDelivr CDN which has better support for npm packages
                const pdfjsVersion = "5.4.449";
                lib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
                console.warn('Using CDN worker fallback:', workerError);
            }
        }
        
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    } catch (err) {
        isLoading = false;
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("PDF.js loading error:", errorMessage, err);
        throw new Error(`Failed to load PDF.js: ${errorMessage}`);
    }
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        await page.render({ canvasContext: context!, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        // Create a File from the blob with the same name as the pdf
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            ); // Set quality to maximum (1.0)
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}