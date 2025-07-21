// src/ai/flows/generate-personalized-recommendations.ts
'use server';
/**
 * @fileOverview AI-powered content recommendation flow.
 *
 * - generatePersonalizedRecommendations - A function that generates personalized content recommendations based on user preferences and viewing history.
 * - PersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userPreferences: z.string().describe('The user\u0027s content preferences, genres, and favorite actors.'),
  viewingHistory: z.string().describe('The user\u0027s viewing history, including titles, platforms, and ratings.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const RecommendationSchema = z.object({
  title: z.string().describe('The title of the recommended content.'),
  platform: z.string().describe('The platform where the content is hosted (e.g., Netflix, Amazon Prime, Hulu).'),
  availability: z.string().describe('How the content can be accessed (e.g., rental, purchase, subscription).'),
  reason: z.string().describe('Why this content is recommended for the user.'),
});

const PersonalizedRecommendationsOutputSchema = z.array(RecommendationSchema).describe('An array of personalized content recommendations.');
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function generatePersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return generatePersonalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized content recommendations based on user preferences and viewing history.

  User Preferences: {{{userPreferences}}}
  Viewing History: {{{viewingHistory}}}

  Consider content hosted on various platforms (e.g., Netflix, Amazon Prime, Hulu) and provide transparent availability information (rental, purchase, subscription).

  Return an array of recommendations with the following information for each:
  - title: The title of the recommended content.
  - platform: The platform where the content is hosted.
  - availability: How the content can be accessed.
  - reason: Why this content is recommended for the user.
  Follow the schema EXACTLY.

  Ensure recommendations align with the user's taste, even if hosted externally, and prioritize recommendations that match viewing history.
`,
});

const generatePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
