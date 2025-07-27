'use server';

/**
 * @fileOverview A Genkit flow for translating text into different languages in a batch.
 *
 * - translateText - A function that handles the translation process for a batch of strings.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  strings: z
    .record(z.string())
    .describe('A key-value object of strings to be translated.'),
  targetLanguage: z
    .string()
    .describe('The target language for translation (e.g., Hindi, Tamil, English).'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translations: z.record(z.string()).describe('A key-value object of the translated strings.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


// Define the new schema for the AI model's output
const TranslationPairSchema = z.object({
  key: z.string().describe('The original key from the input object.'),
  translatedText: z.string().describe('The translated text.'),
});

const AIOutputSchema = z.object({
    translations: z.array(TranslationPairSchema).describe("An array of translated key-value pairs.")
});


export async function translateText(
  input: TranslateTextInput
): Promise<TranslateTextOutput> {
  // Return original text if target is English to avoid unnecessary API calls
  if (input.targetLanguage.toLowerCase() === 'english') {
    return { translations: input.strings };
  }
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: z.object({
    stringsAsJson: z.string(), // Pass as a JSON string
    targetLanguage: z.string()
  })},
  output: {schema: AIOutputSchema},
  prompt: `Translate the value of each key in the following JSON object to {{targetLanguage}}.
Return an array of JSON objects, where each object has a "key" and a "translatedText" property.

Input JSON string:
{{{stringsAsJson}}}

Return ONLY the array of translated key-value pair objects, without any additional explanations or formatting.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    // Convert the input strings object to a JSON string to pass to the prompt
    const {output} = await prompt({
        stringsAsJson: JSON.stringify(input.strings, null, 2),
        targetLanguage: input.targetLanguage
    });

    if (!output) {
      return { translations: {} };
    }
    
    // Transform the array of objects back into a single key-value object
    const translationsObject = output.translations.reduce((acc, pair) => {
      acc[pair.key] = pair.translatedText;
      return acc;
    }, {} as Record<string, string>);
    
    return { translations: translationsObject };
  }
);
