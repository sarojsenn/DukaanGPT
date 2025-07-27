'use server';

/**
 * @fileOverview This file defines a Genkit flow for fetching a simulated market price for a given item.
 *
 * It includes:
 * - `getMarketPrice`: An async function that takes an item name and returns a suggested market price.
 * - `GetMarketPriceInput`: The input type for the `getMarketPrice` function.
 * - `GetMarketPriceOutput`: The output type for the `getMarketPrice` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMarketPriceInputSchema = z.object({
  itemName: z.string().describe("The name of the grocery item."),
});

export type GetMarketPriceInput = z.infer<typeof GetMarketPriceInputSchema>;

const GetMarketPriceOutputSchema = z.object({
  price: z.number().describe("The suggested current market price per kg for the item."),
});

export type GetMarketPriceOutput = z.infer<typeof GetMarketPriceOutputSchema>;

export async function getMarketPrice(input: GetMarketPriceInput): Promise<GetMarketPriceOutput> {
  return getMarketPriceFlow(input);
}

const getMarketPricePrompt = ai.definePrompt({
    name: 'getMarketPricePrompt',
    input: {schema: GetMarketPriceInputSchema},
    output: {schema: GetMarketPriceOutputSchema},
    prompt: `You are a market price oracle for Indian grocery items.
    
    Given the item name: {{{itemName}}}, provide a realistic, current market price for it in Indian Rupees (INR) per kg.
    
    Consider common market fluctuations but provide a single, reasonable number. For example, for "Tomatoes", a good price might be 35. For "Onions", it could be 28. For "Paneer", it might be 350.
    
    Return ONLY the structured output with the price.
`,
});


const getMarketPriceFlow = ai.defineFlow(
  {
    name: 'getMarketPriceFlow',
    inputSchema: GetMarketPriceInputSchema,
    outputSchema: GetMarketPriceOutputSchema,
  },
  async (input) => {
    // In a real-world scenario, you might have a database or an external API for prices.
    // Here, we use an AI prompt to simulate a "smart" price lookup.
    
    const {output} = await getMarketPricePrompt(input);
    
    if (!output) {
        throw new Error("AI was unable to determine a market price.");
    }
    
    // Return the price directly from the AI model without modification.
    return { price: parseFloat(output.price.toFixed(2)) };
  }
);
