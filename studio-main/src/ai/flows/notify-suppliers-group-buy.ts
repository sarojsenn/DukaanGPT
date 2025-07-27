
'use server';

/**
 * @fileOverview A flow for notifying suppliers about a new group buy opportunity.
 *
 * - notifySuppliersOfGroupBuy - A function that handles the supplier notification process.
 * - NotifySuppliersOfGroupBuyInput - The input type for the function.
 * - NotifySuppliersOfGroupBuyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {findSuppliers} from '@/services/supplier-service';

const NotifySuppliersOfGroupBuyInputSchema = z.object({
  productName: z.string().describe('The product for the group buy.'),
  targetQuantity: z.number().describe('The target quantity in kg.'),
  pricePerUnit: z.number().describe('The price per kg offered.'),
  vendorLocation: z.string().describe('The location of the vendors organizing the group buy.'),
});
export type NotifySuppliersOfGroupBuyInput = z.infer<typeof NotifySuppliersOfGroupBuyInputSchema>;

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

const NotifySuppliersOfGroupBuyOutputSchema = z.object({
  notifiedSuppliers: z.array(z.object({
    name: z.string(),
    location: z.string(),
  })).describe('A list of suppliers who would be notified.'),
  summary: z.string().describe('A summary of the notification action.'),
});
export type NotifySuppliersOfGroupBuyOutput = z.infer<typeof NotifySuppliersOfGroupBuyOutputSchema>;

export async function notifySuppliersOfGroupBuy(input: NotifySuppliersOfGroupBuyInput): Promise<NotifySuppliersOfGroupBuyOutput> {
  return notifySuppliersOfGroupBuyFlow(input);
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
  name: 'notifySuppliersOfGroupBuyPrompt',
  input: {schema: NotifySuppliersOfGroupBuyInputSchema},
  output: {schema: NotifySuppliersOfGroupBuyOutputSchema},
  tools: [findSuppliersTool],
  prompt: `You are an AI assistant helping street food vendors organize group buys.

A new group buy has been created with the following details:
- Product: {{productName}}
- Target Quantity: {{targetQuantity}} kg
- Offered Price: Rs {{pricePerUnit}}/kg
- Vendor Location: {{vendorLocation}}

Please perform the following steps:
1. Use the findSuppliersTool to get a list of all available suppliers for the requested product.
2. From that list, identify the suppliers who are located near the vendor's location.
3. Prepare a list of these nearby suppliers who should be notified.
4. Generate a concise summary confirming that these suppliers have been identified for notification. For example: "Identified 3 potential suppliers in and around [Vendor Location] for this group buy."
`,
});

const notifySuppliersOfGroupBuyFlow = ai.defineFlow(
  {
    name: 'notifySuppliersOfGroupBuyFlow',
    inputSchema: NotifySuppliersOfGroupBuyInputSchema,
    outputSchema: NotifySuppliersOfGroupBuyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Unable to get a response from the AI model.");
    }
    return output;
  }
);
