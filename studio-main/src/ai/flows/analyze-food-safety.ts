
'use server';
/**
 * @fileOverview A Genkit flow for analyzing food safety from an image.
 *
 * - analyzeFoodSafety - A function that handles the food safety analysis.
 * - AnalyzeFoodSafetyInput - The input type for the analyzeFoodSafety function.
 * - AnalyzeFoodSafetyOutput - The output type for the analyzeFoodSafety function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFoodSafetyInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of food ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFoodSafetyInput = z.infer<typeof AnalyzeFoodSafetyInputSchema>;

const AnalyzeFoodSafetyOutputSchema = z.object({
    spoilage: z.object({
        detected: z.boolean().describe("Whether signs of spoilage were detected."),
        assessment: z.string().describe("A brief assessment of the food's freshness and any signs of spoilage (e.g., 'No spoilage detected', 'Minor bruising on some items', 'Visible mold growth').")
    }),
    quantity: z.object({
        estimation: z.string().describe("A rough estimation of the quantity of the main food item (e.g., 'Approximately 5kg of potatoes', 'A small batch of chillies').")
    }),
    hygiene: z.object({
        score: z.number().min(0).max(100).describe("A score from 0 to 100 representing the overall hygiene level of the food and its preparation area."),
        assessment: z.string().describe("A brief explanation for the hygiene score, noting positive or negative factors (e.g., 'Clean surfaces', 'Food is on a dirty cloth').")
    })
});
export type AnalyzeFoodSafetyOutput = z.infer<typeof AnalyzeFoodSafetyOutputSchema>;

export async function analyzeFoodSafety(input: AnalyzeFoodSafetyInput): Promise<AnalyzeFoodSafetyOutput> {
  return analyzeFoodSafetyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodSafetyPrompt',
  input: {schema: AnalyzeFoodSafetyInputSchema},
  output: {schema: AnalyzeFoodSafetyOutputSchema},
  prompt: `You are an expert AI food safety inspector for street food vendors in India.

Analyze the provided image of food ingredients and provide a detailed assessment.

Photo: {{media url=photoDataUri}}

1.  **Spoilage Check:** Carefully examine the food for any signs of spoilage, such as mold, discoloration, wilting, or unusual textures. Set 'detected' to true if any signs are found. Provide a clear, concise assessment.
2.  **Quantity Estimation:** Give a rough, visual estimate of the quantity of the main ingredient shown. Use common Indian units like kg where appropriate.
3.  **Hygiene Score:** Rate the overall hygiene of the scene on a scale of 0 to 100. Consider the cleanliness of the food itself, the container it's in, and the surrounding surfaces. Provide a justification for your score.

Your analysis should be practical and helpful for a street food vendor.
`,
});

const analyzeFoodSafetyFlow = ai.defineFlow(
  {
    name: 'analyzeFoodSafetyFlow',
    inputSchema: AnalyzeFoodSafetyInputSchema,
    outputSchema: AnalyzeFoodSafetyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Unable to get a response from the AI model.");
    }
    return output;
  }
);
