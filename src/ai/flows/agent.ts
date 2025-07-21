'use server';
/**
 * @fileOverview An AI-powered agent for finding content.
 *
 * - agent - A function that handles the agentic search process.
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
    // In a real application, you would call a search API (e.g., Google Search API or a movie database API) here.
    // For this example, we'll return a more extensive simulated result set.
    const fakeApiResults = [
      {
        id: '101',
        title: 'The Matrix',
        platform: 'HBO Max',
        availability: 'Subscription',
        genre: 'Sci-Fi Action',
        year: 1999,
        aiHint: 'digital rain code',
      },
      {
        id: '102',
        title: 'Blade Runner 2049',
        platform: 'For rent',
        availability: 'Rental',
        genre: 'Sci-Fi Neo-noir',
        year: 2017,
        aiHint: 'futuristic city',
      },
      {
        id: '103',
        title: 'Inception',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Sci-Fi Heist',
        year: 2010,
        aiHint: 'spinning top',
      },
      {
        id: '104',
        title: 'Parasite',
        platform: 'Hulu',
        availability: 'Subscription',
        genre: 'Dark Comedy Thriller',
        year: 2019,
        aiHint: 'family portrait',
      },
      {
        id: '105',
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        platform: 'Amazon Prime',
        availability: 'Purchase',
        genre: 'Fantasy Adventure',
        year: 2001,
        aiHint: 'fantasy landscape',
      },
      {
        id: '106',
        title: 'Pulp Fiction',
        platform: 'For rent',
        availability: 'Rental',
        genre: 'Crime Film',
        year: 1994,
        aiHint: 'diner dance',
      },
      {
        id: '107',
        title: 'Forrest Gump',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Drama',
        year: 1994,
        aiHint: 'park bench',
      },
      {
        id: '108',
        title: 'The Godfather',
        platform: 'Paramount+',
        availability: 'Subscription',
        genre: 'Crime Drama',
        year: 1972,
        aiHint: 'mafia boss',
      },
      {
        id: '109',
        title: 'Harry Potter and the Sorcerer\'s Stone',
        platform: 'HBO Max',
        availability: 'Subscription',
        genre: 'Fantasy',
        year: 2001,
        aiHint: 'magic castle',
      },
       {
        id: '110',
        title: 'The Office (US)',
        platform: 'Peacock',
        availability: 'Subscription',
        genre: 'Sitcom',
        year: 2005,
        aiHint: 'office supplies',
      },
       {
        id: '111',
        title: 'Breaking Bad',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Crime Drama',
        year: 2008,
        aiHint: 'desert RV',
      },
       {
        id: '112',
        title: 'Top Gun: Maverick',
        platform: 'For rent',
        availability: 'Rental',
        genre: 'Action',
        year: 2022,
        aiHint: 'fighter jet',
      },
      {
        id: '113',
        title: 'Death Note',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Anime Thriller',
        year: 2006,
        aiHint: 'shinigami apple',
      }
    ];

    // Simulate filtering based on the query to make it seem more real
    const queryLower = input.query.toLowerCase();
    const filteredResults = fakeApiResults.filter(r => 
        r.title.toLowerCase().includes(queryLower) || 
        r.genre.toLowerCase().includes(queryLower) ||
        input.query.includes(String(r.year)) ||
        (queryLower.includes('magic') && r.title.includes('Harry Potter')) ||
        (queryLower.includes('cruise') && r.title.includes('Top Gun')) ||
        (queryLower.includes('death') && r.title.includes('Death Note'))
    );

    return JSON.stringify(filteredResults.length > 0 ? filteredResults : fakeApiResults.slice(0,4));
  }
);

export async function agent(
  input: SemanticSearchInput
): Promise<SemanticSearchOutput> {
  return agentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agentPrompt',
  input: {schema: SemanticSearchInputSchema},
  output: {schema: SemanticSearchOutputSchema},
  tools: [searchWebTool],
  prompt: `You are a movie and TV show search engine.
  A user will provide a query. Use the web search tool to find relevant content.
  The user's query may be a direct title, a description of the plot, actors, or a general theme.
  Interpret the query, use the tool, and then return a list of matching content based on the tool's output. For each result, provide all the fields in the output schema.
  For 'imageUrl', generate a unique url using https://picsum.photos/seed/{a creative seed from the aiHint}/600/400.
  For 'aiHint', provide a short, two-word hint for image generation related to the movie title.

  If the query is "movie with magic wands", you might search for "movies about magic" and return results like "Harry Potter".
  If the query is "Tom Cruise action movie", you would search for that and return movies like "Top Gun: Maverick".

  User Query: {{{query}}}
  
  Return up to 10 results.
  `,
});

const agentFlow = ai.defineFlow(
  {
    name: 'agentFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return [];
    }

    // Post-process to add the image URL if the model didn't, just in case.
    return output.map(item => {
        if (!item.imageUrl || item.imageUrl.includes('placehold.co')) {
            const seed = item.aiHint.replace(/\s+/g, '-').toLowerCase() || 'movie-poster';
            item.imageUrl = `https://picsum.photos/seed/${seed}/600/400`;
        }
        return item;
    });
  }
);
