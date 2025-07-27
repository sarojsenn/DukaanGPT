
'use server';
/**
 * @fileOverview A Genkit flow for calculating the cost of a recipe using AI.
 *
 * - calculateRecipeCost - A function that handles the recipe cost calculation.
 * - CalculateRecipeCostInput - The input type for the calculateRecipeCost function.
 * - CalculateRecipeCostOutput - The return type for the calculateRecipeCost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateRecipeCostInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to calculate the cost for.'),
});
export type CalculateRecipeCostInput = z.infer<typeof CalculateRecipeCostInputSchema>;

const IngredientCostSchema = z.object({
    name: z.string().describe("The name of the ingredient."),
    quantityInGrams: z.number().describe("The estimated quantity of the ingredient in grams for a standard batch."),
    pricePerKg: z.number().describe("The estimated current market price for the ingredient in Rs per kg."),
    cost: z.number().describe("The calculated cost for this ingredient in the recipe.")
});

const CalculateRecipeCostOutputSchema = z.object({
  ingredients: z.array(IngredientCostSchema).describe("A list of ingredients with their estimated quantities and costs."),
  totalCost: z.number().describe("The total estimated cost of the recipe."),
  reasoning: z.string().describe("A brief explanation of the batch size and assumptions made."),
});
export type CalculateRecipeCostOutput = z.infer<typeof CalculateRecipeCostOutputSchema>;


export async function calculateRecipeCost(input: CalculateRecipeCostInput): Promise<CalculateRecipeCostOutput> {
  return calculateRecipeCostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateRecipeCostPrompt',
  input: {schema: CalculateRecipeCostInputSchema},
  output: {schema: CalculateRecipeCostOutputSchema},
  prompt: `You are an expert AI culinary cost analyst for Indian street food vendors.
Your task is to calculate the cost of a given recipe.

Recipe: {{{recipeName}}}

1.  **Deconstruct the Recipe:** Break down the recipe into its core ingredients.
2.  **Estimate Quantities:** For a standard, small-scale vendor batch (e.g., serving 4-6 people), estimate the quantity of each ingredient in grams.
3.  **Estimate Prices:** Use your knowledge of the current Indian market to estimate a realistic price in Rs per kg for each ingredient. For example, tomatoes might be Rs 30/kg, onions Rs 25/kg, paneer Rs 350/kg, etc.
4.  **Calculate Costs:** For each ingredient, calculate its cost based on the estimated quantity and price. The formula is: (quantityInGrams / 1000) * pricePerKg.
5.  **Calculate Total Cost:** Sum up the costs of all ingredients to get the total recipe cost.
6.  **Provide Reasoning:** Briefly explain the assumptions you made, especially the batch size you based the quantities on.

Return the final breakdown in the structured output format.
`,
});

const calculateRecipeCostFlow = ai.defineFlow(
  {
    name: 'calculateRecipeCostFlow',
    inputSchema: CalculateRecipeCostInputSchema,
    outputSchema: CalculateRecipeCostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Unable to get a response from the AI model.");
    }
    return output;
  }
);

