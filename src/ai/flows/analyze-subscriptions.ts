'use server';
/**
 * @fileOverview An AI flow for analyzing user viewing habits and providing subscription advice.
 *
 * - analyzeSubscriptions - A function that provides cost-saving advice based on liked content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SubscriptionAnalysisInputSchema = z.object({
  platformCounts: z.string().describe('A JSON string representing the count of liked movies per platform. e.g.,"Netflix": 10, "Hulu": 2, "Amazon Prime": 1'),
});
export type SubscriptionAnalysisInput = z.infer<typeof SubscriptionAnalysisInputSchema>;


const SubscriptionAnalysisOutputSchema = z.object({
    insight: z.string().describe('A short, actionable insight for the user about their subscriptions.'),
    primaryPlatform: z.string().describe('The platform the user uses most.'),
    suggestion: z.string().describe('A specific suggestion, e.g., which subscription to pause.'),
});
export type SubscriptionAnalysisOutput = z.infer<typeof SubscriptionAnalysisOutputSchema>;


export async function analyzeSubscriptions(
  input: SubscriptionAnalysisInput
): Promise<SubscriptionAnalysisOutput> {
  return subscriptionAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'subscriptionAnalysisPrompt',
  input: {schema: SubscriptionAnalysisInputSchema},
  output: {schema: SubscriptionAnalysisOutputSchema},
  prompt: `You are a helpful assistant for a TV streaming app. Your goal is to help users save money by analyzing their viewing habits.

**IMPORTANT: You must not generate any adult or sexual content in your insight or suggestion.**

You will be given a JSON object showing how many movies a user has "liked" on various streaming platforms.

User's Liked Content Distribution:
{{{platformCounts}}}

Based on this data, provide a concise and helpful insight. 
- Identify the platform with the most liked content as their "primaryPlatform".
- Provide a clear "insight" summarizing the finding.
- Offer a "suggestion" on how they could save money, for example, by pausing a subscription they use less frequently. If all platforms are used equally or only one platform is used, you can suggest they have a good balance.

Example:
Input: '{"Netflix": 12, "Hulu": 2, "Amazon Prime": 1}'
Output:
{
  "insight": "You seem to get the most value from your Netflix subscription.",
  "primaryPlatform": "Netflix",
  "suggestion": "You could consider pausing your Hulu and Amazon Prime subscriptions to save money this month."
}

Example 2:
Input: '{"HBO Max": 5}'
Output:
{
    "insight": "You're making great use of your HBO Max subscription!",
    "primaryPlatform": "HBO Max",
    "suggestion": "Your viewing is nicely consolidated on one platform. No changes needed!"
}

Now, analyze the user's data.`,
});

const subscriptionAnalysisFlow = ai.defineFlow(
  {
    name: 'subscriptionAnalysisFlow',
    inputSchema: SubscriptionAnalysisInputSchema,
    outputSchema: SubscriptionAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
