// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/hooks/use-user";
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
// Removed SubscriptionAnalysis import
// import { SubscriptionAnalysis } from "@/components/subscription-analysis";

interface RecommendationCarousel {
    title: string;
    recommendations: Content[];
}

export default function DashboardPage() {
  const { user, likedMovies, query, isLoading: isUserLoading } = useUser();
  const [carousels, setCarousels] = useState<RecommendationCarousel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  const generateDashboardRecommendations = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setHasGenerated(true);
    setCarousels([]);

    const newCarousels: RecommendationCarousel[] = [];
    
    const viewingHistory =
      likedMovies.map((m) => m.title).join(", ") || "No viewing history yet.";

    // Carousel 1: Based on recent search
    if (query) {
        const searchRecResult = await getRecommendations({
            userPreferences: `Based on my recent search for "${query}", suggest some similar movies or shows.`,
            viewingHistory,
        });
        if (searchRecResult.success && searchRecResult.data && searchRecResult.data.length > 0) {
            newCarousels.push({
                title: `Inspired by your search for "${query}"`,
                recommendations: formatRecommendations(searchRecResult.data, 'search-rec'),
            });
        }
    }

    // Carousel 2: Based on favorite genre
    const genreCounts: Record<string, number> = likedMovies.reduce((acc, movie) => {
        if(movie.genre) {
            acc[movie.genre] = (acc[movie.genre] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const favoriteGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b, '');

    if (favoriteGenre) {
         const genreRecResult = await getRecommendations({
            userPreferences: `I really like the ${favoriteGenre} genre. Suggest some more movies like that.`,
            viewingHistory,
        });
        if (genreRecResult.success && genreRecResult.data && genreRecResult.data.length > 0) {
            newCarousels.push({
                title: `Because you like ${favoriteGenre}`,
                recommendations: formatRecommendations(genreRecResult.data, 'genre-rec'),
            });
        }
    }

    // Carousel 3: General "Next Watch"
    const generalRecResult = await getRecommendations({
      userPreferences: "Suggest some popular and highly-rated movies based on my viewing history.",
      viewingHistory,
    });
     if (generalRecResult.success && generalRecResult.data) {
       newCarousels.push({
         title: "Your Next Watch",
         recommendations: formatRecommendations(generalRecResult.data, 'general-rec'),
       });
    } else {
        toast({
            variant: "destructive",
            title: "Recommendation Error",
            description: generalRecResult.error || "Could not generate recommendations."
        });
    }

    setCarousels(newCarousels);
    setIsLoading(false);
  }, [likedMovies, query, toast, user]);
  
  const formatRecommendations = (recs: any[], prefix: string): Content[] => {
      return recs.map((rec, index) => ({
        id: `rec-${prefix}-${rec.title.replace(/s/g, '')}-${index}`,
        title: rec.title,
        platform: rec.platform,
        availability: rec.availability,
        genre: rec.genre,
        imageUrl: `https://placehold.co/400x600.png?text=${encodeURIComponent(rec.title.replace(/s/g, '+'))}`,
        aiHint: "movie poster",
        reason: rec.reason,
        plot: rec.reason, // Use reason as a plot substitute for display
      }));
  }

  useEffect(() => {
    if(isUserLoading || !user) return;
    generateDashboardRecommendations();
  }, [isUserLoading, user, generateDashboardRecommendations]);
  
  if (isUserLoading) {
    return (
        <>
            <Header />
            <div className="flex-1 flex justify-center items-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        </>
    );
  }

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
                Hi {user}, here are AI-powered recommendations based on your taste.
                </p>
            </div>
            <Button onClick={generateDashboardRecommendations} disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Refresh Recommendations
            </Button>
        </div>
        
        {/* Removed Subscription Analysis */}
        {/*
        <div className="mb-12">
            <SubscriptionAnalysis />
        </div>
        */}
        
        <div className="space-y-12">
            {isLoading && carousels.length === 0 && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && carousels.length === 0 && hasGenerated && (
                <div className="text-center py-20">
                    <h3 className="text-2xl font-semibold">Nothing to show yet!</h3>
                    <p className="text-muted-foreground mt-2">Like some movies or use the search to get personalized recommendations.</p>
                </div>
            )}
            
            {carousels.map((carousel) => (
                <div key={carousel.title}>
                    <h2 className="text-2xl font-bold font-headline mb-4">{carousel.title}</h2>
                    <Carousel
                        opts={{
                        align: "start",
                        loop: carousel.recommendations.length > 4, // Loop only if there are enough items
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                        {carousel.recommendations.map((content) => (
                            <CarouselItem key={content.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/8">
                            <div className="p-1 h-full">
                                <ContentCard content={content} />
                            </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-4" />
                        <CarouselNext className="hidden md:flex -right-4"/>
                    </Carousel>
                </div>
            ))}
        </div>
      </main>
    </>
  );
}
