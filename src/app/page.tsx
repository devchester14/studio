// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VoiceSearch } from "@/components/voice-search";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useDebounce } from "@/hooks/use-debounce";
import { searchContent } from "./actions";
import { ContentCard } from "@/components/content-card";
import type { Content } from "@/types";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const [query, setQuery] = useLocalStorage("searchQuery", "");
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
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
        setResults(result.data as Content[]);
      } else {
        toast({
          variant: "destructive",
          title: "Search Error",
          description: result.error || "An unexpected error occurred."
        });
      }
  }, [toast]);

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
        
        <section className="mt-12">
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {results.map((content) => (
                        <ContentCard key={content.id} content={content} />
                    ))}
                </div>
            )}
             {!isLoading && results.length === 0 && debouncedQuery.length >= 3 && (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">
                    No results found for &quot;{debouncedQuery}&quot;.
                    </p>
                </div>
            )}
        </section>

      </main>
    </>
  );
}
