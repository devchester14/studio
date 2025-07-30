// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getRecommendations } from "@/app/actions";
import { Header } from "@/components/header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ContentCard } from "@/components/content-card";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Content } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useLocalStorage<Content[]>(
    "dashboard_recommendations",
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [likedMovies] = useLocalStorage<Content[]>("likedMovies", []);
  const [searchQuery] = useLocalStorage<string>("searchQuery", "");
  const { toast } = useToast();

  const generateDashboardRecommendations = async () => {
    setIsLoading(true);
    setHasGenerated(true);

    const viewingHistory =
      likedMovies.map((m) => m.title).join(", ") || "No viewing history yet.";
    const userPreferences =
      searchQuery || "Suggest some popular and highly-rated movies.";
      
    const result = await getRecommendations({
        userPreferences: `Based on my recent search for "${userPreferences}" and my liked movies, suggest something new.`,
        viewingHistory: viewingHistory,
    });

    setIsLoading(false);

    if (result.success && result.data) {
       const formattedData: Content[] = result.data.map((rec, index) => ({
        id: `rec-${rec.title}-${index}`,
        title: rec.title,
        platform: rec.platform,
        availability: rec.availability,
        imageUrl: `https://placehold.co/400x600.png?text=${encodeURIComponent(rec.title.replace(/\s/g, '+'))}`,
        aiHint: "movie poster",
        reason: rec.reason,
        plot: rec.reason, // Use reason as a plot substitute for display
      }));
      setRecommendations(formattedData);
    } else {
        toast({
            variant: "destructive",
            title: "Recommendation Error",
            description: result.error || "Could not generate recommendations."
        });
    }
  };
  
  // Automatically generate recommendations on first load if none exist
  useEffect(() => {
    if(recommendations.length === 0 && !hasGenerated){
        generateDashboardRecommendations();
    }
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight font-headline">
                Your Personal Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                AI-powered recommendations based on your taste.
                </p>
            </div>
            <Button onClick={generateDashboardRecommendations} disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Refresh Recommendations
            </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && recommendations.length > 0 && (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {recommendations.map((content) => (
                <CarouselItem key={content.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1 h-full">
                    <ContentCard content={content} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4"/>
          </Carousel>
        )}

        {!isLoading && recommendations.length === 0 && hasGenerated && (
             <div className="text-center py-20">
                <h3 className="text-2xl font-semibold">Nothing to show yet!</h3>
                <p className="text-muted-foreground mt-2">Like some movies or use the search to get personalized recommendations.</p>
             </div>
        )}
      </main>
    </>
  );
}
