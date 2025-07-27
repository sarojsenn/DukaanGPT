
'use server';
/**
 * @fileOverview A Genkit flow for a chatbot that provides step-by-step recipes.
 *
 * - recipeChat - A function that handles the chat interaction.
 * - RecipeChatInput - The input type for the recipeChat function.
 * - RecipeChatOutput - The return type for the recipeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
});
export type RecipeChatInput = z.infer<typeof RecipeChatInputSchema>;

const RecipeChatOutputSchema = z.object({
  reply: z.string().describe('The chatbot\'s response.'),
});
export type RecipeChatOutput = z.infer<typeof RecipeChatOutputSchema>;

export async function recipeChat(input: RecipeChatInput): Promise<RecipeChatOutput> {
  return recipeChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeChatPrompt',
  input: {schema: RecipeChatInputSchema},
  output: {schema: RecipeChatOutputSchema},
  prompt: `You are an expert culinary AI assistant named DukaanGPT, specializing in Indian street food. Your primary goal is to help street food vendors by providing clear, concise, and easy-to-follow recipes.

When a user asks for a recipe, you MUST provide a step-by-step guide. The format should be:
1.  **Ingredients:** A list of all necessary ingredients with their quantities (e.g., "250g Paneer," "2 medium onions, finely chopped").
2.  **Instructions:** A numbered list of clear, step-by-step instructions for preparing the dish.

If the user asks a question that is not about a recipe, have a friendly conversation and gently guide them back to food, recipes, or business tips for vendors.

User's message: {{{message}}}
`,
});

const recipeChatFlow = ai.defineFlow(
  {
    name: 'recipeChatFlow',
    inputSchema: RecipeChatInputSchema,
    outputSchema: RecipeChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Unable to get a response from the AI model.");
    }
    return output;
  }
);
