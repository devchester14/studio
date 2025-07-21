'use server';
/**
 * @fileOverview An AI-powered semantic search agent for finding content.
 *
 * - semanticSearch - A function that handles the semantic search process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  SemanticSearchInputSchema,
  type SemanticSearchInput,
  SemanticSearchOutputSchema,
  type SemanticSearchOutput,
} from '@/types/ai';

export async function semanticSearch(
  input: SemanticSearchInput
): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticSearchPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  prompt: `You are a movie and TV show search engine. A user will provide a query, and you must find relevant content.
  The user's query may be a direct title, a description of the plot, actors, or a general theme.
  Interpret the query and return a list of matching content. For each result, provide all the fields in the output schema.
  For the 'id' field, generate a unique string.
  For 'imageUrl', use a placeholder from https://placehold.co/600x400.png.
  For 'aiHint', provide a short, two-word hint for image generation related to the movie title.
  
  If the query is "movie with magic wands", you might return "Harry Potter and the Sorcerer's Stone".
  If the query is "Tom Cruise action movie", you might return "Top Gun: Maverick" or "Mission: Impossible".

  User Query: {{{query}}}
  
  Return up to 4 results.
  `,
});

const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || [];
  }
);
