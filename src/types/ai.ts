import {z} from 'genkit';

export const SemanticSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      "The user's search query. Can be a title, description, or natural language question about content."
    ),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

// Define AvailabilityOptionSchema here as well for self-containment or import it if preferred
const AvailabilityOptionSchema = z.object({
    platform: z.string().describe('The streaming service or platform.'),
    availability: z.enum(['Subscription', 'Rental', 'Purchase', 'Free']).describe('The type of viewing option.'), // Added 'Free'
    price: z.string().describe('The price for the option. For subscriptions, this can be the monthly fee or just "Subscription". For free content, use "Free".'), // Updated description
    link: z.string().url().optional().describe('Optional deep link to the content on the platform.'), // Added link field
});

export type AvailabilityOption = z.infer<typeof AvailabilityOptionSchema>; // Export for use in other files

const SearchResultSchema = z.object({
  id: z.string().describe('A unique ID for the content.'),
  title: z.string().describe('The title of the found content.'),
  plot: z.string().describe('The plot summary of the content.'),
  actors: z.string().describe('A comma-separated list of primary actors.'),
  genre: z.string().describe('The primary genre of the content.'),
  imageUrl: z.string().url().describe('A placeholder image URL for the content.'),
  aiHint: z
    .string()
    .describe(
      'A hint for AI to generate a relevant image, e.g., "movie poster".'
    ),
  // Replaced single platform/availability with an array of availability options
  availability: z.array(AvailabilityOptionSchema).describe('An array of viewing options for the content.'),
});

export const SemanticSearchOutputSchema = z
  .array(SearchResultSchema)
  .describe('An array of content that matches the search query.');
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

export const FindContentAvailabilityInputSchema = z.object({
  title: z.string().describe('The title of the movie or TV show to find.'),
});
export type FindContentAvailabilityInput = z.infer<typeof FindContentAvailabilityInputSchema>;

export const FindContentAvailabilityOutputSchema = z.array(AvailabilityOptionSchema);
export type FindContentAvailabilityOutput = z.infer<typeof FindContentAvailabilityOutputSchema>;
