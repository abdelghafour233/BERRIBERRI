import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Transforms an image based on a text prompt using Gemini 2.5 Flash Image model.
 * @param base64Image The base64 encoded string of the source image (including data:image/... prefix)
 * @param prompt The text description of the transformation
 * @returns Promise resolving to the base64 string of the generated image
 */
export const generateTransformedImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // Extract actual base64 data if the prefix exists (e.g., data:image/jpeg;base64,...)
    const base64Data = base64Image.split(',')[1] || base64Image;
    // Basic mime type detection (defaulting to image/jpeg if not found)
    const mimeTypeMatch = base64Image.match(/^data:(image\/[a-z]+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
        ],
      },
      // Config for image generation if supported by the model in this context
      // Note: gemini-2.5-flash-image generally follows the prompt for transformation.
    });

    // Parse response to find the image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('لم يتم استلام أي استجابة من النموذج.');
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
       throw new Error('الاستجابة فارغة.');
    }

    // Look for inlineData in the response parts
    let generatedImageBase64 = '';
    
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        // Construct full data URL
        // The SDK usually returns raw base64. We assume PNG or JPEG.
        // Often Gemini returns image/png for generated images.
        return `data:image/png;base64,${generatedImageBase64}`;
      }
    }

    // If no image found, maybe there is text explaining why (e.g. safety refusal)
    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
        throw new Error(`فشل التحويل: ${textPart.text}`);
    }

    throw new Error('لم يتم العثور على صورة في استجابة النموذج.');

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Improve error message for user
    if (error.message?.includes('403') || error.message?.includes('API key')) {
      throw new Error('خطأ في مفتاح API. يرجى التحقق من الصلاحيات.');
    }
    if (error.message?.includes('SAFETY')) {
      throw new Error('تم حظر الطلب بسبب إعدادات الأمان. حاول تغيير الوصف أو الصورة.');
    }
    throw error;
  }
};