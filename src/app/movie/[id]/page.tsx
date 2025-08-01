// src/app/movie/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import type { Content, AvailabilityOption } from "@/types";
import { Button } from "@/components/ui/button";
import { Clapperboard, Users, Tag, ArrowLeft, Heart, Loader2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getContentAvailability } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

// Mapping of platform names to logo file paths or generated icons
const platformLogos: Record<string, string> = {
  "Netflix": "/assets/netflix.png",
  "Hulu": "/assets/hulu.png",
  "Amazon Prime": "/assets/prime.png",
  "HBO Max": "/assets/hbomax.png",
  "Paramount+": "/assets/paramount+.png",
  "Peacock": "/assets/peacock.png",
  "ESPN+": "/assets/espn+.png",
  "Hotstar": "/assets/hotstar.png",
  "Sling TV": "/assets/sling.png",
  "YouTube TV": "/assets/youtube.png",
  "Apple TV": "/assets/appletv.png",
  "Google Play": "/assets/googleplay.png",
  "Vudu": "/assets/vudu.png",
  "Crunchyroll": "/assets/crunchyroll.png",
  "fuboTV": "/assets/fubotv.png",
  "Disney+": "/assets/disneyplus.png",
  // Generated icons for generic options
  "Rental": 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  "Purchase": 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.392.982a2.25 2.25 0 002.013 1.244H19.5m-16.5 0h16.5m-16.5 0v-8.894m0 8.894h-1.5a2.25 2.25 0 01-2.25-2.25v-1.5m2.25 3.75v-.886m0 0a2.25 2.25 0 011.243-2.013l1.943-.548a3.75 3.75 0 012.139.925l4.663 4.663a3.75 3.75 0 002.14.925l1.943-.548a2.25 2.25 0 011.243-2.013m0 0v-.375a2.25 2.25 0 00-1.124-1.908L20.5 9.5m-8.217-3.382a42.502 42.502 0 013.6-1.334L19.5 7.5m-9.217-3.382c.05-.02.105-.037.16-.054m-5.306 D4.5 5.625a42.45 42.45 0 01-.778 1.233h-.75" /></svg>',
};

// Function to generate a basic deep link URL (may not work for all platforms/content)
const generateDeepLink = (platform: string, title: string): string | undefined => {
    const encodedTitle = encodeURIComponent(title);
    switch (platform) {
        case "Netflix":
            return `https://www.netflix.com/search?q=${encodedTitle}`;
        case "Hulu":
            return `https://www.hulu.com/search?q=${encodedTitle}`;
        case "Amazon Prime": // Using the 'prime.png' asset name
            return `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video`;
        case "HBO Max": // Using the 'hbomax.png' asset name
            return `https://play.max.com/search/q/${encodedTitle}`;
        case "Paramount+": // Using the 'paramount+.png' asset name
             return `https://www.paramountplus.com/search/?q=${encodedTitle}`;
        case "Peacock": // Using the 'peacock.png' asset name
             return `https://www.peacocktv.com/find/search?q=${encodedTitle}`;
        case "ESPN+": // Using the 'espn+.png' asset name
            return `https://plus.espn.com/search?q=${encodedTitle}`;
        case "Hotstar": // Using the 'hotstar.png' asset name
             return `https://www.hotstar.com/in/search?q=${encodedTitle}`;
        case "Sling TV": // Using the 'sling.png' asset name
            return `https://www.sling.com/programming/search?q=${encodedTitle}`;
        case "YouTube TV": // Using the 'youtube.png' asset name
            return `https://tv.youtube.com/search?q=${encodedTitle}`;
        case "Apple TV": // Using the 'appletv.png' asset name
             return `https://tv.apple.com/search?term=${encodedTitle}`;
        case "Google Play": // Using the 'googleplay.png' asset name
             return `https://play.google.com/store/search?q=${encodedTitle}&c=movies`;
        case "Vudu": // Using the 'vudu.png' asset name
             return `https://www.vudu.com/content/movies/search?searchString=${encodedTitle}`;
        case "Crunchyroll": // Using the 'crunchyroll.png' asset name
             return `https://www.crunchyroll.com/search?q=${encodedTitle}`;
        case "fuboTV": // Using the 'fubotv.png' asset name
             return `https://fubotv.com/search?q=${encodedTitle}`;
        case "Disney+": // Using the 'disneyplus.png' asset name
             return `https://www.disneyplus.com/search?q=${encodedTitle}`;
        // Generic cases for rental/purchase might not have direct deep links to content
        default:
            return undefined;
    }
};

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
                {!isLoadingAvailability && !availabilityError && availability.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {availability.map(option => {
                            const deepLink = generateDeepLink(option.platform, movie.title);
                            return (
                                <div key={`${option.platform}-${option.availability}`} className="border rounded-lg p-4 flex flex-col items-start gap-4 bg-secondary/30 relative">
                                    {cheapestOption && cheapestOption.platform === option.platform && cheapestOption.price === option.price && (
                                        <Badge className="absolute -top-3 right-2">Best Deal</Badge>
                                    )}
                                    <div className="flex items-center gap-3">
                                        {/* Display OTT logo or generic icon */}
                                        {platformLogos[option.platform] ? (
                                            <Image
                                                src={platformLogos[option.platform]}
                                                alt={`${option.platform} logo`}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        ) : ( // Fallback to generic icon if no specific logo is found
                                            <Image
                                                src={platformLogos[option.availability] || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6" /></svg>'} // Generic plus icon as a final fallback
                                                alt={`${option.availability} icon`}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        )}
                                        <h4 className="text-xl font-semibold">{option.platform}</h4>
                                    </div>
                                    <p className="text-lg font-semibold">{option.availability}</p>
                                    <p className="text-2xl font-bold">{option.price}</p>
                                    {deepLink ? (
                                        <Button asChild className="w-full mt-auto">
                                            <a href={deepLink} target="_blank" rel="noopener noreferrer">Go to {option.platform}</a>
                                        </Button>
                                    ) : (
                                         <Button className="w-full mt-auto" disabled>
                                            Go to {option.platform}
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
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
