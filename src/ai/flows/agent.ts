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
    description: 'Search the web for information about movies, TV shows, and live sports events.',
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
      },
      {
        id: '102',
        title: 'Blade Runner 2049',
        platform: 'For rent',
        availability: 'Rental',
        genre: 'Sci-Fi Neo-noir',
        year: 2017,
        plot: 'A young blade runner\'s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who\'s been missing for thirty years.',
        actors: 'Ryan Gosling, Harrison Ford, Ana de Armas',
        aiHint: 'futuristic city',
      },
      {
        id: '103',
        title: 'Inception',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Sci-Fi Heist',
        year: 2010,
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
        aiHint: 'spinning top',
      },
      {
        id: '104',
        title: 'Parasite',
        platform: 'Hulu',
        availability: 'Subscription',
        genre: 'Dark Comedy Thriller',
        year: 2019,
        plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        actors: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong',
        aiHint: 'family portrait',
      },
      {
        id: '105',
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        platform: 'Amazon Prime',
        availability: 'Purchase',
        genre: 'Fantasy Adventure',
        year: 2001,
        plot: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        actors: 'Elijah Wood, Ian McKellen, Orlando Bloom',
        aiHint: 'fantasy landscape',
      },
      {
        id: '106',
        title: 'Pulp Fiction',
        platform: 'For rent',
        availability: 'Rental',
        genre: 'Crime Film',
        year: 1994,
        plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        actors: 'John Travolta, Uma Thurman, Samuel L. Jackson',
        aiHint: 'diner dance',
      },
      {
        id: '107',
        title: 'Forrest Gump',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Drama',
        year: 1994,
        plot: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
        actors: 'Tom Hanks, Robin Wright, Gary Sinise',
        aiHint: 'park bench',
      },
      {
        id: '108',
        title: 'The Godfather',
        platform: 'Paramount+',
        availability: 'Subscription',
        genre: 'Crime Drama',
        year: 1972,
        plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        actors: 'Marlon Brando, Al Pacino, James Caan',
        aiHint: 'mafia boss',
      },
      {
        id: '109',
        title: 'Harry Potter and the Sorcerer\'s Stone',
        platform: 'HBO Max',
        availability: 'Subscription',
        genre: 'Fantasy',
        year: 2001,
        plot: 'An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.',
        actors: 'Daniel Radcliffe, Rupert Grint, Emma Watson',
        aiHint: 'magic castle',
      },
       {
        id: '110',
        title: 'The Office (US)',
        platform: 'Peacock',
        availability: 'Subscription',
        genre: 'Sitcom',
        year: 2005,
        plot: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
        actors: 'Steve Carell, Rainn Wilson, John Krasinski',
        aiHint: 'office supplies',
      },
       {
        id: '111',
        title: 'Breaking Bad',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Crime Drama',
        year: 2008,
        plot: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
        actors: 'Bryan Cranston, Aaron Paul, Anna Gunn',
        aiHint: 'desert RV',
      },
       {
        id: '112',
        title: 'Top Gun: Maverick',
        platform: 'For rent',
        availability: 'Rental',
        genre: 'Action',
        year: 2022,
        plot: 'After more than thirty years of service as one of the Navy\'s top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.',
        actors: 'Tom Cruise, Miles Teller, Jennifer Connelly',
        aiHint: 'fighter jet',
      },
      {
        id: '113',
        title: 'Death Note',
        platform: 'Netflix',
        availability: 'Subscription',
        genre: 'Anime Thriller',
        year: 2006,
        plot: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook that can kill anyone whose name is written in it.',
        actors: 'Mamoru Miyano, Kappei Yamaguchi, Shido Nakamura',
        aiHint: 'shinigami apple',
      },
      {
        id: '201',
        title: 'Champions League Final: Real Madrid vs. Liverpool',
        platform: 'Paramount+',
        availability: 'Live Subscription',
        genre: 'Soccer',
        year: 2024,
        plot: 'The final match of the UEFA Champions League, featuring two of the biggest clubs in Europe.',
        actors: 'Real Madrid, Liverpool',
        aiHint: 'soccer stadium',
      },
      {
        id: '202',
        title: 'NBA Finals: Game 7',
        platform: 'ESPN+',
        availability: 'Live Subscription',
        genre: 'Basketball',
        year: 2024,
        plot: 'The deciding game of the NBA championship series. Winner takes all.',
        actors: 'Boston Celtics, Golden State Warriors',
        aiHint: 'basketball court',
      },
      {
        id: '203',
        title: 'IPL Cricket Final: Mumbai Indians vs. Chennai Super Kings',
        platform: 'Hotstar',
        availability: 'Live Subscription',
        genre: 'Cricket',
        year: 2024,
        plot: 'The final match of the Indian Premier League, the biggest T20 cricket tournament.',
        actors: 'Mumbai Indians, Chennai Super Kings',
        aiHint: 'cricket stadium night',
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

- If the query is a direct title, actor, plot description, or sports team, use the web search tool to find relevant content.
- If the query describes a mood, sentiment, or feeling (e.g., "I'm sad," "I want to laugh," "something romantic"), interpret that mood and translate it into a search query for the tool. For example:
  - "I'm sad" -> search for "comedy" or "feel-good" or "uplifting" movies.
  - "I want a romantic movie" -> search for "romance" or "romantic comedy".
  - "Something scary" -> search for "horror" or "thriller".
- The user's query may be a direct title, a description of the plot, actors, a general theme, or a live event.

After interpreting the query and using the tool, return a list of matching content based on the tool's output. For each result, provide all the fields in the output schema.
For 'imageUrl', generate a url using https://placehold.co/400x600.png.
For 'aiHint', provide a short, two-word hint for image generation related to the content title.

Example Scenarios:
- If the query is "movie with magic wands", you might search for "movies about magic" and return results like "Harry Potter".
- If the query is "I want to watch something happy", you would search the tool for "comedy" or "feel-good" and return results like "The Office" or "Forrest Gump".
- If the query is "where can I watch the soccer game", you would search the tool for "soccer" or "live sports" and return results like "Champions League Final".

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

    // Post-process to ensure a placeholder image is always present.
    return output.map(item => {
        if (!item.imageUrl || !item.imageUrl.startsWith('https://placehold.co')) {
            item.imageUrl = `https://placehold.co/400x600.png`;
        }
        return item;
    });
  }
);
