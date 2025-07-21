'use server';
/**
 * @fileOverview An AI-powered semantic search agent for finding content.
 *
 * - semanticSearch - A function that handles the semantic-search process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  SemanticSearchInputSchema,
  type SemanticSearchInput,
  SemanticSearchOutputSchema,
  type SemanticSearchOutput,
} from '@/types/ai';

const searchWebTool = ai.defineTool(
  {
    name: 'searchWeb',
    description: 'Search the web for information about movies and TV shows.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.string().describe('A JSON string of search results.'),
  },
  async input => {
    console.log(`[Web Search] Searching for: ${input.query}`);
    // In a real application, you would call a search API (e.g., Google Search API) here.
    // For this example, we'll return a simulated result.
    const fakeApiResults = [
      {
        title: 'The Matrix',
        platform: 'HBO Max',
        availability: 'Subscription',
      },
      {
        title: 'Blade Runner 2049',
        platform: 'For rent',
        availability: 'Rental',
      },
      {
        title: 'Inception',
        platform: 'Netflix',
        availability: 'Subscription',
      },
    ];
    return JSON.stringify(fakeApiResults);
  }
);

export async function semanticSearch(
  input: SemanticSearchInput
): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'semanticSearchPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  tools: [searchWebTool],
  prompt: `You are a movie and TV show search engine.
  A user will provide a query. Use the web search tool to find relevant content.
  The user's query may be a direct title, a description of the plot, actors, or a general theme.
  Interpret the query, use the tool, and then return a list of matching content based on the tool's output. For each result, provide all the fields in the output schema.
  For the 'id' field, generate a unique string.
  For 'imageUrl', use a placeholder from https://placehold.co/600x400.png.
  For 'aiHint', provide a short, two-word hint for image generation related to the movie title.

  If the query is "movie with magic wands", you might search for "movies about magic" and return results like "Harry Potter".
  If the query is "Tom Cruise action movie", you would search for that and return movies like "Top Gun: Maverick".

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
