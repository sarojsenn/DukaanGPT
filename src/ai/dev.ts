
import { config } from 'dotenv';
config();

import '@/ai/flows/smart-supplier-matching.ts';
import '@/ai/flows/process-voice-order.ts';
import '@/ai/flows/broadcast-surplus-alert.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/get-market-price.ts';
import '@/ai/flows/suggest-barter-match.ts';
import '@/ai/flows/generate-learning-video.ts';
import '@/ai/flows/analyze-food-safety.ts';
import '@/ai/flows/recipe-chat.ts';
import '@/ai/flows/calculate-recipe-cost.ts';
import '@/ai/flows/notify-suppliers-group-buy.ts';
import '@/ai/flows/generate-feature-image.ts';

