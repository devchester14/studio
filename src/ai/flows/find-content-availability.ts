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
    // and consolidate the results. For this demo, we simulate finding various options.
    
    const allOptions: Record<string, FindContentAvailabilityOutput> = {
        'The Matrix': [
            { platform: 'HBO Max', availability: 'Subscription', price: '$14.99/month' },
            { platform: 'Amazon Prime', availability: 'Rental', price: '$3.99' },
            { platform: 'Google Play', availability: 'Rental', price: '$3.99' },
            { platform: 'Vudu', availability: 'Purchase', price: '$14.99' },
        ],
        'Blade Runner 2049': [
             { platform: 'Amazon Prime', availability: 'Rental', price: '$2.99' },
             { platform: 'Apple TV', availability: 'Purchase', price: '$12.99' },
             { platform: 'YouTube', availability: 'Rental', price: '$3.99' },
        ],
        'Inception': [
            { platform: 'Netflix', availability: 'Subscription', price: '$9.99/month' },
            { platform: 'Hulu', availability: 'Subscription', price: '$7.99/month' },
            { platform: 'Amazon Prime', availability: 'Rental', price: '$3.99' },
        ],
        'Parasite': [
             { platform: 'Hulu', availability: 'Subscription', price: '$7.99/month' },
             { platform: 'Amazon Prime', availability: 'Purchase', price: '$9.99' },
        ],
         'The Lord of the Rings: The Fellowship of the Ring': [
            { platform: 'HBO Max', availability: 'Subscription', price: '$14.99/month' },
            { platform: 'Amazon Prime', availability: 'Purchase', price: '$19.99' },
            { platform: 'Apple TV', availability: 'Purchase', price: '$19.99' },
        ],
        'Top Gun: Maverick': [
            { platform: 'Paramount+', availability: 'Subscription', price: '$5.99/month' },
            { platform: 'Amazon Prime', availability: 'Rental', price: '$4.99' },
            { platform: 'Apple TV', availability: 'Purchase', price: '$19.99' },
            { platform: 'Google Play', availability: 'Purchase', price: '$19.99' },
        ],
        'Death Note': [
            { platform: 'Netflix', availability: 'Subscription', price: '$9.99/month' },
            { platform: 'Crunchyroll', availability: 'Subscription', price: '$7.99/month' },
            { platform: 'Hulu', availability: 'Subscription', price: '$7.99/month' },
        ],
        'Champions League Final: Real Madrid vs. Liverpool': [
            { platform: 'Paramount+', availability: 'Subscription', price: '$5.99/month' },
            { platform: 'fuboTV', availability: 'Subscription', price: '$74.99/month' },
        ],
         'NBA Finals: Game 7': [
            { platform: 'Sling TV', availability: 'Subscription', price: '$40.00/month' },
            { platform: 'YouTube TV', availability: 'Subscription', price: '$72.99/month' },
        ],
        'IPL Cricket Final: Mumbai Indians vs. Chennai Super Kings':[
            { platform: 'Hotstar', availability: 'Subscription', price: '$49.99/year' },
            { platform: 'ESPN+', availability: 'Subscription', price: '$9.99/month' },
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
  
  Use the findContentTool to look up all available platforms, including subscription, rental, and purchase options.
  
  Return the full list of options provided by the tool. Do not summarize or alter the tool's output.`,
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
