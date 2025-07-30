// src/app/movie/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import type { Content } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayCircle, ShoppingCart, Tv, Clapperboard, Users, Tag, ArrowLeft, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [movie, setMovie] = useLocalStorage<Content | null>(`movie-${id}`, null);
  const [likedMovies, setLikedMovies] = useLocalStorage<Content[]>("likedMovies", []);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // This effect ensures that if the page is loaded directly,
    // it tries to get the data from localStorage.
    if (!movie) {
        const storedValue = localStorage.getItem(`movie-${id}`);
        if(storedValue) {
            try {
                setMovie(JSON.parse(storedValue));
            } catch (e) {
                console.error("Failed to parse movie data from localStorage", e)
            }
        }
    }
    setIsLoading(false);
  }, [id, movie, setMovie]);

  const isLiked = likedMovies.some((likedMovie) => likedMovie.id === movie?.id);

  const handleLike = () => {
    if (!movie) return;
    let updatedLikedMovies = [...likedMovies];
    if (isLiked) {
      updatedLikedMovies = updatedLikedMovies.filter(
        (likedMovie) => likedMovie.id !== movie.id
      );
      toast({ title: "Unliked", description: `Removed "${movie.title}" from your list.` });
    } else {
      updatedLikedMovies.push(movie);
      toast({ title: "Liked!", description: `Added "${movie.title}" to your list.` });
    }
    setLikedMovies(updatedLikedMovies);
  };


  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    // Since we can't guarantee data, show a message instead of 404
    // to allow user to navigate back.
    return (
         <>
            <Header />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col items-center justify-center text-center">
                 <h1 className="text-2xl font-bold mb-4">Movie details not found</h1>
                 <p className="text-muted-foreground mb-6">The movie details might not have been saved correctly. Please go back and try again.</p>
                 <Button asChild>
                    <Link href="/"><ArrowLeft /> Go Home</Link>
                </Button>
            </main>
        </>
    )
  }

  const getPlanDetails = (availability: string) => {
    const plans = [];
    if(availability.toLowerCase().includes('subscription')){
      plans.push({
        type: "Subscription",
        price: "$9.99/month",
        icon: <PlayCircle className="text-primary"/>,
        buttonLabel: "Watch on " + movie.platform,
        buttonVariant: "default" as const
      })
    }
    if(availability.toLowerCase().includes('rent')){
      plans.push({
        type: "Rent",
        price: "$3.99",
        icon: <ShoppingCart className="text-primary"/>,
        buttonLabel: "Rent Now",
        buttonVariant: "secondary" as const
      })
    }
    if(availability.toLowerCase().includes('purchase')){
       plans.push({
        type: "Purchase",
        price: "$14.99",
        icon: <Tv className="text-primary"/>,
        buttonLabel: "Buy Now",
        buttonVariant: "outline" as const
      })
    }
    return plans;
  }
  
  const watchPlans = getPlanDetails(movie.availability);

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
            <Button asChild variant="outline">
                <Link href="/results"><ArrowLeft /> Back to Search</Link>
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {watchPlans.map(plan => (
                        <div key={plan.type} className="border rounded-lg p-4 flex flex-col items-start gap-4 bg-secondary/30">
                            <div className="flex items-center gap-3">
                                {plan.icon}
                                <h4 className="text-xl font-semibold">{plan.type}</h4>
                            </div>
                            <p className="text-2xl font-bold">{plan.price}</p>
                            <Button variant={plan.buttonVariant} className="w-full mt-auto">{plan.buttonLabel}</Button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </main>
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
