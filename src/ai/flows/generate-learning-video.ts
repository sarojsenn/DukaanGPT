
'use server';

/**
 * @fileOverview A Genkit flow for generating short learning videos using AI.
 *
 * - generateLearningVideo - A function that handles the video generation process.
 * - GenerateLearningVideoInput - The input type for the generateLearningVideo function.
 * - GenerateLearningVideoOutput - The output type for the generateLearningVideo function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import type {MediaPart} from 'genkit';

const GenerateLearningVideoInputSchema = z.object({
  topic: z.string().describe('The topic for the learning video.'),
});
export type GenerateLearningVideoInput = z.infer<typeof GenerateLearningVideoInputSchema>;

const GenerateLearningVideoOutputSchema = z.object({
  videoUrl: z
    .string()
    .optional() // Make videoUrl optional
    .describe(
      "The generated video as a data URI. Expected format: 'data:video/mp4;base64,<encoded_data>'."
    ),
  error: z
    .string()
    .optional() // Add an optional error field
    .describe('An error message if video generation failed.'),
});

export type GenerateLearningVideoOutput = z.infer<typeof GenerateLearningVideoOutputSchema>;


export async function generateLearningVideo(
  input: GenerateLearningVideoInput
): Promise<GenerateLearningVideoOutput> {
  return generateLearningVideoFlow(input);
}

// Helper function to fetch the video from the temporary URL and convert it to a Base64 data URI.
async function videoToDataURI(video: MediaPart): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  if (!video.media?.url) {
    throw new Error('Video URL is missing');
  }

  // Add the API key to the download URL as required by the Gemini API.
  const videoUrlWithKey = `${video.media.url}&key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(videoUrlWithKey);

  if (!response.ok || !response.body) {
    throw new Error(
      `Failed to download video: ${response.status} ${response.statusText}`
    );
  }

  const videoBuffer = await response.arrayBuffer();
  const base64Video = Buffer.from(videoBuffer).toString('base64');
  const contentType = video.media.contentType || 'video/mp4';

  return `data:${contentType};base64,${base64Video}`;
}

const generateLearningVideoFlow = ai.defineFlow(
  {
    name: 'generateLearningVideoFlow',
    inputSchema: GenerateLearningVideoInputSchema,
    outputSchema: GenerateLearningVideoOutputSchema,
  },
  async ({topic}) => {
    try {
        let {operation} = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: `Create an engaging, 5-second educational video for an Indian street food vendor about "${topic}". Use simple, clear visuals, bright colors, and an optimistic tone. Show elements related to Indian street food, markets, and financial growth. The video should be visually appealing and easy to understand.`,
        config: {
            durationSeconds: 5,
            aspectRatio: '16:9',
        },
        });

        if (!operation) {
        throw new Error('Expected the model to return an operation');
        }

        // Poll the operation status until it's complete. This can take some time.
        while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again.
        operation = await ai.checkOperation(operation);
        }

        if (operation.error) {
        console.error('Video generation failed:', operation.error);
        throw new Error(`Failed to generate video: ${operation.error.message}`);
        }

        const video = operation.output?.message?.content.find(p => !!p.media);
        if (!video) {
        throw new Error('Failed to find the generated video in the operation result');
        }

        // Convert the video to a data URI to send to the client.
        const videoDataUri = await videoToDataURI(video);

        return {
          videoUrl: videoDataUri,
        };
    } catch (e: any) {
        if (e.message && e.message.includes('FAILED_PRECONDITION')) {
             // Instead of throwing, return an object with the error message
             return { error: "Video generation requires a Google Cloud Platform project with billing enabled. Please enable billing in your account settings to use this feature." };
        }
        // For other errors, still return the error message
        return { error: e.message || 'An unknown error occurred during video generation.'};
    }
  }
);
