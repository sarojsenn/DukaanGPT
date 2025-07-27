'use server';

/**
 * @fileOverview A flow for suggesting suppliers to vendors based on proximity, ratings, and inventory levels.
 *
 * - smartSupplierMatching - A function that handles the supplier matching process.
 * - SmartSupplierMatchingInput - The input type for the smartSupplierMatching function.
 * - SmartSupplierMatchingOutput - The return type for the smartSupplierMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {findSuppliers} from '@/services/supplier-service';

const SmartSupplierMatchingInputSchema = z.object({
  vendorLocation: z
    .string()
    .describe('The current location of the vendor (e.g., address or coordinates).'),
  rawMaterial: z.string().describe('The raw material the vendor needs (e.g., tomatoes, flour).'),
  quantity: z.number().describe('The quantity of the raw material needed (e.g., 10 kg, 5 liters).'),
  language: z.string().describe('The preferred language of the vendor (e.g., Hindi, Tamil).'),
});
export type SmartSupplierMatchingInput = z.infer<typeof SmartSupplierMatchingInputSchema>;

const SupplierSchema = z.object({
  supplierName: z.string().describe('The name of the supplier.'),
  contactNumber: z.string().describe('The contact number of the supplier.'),
  inventory: z
    .array(z.object({itemName: z.string(), price: z.number(), quantity: z.number()}))
    .describe('The current inventory of the supplier.'),
  rating: z.number().describe('The average rating of the supplier (e.g., 4.5 out of 5).'),
  location: z.string().describe('The location of the supplier (e.g., address or coordinates).'),
  languageSupport: z.array(z.string()).describe('The list of languages that the supplier supports'),
  trustScore: z.number().describe('Trust score of the supplier'),
  deliveryOptions: z.string().describe('Delivery options, e.g., delivery, pick-up.'),
});

const SmartSupplierMatchingOutputSchema = z.object({
  suppliers: z.array(SupplierSchema).describe('A list of suppliers that match the vendor request.'),
  summary: z.string().describe('A summary of the supplier matching results, written in the requested language.'),
});
export type SmartSupplierMatchingOutput = z.infer<typeof SmartSupplierMatchingOutputSchema>;

export async function smartSupplierMatching(input: SmartSupplierMatchingInput): Promise<SmartSupplierMatchingOutput> {
  return smartSupplierMatchingFlow(input);
}

const findSuppliersTool = ai.defineTool(
  {
    name: 'findSuppliersTool',
    description: 'Finds suppliers based on the raw material they provide.',
    inputSchema: z.object({
      rawMaterial: z.string().describe('The raw material to search for.'),
    }),
    outputSchema: z.array(SupplierSchema),
  },
  async (input) => findSuppliers(input.rawMaterial)
);

const prompt = ai.definePrompt({
  name: 'smartSupplierMatchingPrompt',
  input: {schema: SmartSupplierMatchingInputSchema},
  output: {schema: SmartSupplierMatchingOutputSchema},
  tools: [findSuppliersTool],
  prompt: `You are an AI assistant helping street food vendors find the best raw material suppliers.

Your goal is to provide the most relevant suppliers based on the vendor's specific request.

Here is the vendor's request:
- Location: {{vendorLocation}}
- Raw Material: {{rawMaterial}}
- Quantity Needed: {{quantity}}
- Preferred Language for Summary: {{language}}

Please perform the following steps:
1. Use the findSuppliersTool to get a list of all available suppliers for the requested raw material.
2. From that list, filter and rank the suppliers based on the vendor's location, the quantity they need, and supplier ratings. Prioritize suppliers that are closest, have high ratings, and sufficient inventory.
3. Return a final list of the top recommended suppliers.
4. Provide a concise summary of why these suppliers were chosen. THIS SUMMARY MUST BE IN {{language}}.
`,
});

const smartSupplierMatchingFlow = ai.defineFlow(
  {
    name: 'smartSupplierMatchingFlow',
    inputSchema: SmartSupplierMatchingInputSchema,
    outputSchema: SmartSupplierMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Unable to get a response from the AI model.");
    }
    return output;
  }
);
