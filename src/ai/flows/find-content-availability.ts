'use server';
/**
 * @fileOverview An AI-powered flow for finding where to watch content.
 *
 * - findContentAvailability - A function that finds all viewing options for a title.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { FindContentAvailabilityInputSchema, FindContentAvailabilityOutputSchema, type FindContentAvailabilityInput, type FindContentAvailabilityOutput } from '@/types/ai';


const findContentTool = ai.defineTool(
  {
    name: 'findContentTool',
    description: 'Looks up a movie or TV show title and returns all the platforms where it can be watched, rented, or purchased.',
    inputSchema: FindContentAvailabilityInputSchema,
    outputSchema: FindContentAvailabilityOutputSchema,
  },
  async ({ title }) => {
    console.log(`[Availability Search] Searching for: ${title}`);
    // In a real application, you would call multiple APIs (e.g., JustWatch, Watchmode) here
    // and consolidate the results. For this demo, we simulate finding various options
    // and add placeholder links.
    
    const encodedTitle = encodeURIComponent(title);

    const allOptions: Record<string, FindContentAvailabilityOutput> = {
        'The Matrix': [
            { platform: 'HBO Max', availability: 'Subscription', price: '$14.99/month', link: `https://play.max.com/search/q/${encodedTitle}` },
            { platform: 'Amazon Prime', availability: 'Rental', price: '$3.99', link: `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video` },
            { platform: 'Google Play', availability: 'Rental', price: '$3.99', link: `https://play.google.com/store/search?q=${encodedTitle}&c=movies` },
            { platform: 'Vudu', availability: 'Purchase', price: '$14.99', link: `https://www.vudu.com/content/movies/search?searchString=${encodedTitle}` },
        ],
        'Blade Runner 2049': [
             { platform: 'Amazon Prime', availability: 'Rental', price: '$2.99', link: `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video` },
             { platform: 'Apple TV', availability: 'Purchase', price: '$12.99', link: `https://tv.apple.com/search?term=${encodedTitle}` },
             { platform: 'YouTube', availability: 'Rental', price: '$3.99', link: `https://www.youtube.com/results?search_query=${encodedTitle}` },
        ],
        'Inception': [
            { platform: 'Netflix', availability: 'Subscription', price: '$9.99/month', link: `https://www.netflix.com/search?q=${encodedTitle}` },
            { platform: 'Hulu', availability: 'Subscription', price: '$7.99/month', link: `https://www.hulu.com/search?q=${encodedTitle}` },
            { platform: 'Amazon Prime', availability: 'Rental', price: '$3.99', link: `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video` },
        ],
        'Parasite': [
             { platform: 'Hulu', availability: 'Subscription', price: '$7.99/month', link: `https://www.hulu.com/search?q=${encodedTitle}` },
             { platform: 'Amazon Prime', availability: 'Purchase', price: '$9.99', link: `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video` },
        ],
         'The Lord of the Rings: The Fellowship of the Ring': [
            { platform: 'HBO Max', availability: 'Subscription', price: '$14.99/month', link: `https://play.max.com/search/q/${encodedTitle}` },
            { platform: 'Amazon Prime', availability: 'Purchase', price: '$19.99', link: `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video` },
            { platform: 'Apple TV', availability: 'Purchase', price: '$19.99', link: `https://tv.apple.com/search?term=${encodedTitle}` },
        ],
        'Top Gun: Maverick': [
            { platform: 'Paramount+', availability: 'Subscription', price: '$5.99/month', link: `https://www.paramountplus.com/search/?q=${encodedTitle}` },
            { platform: 'Amazon Prime', availability: 'Rental', price: '$4.99', link: `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video` },
            { platform: 'Apple TV', availability: 'Purchase', price: '$19.99', link: `https://tv.apple.com/search?term=${encodedTitle}` },
            { platform: 'Google Play', availability: 'Purchase', price: '$19.99', link: `https://play.google.com/store/search?q=${encodedTitle}&c=movies` },
        ],
        'Death Note': [
            { platform: 'Netflix', availability: 'Subscription', price: '$9.99/month', link: `https://www.netflix.com/search?q=${encodedTitle}` },
            { platform: 'Crunchyroll', availability: 'Subscription', price: '$7.99/month', link: `https://www.crunchyroll.com/search?q=${encodedTitle}` },
            { platform: 'Hulu', availability: 'Subscription', price: '$7.99/month', link: `https://www.hulu.com/search?q=${encodedTitle}` },
        ],
        'Champions League Final: Real Madrid vs. Liverpool': [
            { platform: 'Paramount+', availability: 'Subscription', price: '$5.99/month', link: `https://www.paramountplus.com/search/?q=${encodedTitle}` },
            { platform: 'fuboTV', availability: 'Subscription', price: '$74.99/month', link: `https://fubotv.com/search?q=${encodedTitle}` },
        ],
         'NBA Finals: Game 7': [
            { platform: 'Sling TV', availability: 'Subscription', price: '$40.00/month', link: `https://www.sling.com/programming/search?q=${encodedTitle}` },
            { platform: 'YouTube TV', availability: 'Subscription', price: '$72.99/month', link: `https://tv.youtube.com/search?q=${encodedTitle}` },
        ],
        'IPL Cricket Final: Mumbai Indians vs. Chennai Super Kings':[
            { platform: 'Hotstar', availability: 'Subscription', price: '$49.99/year', link: `https://www.hotstar.com/in/search?q=${encodedTitle}` },
            { platform: 'ESPN+', availability: 'Subscription', price: '$9.99/month', link: `https://plus.espn.com/search?q=${encodedTitle}` },
        ]
    };
    
    // Find a key that is a substring of the title, to handle minor variations
    const foundKey = Object.keys(allOptions).find(key => title.includes(key));

    return foundKey ? allOptions[foundKey] : [];
  }
);


export async function findContentAvailability(
  input: FindContentAvailabilityInput
): Promise<FindContentAvailabilityOutput> {
  return findContentAvailabilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findContentAvailabilityPrompt',
  input: {schema: FindContentAvailabilityInputSchema},
  output: {schema: FindContentAvailabilityOutputSchema},
  tools: [findContentTool],
  prompt: `A user wants to know where they can watch the following title: {{{title}}}.
  
  **IMPORTANT: You must not process or return any information about adult or sexual content.**

  Use the findContentTool to look up all available platforms, including subscription, rental, and purchase options.
  
  Return the full list of options provided by the tool. Do not summarize or alter the tool's output.
  Ensure that each availability option includes a 'link' property with a relevant URL to the content on that platform if possible, otherwise use a placeholder or a search URL.`,
});

const findContentAvailabilityFlow = ai.defineFlow(
  {
    name: 'findContentAvailabilityFlow',
    inputSchema: FindContentAvailabilityInputSchema,
    outputSchema: FindContentAvailabilityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output || [];
  }
);
