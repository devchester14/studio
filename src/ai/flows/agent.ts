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
    description: 'Search the web for information about movies, TV shows, and live sports events. if the statement is emotional, you should search for the mood or sentiment of the statement and return results based on that.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.string().describe('A JSON string of search results.'),
  },
  async input => {
    console.log(`[Web Search] Searching for: ${input.query}`);
    // In a real application, you would call a search API (e.g., Google Search API or a movie/sports database API) here.
    // For this example, we'll return a more extensive simulated result set.
    const fakeApiResults = [
      {
        id: '101',
        title: 'The Matrix',
        platform: 'HBO Max',
        availability: 'Subscription',
        genre: 'Sci-Fi Action',
        year: 1999,
        plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
        aiHint: 'digital rain code',
        imageUrl: 'https://static.wikia.nocookie.net/matrix/images/5/56/The_Matrix_digital_release_cover.jpg/revision/latest?cb=20210908111245',
      },
    ];

    // Simulate filtering based on the query to make it seem more real
    const queryLower = input.query.toLowerCase();
    const filteredResults = fakeApiResults.filter(r => 
        r.title.toLowerCase().includes(queryLower) || 
        r.genre.toLowerCase().includes(queryLower) ||
        r.actors.toLowerCase().includes(queryLower) ||
        input.query.includes(String(r.year)) ||
        (queryLower.includes('magic') && r.title.includes('Harry Potter')) ||
        (queryLower.includes('cruise') && r.title.includes('Top Gun')) ||
        (queryLower.includes('death') && r.title.includes('Death Note')) ||
        (queryLower.includes('soccer') && r.genre.toLowerCase().includes('soccer')) ||
        (queryLower.includes('basketball') && r.genre.toLowerCase().includes('basketball')) ||
        ((queryLower.includes('ipl') || queryLower.includes('cricket')) && r.genre.toLowerCase().includes('cricket'))
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
  prompt: `You are an emotionally intelligent movie, TV show, and live sports search engine.
A user will provide a query. Your first step is to determine the user's intent. Are they searching for a specific title, a live event, or are they expressing a mood or a desire for a certain genre?

**IMPORTANT: You must not generate or provide any information about adult or sexual content.**

- If the query is a direct title, actor, plot description, or sports team, use the web search tool to find relevant content.
- If the query describes a mood, sentiment, or feeling (e.g., "I'm sad," "I want to laugh," "something romantic"), interpret that mood and translate it into a search query for the tool. For example:
  - "I'm sad" -> search for "comedy" or "feel-good" or "uplifting" movies.
  - "I want a romantic movie" -> search for "romance" or "romantic comedy".
  - "Something scary" -> search for "horror" or "thriller".
- The user's query may be a direct title, a description of the plot, actors, a general theme, or a live event.

After interpreting the query and using the tool, return a list of matching content based on the tool's output. For each result, provide all the fields in the output schema.
For search imbdb for 'imageUrl',search poster image of the fetched results by their title name in imdb and 2:3 ratio for movie title.
For 'aiHint', provide a short, two-word hint for image generation related to the content title.

Example Scenarios:
- If the query is "movie with magic wands", you might search for "movies about magic" and return results like "Harry Potter".
- If the query is "I want to watch something happy", you would search the tool for "comedy" or "feel-good" and return results like "The Office" or "Forrest Gump".
- If the query is "where can I watch the soccer game", you would search the tool for "soccer" or "live sports" and return results like "Champions League Final".

User Query: {{{query}}}
  
Return up to 6 results.
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

    // Post-process to ensure a placeholder image is always present.
    return output.map(item => {
      
        if (!item.imageUrl || !item.imageUrl.startsWith('https://placehold.co')) {
            item.imageUrl = `https://placehold.co/400x600.png`;
        }
        return item;
    });
  }
);
