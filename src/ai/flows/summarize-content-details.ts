// Summarize Content Details Flow
'use server';
/**
 * @fileOverview A content summarization AI agent.
 *
 * - summarizeContentDetails - A function that handles the content summarization process.
 * - SummarizeContentDetailsInput - The input type for the summarizeContentDetails function.
 * - SummarizeContentDetailsOutput - The return type for the summarizeContentDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentDetailsInputSchema = z.object({
  title: z.string().describe('The title of the content to summarize.'),
  plot: z.string().describe('The plot of the content.'),
  actors: z.string().describe('The actors in the content.'),
  genre: z.string().describe('The genre of the content.'),
});
export type SummarizeContentDetailsInput = z.infer<typeof SummarizeContentDetailsInputSchema>;

const SummarizeContentDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the content details.'),
});
export type SummarizeContentDetailsOutput = z.infer<typeof SummarizeContentDetailsOutputSchema>;

export async function summarizeContentDetails(input: SummarizeContentDetailsInput): Promise<SummarizeContentDetailsOutput> {
  return summarizeContentDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeContentDetailsPrompt',
  input: {schema: SummarizeContentDetailsInputSchema},
  output: {schema: SummarizeContentDetailsOutputSchema},
  prompt: `Summarize the content details provided below in a concise manner.

Title: {{{title}}}
Plot: {{{plot}}}
Actors: {{{actors}}}
Genre: {{{genre}}}

Summary:`,
});

const summarizeContentDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeContentDetailsFlow',
    inputSchema: SummarizeContentDetailsInputSchema,
    outputSchema: SummarizeContentDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
