// src/components/recommendations-section.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getRecommendations } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ContentCard } from "@/components/content-card";
import { Loader2, Sparkles } from "lucide-react";
import type { Content } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

const recommendationSchema = z.object({
  userPreferences: z
    .string()
    .min(10, "Please tell us more about what you like to watch.")
    .max(500, "Please keep your preferences under 500 characters."),
  viewingHistory: z
    .string()
    .max(500, "Please keep your viewing history under 500 characters.")
    .optional(),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;

interface RecommendationsSectionProps {
    initialQuery?: string;
}

export function RecommendationsSection({ initialQuery }: RecommendationsSectionProps) {
  const [recommendations, setRecommendations] = useLocalStorage<Content[]>(
    "recommendations",
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [storedPrefs, setStoredPrefs] = useLocalStorage<RecommendationFormValues | null>(
    "userPreferences",
    null
  );

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: storedPrefs || {
      userPreferences: initialQuery || "",
      viewingHistory: "",
    },
  });

   useEffect(() => {
    // If there's an initial query from the search page, update the form.
    // This connects the AI's "memory" of your search to its recommendations.
    if (initialQuery && (!storedPrefs?.userPreferences || storedPrefs.userPreferences !== initialQuery)) {
      form.setValue("userPreferences", `Based on my search for "${initialQuery}", I like...`);
    } else if (storedPrefs) {
        form.reset(storedPrefs);
    }
   }, [initialQuery, storedPrefs, form]);

  const onSubmit: SubmitHandler<RecommendationFormValues> = async (data) => {
    setIsLoading(true);
    setRecommendations([]);
    setStoredPrefs(data);

    const result = await getRecommendations({
      userPreferences: data.userPreferences,
      viewingHistory: data.viewingHistory || "No history provided.",
    });

    setIsLoading(false);

    if (result.success && result.data) {
      const formattedData: Content[] = result.data.map((rec, index) => ({
        id: `${rec.title}-${index}`,
        title: rec.title,
        platform: rec.platform,
        availability: rec.availability,
        imageUrl: `https://placehold.co/600x338.png`,
        aiHint: "movie poster",
        reason: rec.reason,
      }));
      setRecommendations(formattedData);
    } else {
      toast({
        variant: "destructive",
        title: "Recommendation Error",
        description:
          result.error ||
          "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <section id="recommendations" className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          AI-Powered Recommendations
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Let our AI find your next favorite show or movie based on your search.
        </p>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'I love sci-fi thrillers with complex plots, similar to Blade Runner. My favorite actors are Harrison Ford and Ryan Gosling.'"
                      className="min-h-[100px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your favorite genres, movies, shows, or actors. This is pre-filled based on your last search.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="viewingHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Viewing History (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Recently watched: The Matrix on Netflix (loved it), The Office on Peacock (5/5), Dune on Max (excellent).'"
                      className="min-h-[100px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List some titles you've watched recently and what you thought of them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="lg" className="w-full">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles />
              )}
              Generate Recommendations
            </Button>
          </form>
        </Form>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {recommendations.length > 0 && (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recommendations.map((content) => (
              <CarouselItem key={content.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <ContentCard content={content} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
}
