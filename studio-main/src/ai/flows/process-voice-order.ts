// src/ai/flows/process-voice-order.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for processing voice orders placed by vendors via WhatsApp.
 *
 * It includes:
 * - `processVoiceOrder`: An async function that takes voice input and translates it into a structured order.
 * - `ProcessVoiceOrderInput`: The input type for the `processVoiceOrder` function, including voice data and language.
 * - `ProcessVoiceOrderOutput`: The output type for the `processVoiceOrder` function, representing the structured order.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessVoiceOrderInputSchema = z.object({
  voiceDataUri: z
    .string()
    .describe(
      'The voice order from the vendor, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  language: z.string().describe('The language of the voice order (e.g., Hindi, Tamil, Marathi).'),
});

export type ProcessVoiceOrderInput = z.infer<typeof ProcessVoiceOrderInputSchema>;

const ProcessVoiceOrderOutputSchema = z.object({
  structuredOrder: z.string().describe('The structured order derived from the voice input.'),
});

export type ProcessVoiceOrderOutput = z.infer<typeof ProcessVoiceOrderOutputSchema>;

export async function processVoiceOrder(input: ProcessVoiceOrderInput): Promise<ProcessVoiceOrderOutput> {
  return processVoiceOrderFlow(input);
}

const processVoiceOrderPrompt = ai.definePrompt({
  name: 'processVoiceOrderPrompt',
  input: {schema: ProcessVoiceOrderInputSchema},
  output: {schema: ProcessVoiceOrderOutputSchema},
  prompt: `You are an AI assistant designed to process voice orders from vendors for raw materials.

  The vendor will provide a voice recording in their local language ({{{language}}}).

  Your task is to transcribe the voice recording and translate it into a structured order.

  The structured order should clearly specify the items requested, the desired quantity for each item, and any other relevant details.

  Voice Data: {{media url=voiceDataUri}}

  Output the structured order in a human-readable format.
`,
});

const processVoiceOrderFlow = ai.defineFlow(
  {
    name: 'processVoiceOrderFlow',
    inputSchema: ProcessVoiceOrderInputSchema,
    outputSchema: ProcessVoiceOrderOutputSchema,
  },
  async input => {
    const {output} = await processVoiceOrderPrompt(input);
    return output!;
  }
);

