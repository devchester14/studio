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
  const [results, setResults] = useState<Content[]>([]);
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);
  const [genreContent, setGenreContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Changed debounce delay to 5000ms (5 seconds)
  const debouncedQuery = useDebounce(query, 5000);
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
        const content = result.data as Content[];
        setResults(content);
        
        // Update carousel content based on search results
        if (content.length > 0) {
          // Use search results for recommendations
          setRecommendedContent(content.slice(0, 10));
          
          // Extract genres from search results for genre-specific content
          const genres = [...new Set(content.map(item => item.genre).filter(Boolean))];
          if (genres.length > 0) {
            // Use first genre for genre-specific content
            const genreResult = await searchContent({ query: genres[0] });
            if (genreResult.success && genreResult.data) {
              setGenreContent(genreResult.data as Content[]);
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
    const loadTrendingContent = async () => {
      const result = await searchContent({ query: "trending movies 2024" });
      if (result.success && result.data) {
        setTrendingContent(result.data as Content[]);
      }
    };
    loadTrendingContent();
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
            
            {/* Trending Content */}
            <CarouselSection 
              title="Trending Now" 
              content={trendingContent}
            />
            
            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <CarouselSection 
                title="Search Results" 
                content={results}
              />
            )}
            
            {/* Recommended Content */}
            {recommendedContent.length > 0 && (
              <CarouselSection 
                title="You Might Like" 
                content={recommendedContent}
              />
            )}
            
            {/* Genre-specific Content */}
            {genreContent.length > 0 && (
              <CarouselSection 
                title={`More ${genreContent[0]?.genre || 'Similar'} Content`}
                content={genreContent}
              />
            )}
        </section>
      </main>
    </>
  );
}
