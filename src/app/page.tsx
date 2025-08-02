// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VoiceSearch } from "@/components/voice-search";
import { useDebounce } from "@/hooks/use-debounce";
import { searchContent } from "./actions";
import { ContentCard } from "@/components/content-card";
import { CarouselSection } from "@/components/carousel-section";
import type { Content } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

export default function Home() {
  const { query, setQuery } = useUser();
  const [results, setResults] = useState<any[]>([]);
  const [trendingContent, setTrendingContent] = useState<any[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<any[]>([]);
  const [genreContent, setGenreContent] = useState<any[]>([]);
  const [dynamicTitles, setDynamicTitles] = useState({
    trending: "Trending Now",
    regional: "Regional Watch", 
    recommended: "You Might Like"
  });
  const [isLoading, setIsLoading] = useState(false);
  // Changed debounce delay to 5000ms (5 seconds)
  const debouncedQuery = useDebounce(query, 3000);
  const router = useRouter();
  const { toast } = useToast();

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim().length >= 3) {
      router.push(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript);
  }

  const performSearch = useCallback(async (searchQuery: string) => {
      if (searchQuery.trim().length < 3) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      const result = await searchContent({ query: searchQuery });
      setIsLoading(false);

      if (result.success && result.data) {
        const content = result.data as any[];
        setResults(content);
        
        // Update carousel content based on search results
        if (content.length > 0) {
          // Use search results for recommendations
          setRecommendedContent(content.slice(0, 10));
          
          // Update regional content based on search genre
          const genres = [...new Set(content.map(item => item.genre).filter(Boolean))];
          if (genres.length > 0) {
            // Use first genre for genre-specific content
            const genreResult = await searchContent({ query: genres[0] });
            if (genreResult.success && genreResult.data) {
              setGenreContent(genreResult.data as any[]);
              
              // Generate dynamic titles based on search
              const searchLower = searchQuery.toLowerCase();
              const firstGenre = genres[0]?.toLowerCase();
              
              setDynamicTitles({
                trending: searchLower.includes('movie') ? "Popular Movies" : 
                         searchLower.includes('series') || searchLower.includes('show') ? "Popular Series" :
                         searchLower.includes('anime') ? "Popular Anime" : "Trending Now",
                regional: firstGenre ? `More ${firstGenre} Content` : "Regional Watch",
                recommended: searchLower.includes('action') ? "More Action" :
                           searchLower.includes('comedy') ? "More Comedy" :
                           searchLower.includes('drama') ? "More Drama" :
                           searchLower.includes('sci-fi') ? "More Sci-Fi" :
                           searchLower.includes('horror') ? "More Horror" :
                           searchLower.includes('romance') ? "More Romance" : "You Might Like"
              });
            }
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: "Search Error",
          description: result.error || "An unexpected error occurred."
        });
      }
  }, [toast]);

  // Load trending content on mount
  useEffect(() => {
    const loadInitialContent = async () => {
      // Load trending content
      const trendingResult = await searchContent({ query: "trending movies 2024" });
      if (trendingResult.success && trendingResult.data) {
        setTrendingContent(trendingResult.data as any[]);
      }
      
      // Load regional content
      const regionalResult = await searchContent({ query: "regional movies bollywood" });
      if (regionalResult.success && regionalResult.data) {
        setGenreContent(regionalResult.data as any[]);
      }
    };
    loadInitialContent();
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
              Find Anything, Instantly
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your universal guide to streaming content.
            </p>
        </div>
        <div className="flex w-full max-w-4xl mx-auto items-center space-x-2">
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
                        handleSearchSubmit(query);
                      }
                    }}
                />
            </div>
            <VoiceSearch onTranscriptChanged={handleVoiceSearch} />
        </div>
        
        {/* Carousel Sections */}
        <section className="mt-12">
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            
            {/* Search Results - Show first when available */}
            {!isLoading && results.length > 0 && (
              <CarouselSection 
                title="Search Results" 
                content={results}
              />
            )}
            
            {/* Always show other sections, but after search results if they exist */}
            <>
              {/* Trending Content */}
              <CarouselSection 
                title={dynamicTitles.trending} 
                content={trendingContent}
              />
              
              {/* Regional Content */}
              <CarouselSection 
                title={dynamicTitles.regional} 
                content={genreContent}
              />
              
              {/* Recommended Content - Only show when there are search results */}
              {recommendedContent.length > 0 && (
                <CarouselSection 
                  title={dynamicTitles.recommended} 
                  content={recommendedContent}
                />
              )}
            </>
            
            {/* Remove the additional sections when search results exist */}
        </section>
      </main>
    </>
  );
}
