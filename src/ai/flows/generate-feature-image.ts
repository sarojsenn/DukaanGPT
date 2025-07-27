
'use server';
/**
 * @fileOverview A Genkit flow for generating feature images using AI.
 *
 * - generateFeatureImage - A function that handles the image generation.
 * - GenerateFeatureImageInput - The input type for the generateFeatureImage function.
 * - GenerateFeatureImageOutput - The output type for the generateFeatureImage function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateFeatureImageInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the image to be generated.'),
});
export type GenerateFeatureImageInput = z.infer<typeof GenerateFeatureImageInputSchema>;

const GenerateFeatureImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateFeatureImageOutput = z.infer<typeof GenerateFeatureImageOutputSchema>;

export async function generateFeatureImage(
  input: GenerateFeatureImageInput
): Promise<GenerateFeatureImageOutput> {
  return generateFeatureImageFlow(input);
}

const generateFeatureImageFlow = ai.defineFlow(
  {
    name: 'generateFeatureImageFlow',
    inputSchema: GenerateFeatureImageInputSchema,
    outputSchema: GenerateFeatureImageOutputSchema,
  },
  async ({prompt}) => {
    const fullPrompt = `${prompt}. Indian street food theme, vibrant, clean, optimistic, photorealistic.`

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
      prompt: fullPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a valid URL.');
    }
    
    return {
      imageUrl: media.url,
    };
  }
);
