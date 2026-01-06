
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Transforms an image using Gemini model with specified prompt.
 */
export const transformImage = async (
  file: File,
  prompt: string,
  model: string = 'gemini-2.5-flash-image',
  retryCount = 0
): Promise<string> => {
  // Always use a new instance with direct process.env.API_KEY access
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type || 'image/png'
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    let resultBase64 = '';
    const candidate = response.candidates?.[0];
    
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          resultBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!resultBase64) {
      throw new Error("No image data returned from model.");
    }

    return `data:image/png;base64,${resultBase64}`;
  } catch (err: any) {
    if (retryCount < 3 && (err.status >= 500 || err.status === 429)) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return transformImage(file, prompt, model, retryCount + 1);
    }
    throw err;
  }
};

/**
 * Performs a high-quality local resize using the browser's Canvas API.
 * This is faster and more precise for specific resolution requirements.
 */
export const resizeImageLocally = async (file: File, targetWidth: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const targetHeight = targetWidth * aspectRatio;
      
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      
      // Use high quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error("Failed to load image for resizing"));
    img.src = URL.createObjectURL(file);
  });
};
