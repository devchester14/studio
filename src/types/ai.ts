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
  plot: z.string().describe('The plot summary of the content.'),
  actors: z.string().describe('A comma-separated list of primary actors.'),
  genre: z.string().describe('The primary genre of the content.'),
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

export const FindContentAvailabilityInputSchema = z.object({
  title: z.string().describe('The title of the movie or TV show to find.'),
});
export type FindContentAvailabilityInput = z.infer<typeof FindContentAvailabilityInputSchema>;

const AvailabilityOptionSchema = z.object({
    platform: z.string().describe('The streaming service or platform.'),
    availability: z.enum(['Subscription', 'Rental', 'Purchase']).describe('The type of viewing option.'),
    price: z.string().describe('The price for the option. For subscriptions, this can be the monthly fee or just "Subscription".'),
});

export const FindContentAvailabilityOutputSchema = z.array(AvailabilityOptionSchema);
export type FindContentAvailabilityOutput = z.infer<typeof FindContentAvailabilityOutputSchema>;
