// src/app/movie/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import type { Content, AvailabilityOption } from "@/types";
import { Button } from "@/components/ui/button";
import { PlayCircle, ShoppingCart, Tv, Clapperboard, Users, Tag, ArrowLeft, Heart, BadgeDollarSign, Loader2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getContentAvailability } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

// This component now fetches its own data if it doesn't have it.
function MovieDetailContent({ storedMovie }: { storedMovie: Content | null }) {
  const { id } = storedMovie || {};
  const { user, isMovieLiked, toggleLikeMovie } = useUser();
  const [movie, setMovie] = useState<Content | null>(storedMovie);
  const [availability, setAvailability] = useState<AvailabilityOption[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // This logic can be expanded to fetch movie details from an API if not found in storage.
    // For the hackathon, we assume if it's not in the DB, it's not available.
    if (!movie && id) {
        // Find movie from user's search results or liked movies as a fallback
        const userData = db.getUserData(user);
        const foundMovie = [...userData.searchResults, ...userData.likedMovies].find(m => m.id === id);
        if (foundMovie) {
            setMovie(foundMovie);
        }
    }
  }, [id, movie, user]);


  useEffect(() => {
    if (movie?.title) {
        const fetchAvailability = async () => {
            setIsLoadingAvailability(true);
            setAvailabilityError(null);
            const result = await getContentAvailability({ title: movie.title });
            if (result.success && result.data) {
                setAvailability(result.data);
            } else {
                setAvailabilityError(result.error || "Could not fetch availability.");
            }
            setIsLoadingAvailability(false);
        };
        fetchAvailability();
    }
  }, [movie?.title]);


  const handleLike = () => {
    if (!movie) return;
    const wasLiked = isMovieLiked(movie.id);
    toggleLikeMovie(movie);
    toast({ 
        title: wasLiked ? "Unliked" : "Liked!", 
        description: `"${movie.title}" was ${wasLiked ? 'removed from' : 'added to'} your list.` 
    });
  };

  if (!movie) {
    return (
         <>
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center justify-center text-center">
                 <h1 className="text-2xl font-bold mb-4">Movie details not found</h1>
                 <p className="text-muted-foreground mb-6">The movie details could not be found. Please go back and try again.</p>
                 <Button asChild>
                    <Link href="/"><ArrowLeft /> Go Home</Link>
                </Button>
            </main>
        </>
    )
  }

  const isLiked = isMovieLiked(movie.id);

  const getCheapestOption = (options: AvailabilityOption[]) => {
      if (options.length === 0) return null;
      
      const pricedOptions = options.filter(o => o.price !== 'Subscription');
      if(pricedOptions.length === 0) return null; // Only subscriptions

      return pricedOptions.reduce((cheapest, current) => {
          const cheapestPrice = parseFloat(cheapest.price.replace(/[^0-9.-]+/g,""));
          const currentPrice = parseFloat(current.price.replace(/[^0-9.-]+/g,""));
          return currentPrice < cheapestPrice ? current : cheapest;
      });
  }
  
  const cheapestOption = getCheapestOption(availability);

  const getIconForAvailability = (type: string) => {
    switch (type.toLowerCase()) {
      case 'subscription':
        return <PlayCircle className="text-primary" />;
      case 'rental':
        return <ShoppingCart className="text-primary" />;
      case 'purchase':
        return <Tv className="text-primary" />;
      default:
        return <BadgeDollarSign className="text-primary" />;
    }
  };

  return (
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/"><ArrowLeft /> Back to Search</Link>
            </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={movie.imageUrl}
                alt={`Poster for ${movie.title}`}
                fill
                className="object-cover"
                data-ai-hint={movie.aiHint}
              />
            </div>
             <Button onClick={handleLike} variant={isLiked ? "default" : "outline"} className="w-full mt-4">
                <Heart className={isLiked ? "fill-current" : ""} /> {isLiked ? 'Liked' : 'Like'}
            </Button>
          </div>
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center text-lg">
                <div className="flex items-center gap-2">
                    <Clapperboard className="text-muted-foreground" />
                    <span className="font-semibold">{movie.platform}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Tag className="text-muted-foreground" />
                    <span className="font-semibold">{movie.genre}</span>
                </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {movie.plot}
            </p>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2"><Users /> Actors</h3>
                <p className="text-muted-foreground">{movie.actors}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
                <h2 className="text-3xl font-bold font-headline">Where to Watch</h2>
                {isLoadingAvailability && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin" />
                    <span>Finding the best deals for you...</span>
                  </div>
                )}
                {availabilityError && (
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle />
                        <span>{availabilityError}</span>
                    </div>
                )}
                {!isLoadingAvailability && !availabilityError && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {availability.map(option => (
                            <div key={`${option.platform}-${option.availability}`} className="border rounded-lg p-4 flex flex-col items-start gap-4 bg-secondary/30 relative">
                                {cheapestOption && cheapestOption.platform === option.platform && cheapestOption.price === option.price && (
                                    <Badge className="absolute -top-3 right-2">Best Deal</Badge>
                                )}
                                <div className="flex items-center gap-3">
                                    {getIconForAvailability(option.availability)}
                                    <h4 className="text-xl font-semibold">{option.platform}</h4>
                                </div>
                                <p className="text-lg font-semibold">{option.availability}</p>
                                <p className="text-2xl font-bold">{option.price}</p>
                                <Button className="w-full mt-auto">Go to {option.platform}</Button>
                            </div>
                        ))}
                    </div>
                )}
                 {!isLoadingAvailability && !availabilityError && availability.length === 0 && (
                  <p className="text-muted-foreground">No availability information found for this title.</p>
                 )}
            </div>
          </div>
        </div>
      </main>
  );
}


// --- Main Page Component ---
import * as db from '@/lib/db';
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function MovieDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    // We use a temporary local storage to pass the movie object from the card click to the page.
    // This is a simple hackathon-friendly way to avoid complex state management or redundant API calls.
    const [storedMovie] = useLocalStorage<Content | null>(`movie-${id}`, null);
    
    return (
        <>
            <Header />
            <MovieDetailContent storedMovie={storedMovie} />
        </>
    );
}

function MovieDetailSkeleton() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
            <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex gap-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
