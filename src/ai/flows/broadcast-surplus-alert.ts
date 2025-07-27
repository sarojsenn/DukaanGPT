
'use server';

/**
 * @fileOverview This file defines a Genkit flow for broadcasting surplus produce alerts to vendors.
 *
 * It includes:
 * - `broadcastSurplusAlert`: An async function that takes surplus details and formats a message for broadcast.
 * - `BroadcastSurplusAlertInput`: The input type for the `broadcastSurplusAlert` function.
 * - `BroadcastSurplusAlertOutput`: The output type for the `broadcastSurplusAlert` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BroadcastSurplusAlertInputSchema = z.object({
  produceName: z.string().describe("The name of the surplus produce."),
  quantity: z.number().describe("The available quantity in kg."),
  price: z.number().describe("The price per kg in local currency."),
  location: z.string().describe("The pickup location for the produce."),
  contact: z.string().describe("The contact number of the supplier."),
  notes: z.string().optional().describe("Any additional notes about the produce."),
});

export type BroadcastSurplusAlertInput = z.infer<typeof BroadcastSurplusAlertInputSchema>;

const BroadcastSurplusAlertOutputSchema = z.object({
  success: z.boolean().describe("Whether the broadcast was successfully initiated."),
  message: z.string().describe("The formatted message that would be sent to vendors."),
});

export type BroadcastSurplusAlertOutput = z.infer<typeof BroadcastSurplusAlertOutputSchema>;

export async function broadcastSurplusAlert(input: BroadcastSurplusAlertInput): Promise<BroadcastSurplusAlertOutput> {
  return broadcastSurplusAlertFlow(input);
}

const broadcastSurplusAlertFlow = ai.defineFlow(
  {
    name: 'broadcastSurplusAlertFlow',
    inputSchema: BroadcastSurplusAlertInputSchema,
    outputSchema: BroadcastSurplusAlertOutputSchema,
  },
  async (input) => {

    const message = `Surplus Produce Alert!
Produce: ${input.produceName}
Quantity: ${input.quantity} kg
Price: Rs ${input.price}/kg
Location: ${input.location}
${input.notes ? `Notes: ${input.notes}\n` : ''}
Contact: ${input.contact}
-DukaanGPT`;

    // The alert is now just posted to the community feed from the frontend.
    // This flow now just confirms the data is valid and formats the message.
    return {
      success: true,
      message: message,
    };
  }
);
