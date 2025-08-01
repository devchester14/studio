// src/app/results/page.tsx
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import type { Content } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { searchContent } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { ContentCard } from "@/components/content-card";
import { useUser } from "@/hooks/use-user";
import { QuirkyLoader } from "@/components/quirky-loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";


function ResultsPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  
  const { query, setQuery, searchResults, setSearchResults, isLoading: isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [isSearching, setIsSearching] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setShowLoader(true);
    const result = await searchContent({ query: searchQuery });

    if (result.success && result.data) {
      setSearchResults(result.data as Content[]);
      console.log("Search results from agent:", result.data); // Log the search results
    } else {
      toast({
        variant: "destructive",
        title: "Search Error",
        description:
          result.error ||
          "An unexpected error occurred. Please try again later.",
      });
      setSearchResults([]);
    }
    setIsSearching(false);
  }, [setSearchResults, toast]);

  useEffect(() => {
    // If the URL has a query, trust it as the source of truth
    if (urlQuery) {
        setQuery(urlQuery);
        performSearch(urlQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);


  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery.trim().length >= 3) {
        setQuery(newQuery);
        router.push(`/results?q=${encodeURIComponent(newQuery)}`);
    }
  };
  
  const carouselResults = searchResults.slice(0, 4);
  const scrollableResults = searchResults.slice(4, 6);

  if (isUserLoading) {
      return <div className="flex-1 flex justify-center items-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex w-full items-center space-x-2 mb-8">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for 'sci-fi movies with spaceships'..."
                    className="pl-10 text-base h-12"
                    aria-label="Search content"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchSubmit(e.currentTarget.value);
                      }
                    }}
                />
            </div>
            <Button onClick={() => handleSearchSubmit(query)} size="lg" className="h-12" disabled={isSearching}>
                {isSearching ? <Loader2 className="animate-spin" /> : 'Search'}
            </Button>
        </div>

        {showLoader && (
            <QuirkyLoader onComplete={() => setShowLoader(false)} />
        )}

        {!showLoader && searchResults.length > 0 && (
            <section id="search-results" className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">
                    Search Results for &quot;{query}&quot;
                    </h2>
                </div>
                
                {/* Carousel for first 4 results */}
                {carouselResults.length > 0 && (
                    <Carousel
                        opts={{
                        align: "start",
                        loop: carouselResults.length > 1,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                        {carouselResults.map((content) => (
                            <CarouselItem key={content.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <div className="p-1">
                                <ContentCard content={content} />
                            </div>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-4" />
                        <CarouselNext className="hidden md:flex -right-4"/>
                    </Carousel>
                )}

                {/* Scrollable area for the next 2 results */}
                {scrollableResults.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold tracking-tight font-headline mb-4">More Results</h3>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {scrollableResults.map((content) => (
                                    <ContentCard key={content.id} content={content} />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}
            </section>
        )}

        {!showLoader && searchResults.length === 0 && query && (
             <div className="text-center py-10">
                <p className="text-muted-foreground">
                No results found for &quot;{query}&quot;. Try another search.
                </p>
            </div>
        )}
      </main>
    </>
  );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsPageComponent />
        </Suspense>
    )
}
