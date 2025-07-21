import {z} from 'genkit';

export const SemanticSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      "The user's search query. Can be a title, description, or natural language question about content."
    ),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

const SearchResultSchema = z.object({
  id: z.string().describe('A unique ID for the content.'),
  title: z.string().describe('The title of the found content.'),
  platform: z
    .string()
    .describe(
      'The platform where the content is hosted (e.g., Netflix, Amazon Prime, Hulu).'
    ),
  availability: z
    .string()
    .describe('How the content can be accessed (e.g., rental, purchase, subscription).'),
  imageUrl: z.string().url().describe('A placeholder image URL for the content.'),
  aiHint: z
    .string()
    .describe(
      'A hint for AI to generate a relevant image, e.g., "movie poster".'
    ),
});

export const SemanticSearchOutputSchema = z
  .array(SearchResultSchema)
  .describe('An array of content that matches the search query.');
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;
