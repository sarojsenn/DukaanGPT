'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting barter matches between vendors.
 *
 * It includes:
 * - `suggestBarterMatch`: An async function that takes a vendor's offer and desired item and suggests matches.
 * - `SuggestBarterMatchInput`: The input type for the `suggestBarterMatch` function.
 * - `SuggestBarterMatchOutput`: The output type for the `suggestBarterMatch` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Dummy data for available barter listings. In a real app, this would come from a database.
const DUMMY_BARTER_LISTINGS = [
  { id: 'b1', owner: 'Ramesh Kumar', offering: '50kg Extra Onions', seeking: 'Fresh Paneer or Cooking Oil', location: 'Koramangala' },
  { id: 'b2', owner: 'Sunita Devi', offering: '20kg Surplus Tomatoes', seeking: 'Packaging materials (paper bags)', location: 'Jayanagar' },
  { id: 'b3', owner: 'Anil Singh', offering: 'Unused Gas Cylinder', seeking: 'Bulk potatoes or flour', location: 'Indiranagar' },
  { id: 'b4', owner: 'Priya Foods', offering: 'Bulk Spices (Turmeric/Coriander)', seeking: 'Fresh vegetables', location: 'Dadar, Mumbai' },
  { id: 'b5', owner: 'Sharma Sweets', offering: '10kg Besan (Gram Flour)', seeking: 'Surplus milk or sugar', location: 'Chandni Chowk, Delhi' },
];


const SuggestBarterMatchInputSchema = z.object({
  vendorId: z.string().describe("The ID of the vendor requesting the match."),
  offering: z.string().describe("The item or service the vendor is offering."),
  seeking: z.string().describe("The item or service the vendor is looking for."),
});

export type SuggestBarterMatchInput = z.infer<typeof SuggestBarterMatchInputSchema>;


const BarterMatchSchema = z.object({
    owner: z.string().describe("The name of the vendor who listed the item."),
    offering: z.string().describe("The item they are offering."),
    seeking: z.string().describe("The item they are seeking."),
    location: z.string().describe("Their location."),
    compatibilityScore: z.number().describe("A score from 0-100 indicating how good the match is."),
    reasoning: z.string().describe("A brief explanation of why this is a good match.")
});

const SuggestBarterMatchOutputSchema = z.object({
  matches: z.array(BarterMatchSchema).describe("A list of potential barter matches."),
});

export type SuggestBarterMatchOutput = z.infer<typeof SuggestBarterMatchOutputSchema>;

// This tool simulates fetching barter listings from a database.
const getBarterListingsTool = ai.defineTool(
    {
        name: 'getBarterListingsTool',
        description: 'Retrieves all available barter listings from the platform.',
        inputSchema: z.void(),
        outputSchema: z.array(z.object({
            id: z.string(),
            owner: z.string(),
            offering: z.string(),
            seeking: z.string(),
            location: z.string(),
        }))
    },
    async () => DUMMY_BARTER_LISTINGS
);


export async function suggestBarterMatch(input: SuggestBarterMatchInput): Promise<SuggestBarterMatchOutput> {
  return suggestBarterMatchFlow(input);
}

const prompt = ai.definePrompt({
    name: 'suggestBarterMatchPrompt',
    input: {schema: SuggestBarterMatchInputSchema},
    output: {schema: SuggestBarterMatchOutputSchema},
    tools: [getBarterListingsTool],
    prompt: `You are an AI assistant for a community of street food vendors. Your task is to find the best barter trade opportunities.

A vendor (ID: {{{vendorId}}}) is making a new offer.
- They are offering: {{{offering}}}
- They are seeking: {{{seeking}}}

First, use the getBarterListingsTool to get all available barter listings. Do not include the vendor's own listing in the potential matches.

Then, analyze the listings and find the best potential matches for the vendor. For each potential match, you MUST provide:
1.  **compatibilityScore**: A numerical score from 0 to 100 on how good the match is. A direct match (A has what B wants, B has what A wants) should be 90+. An indirect or partial match should be lower.
2.  **reasoning**: A short, clear explanation for the match.

Return a list of the top 3-5 most promising matches.
`,
});

const suggestBarterMatchFlow = ai.defineFlow(
  {
    name: 'suggestBarterMatchFlow',
    inputSchema: SuggestBarterMatchInputSchema,
    outputSchema: SuggestBarterMatchOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    
    if (!output) {
        throw new Error("AI was unable to determine any barter matches.");
    }
    
    return output;
  }
);
