import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-content-details.ts';
import '@/ai/flows/generate-personalized-recommendations.ts';
import '@/ai/flows/agent.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/find-content-availability.ts';
import '@/ai/flows/analyze-subscriptions.ts';
