// src/app/results/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import type { Content } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { VoiceSearch } from "@/components/voice-search";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { searchContent } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { ContentCard } from "@/components/content-card";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useLocalStorage("searchQuery", initialQuery);
  const { toast } = useToast();
  
  const [results, setResults] = useLocalStorage<Content[]>("searchResults", []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sync query in local storage with URL param on initial load
    if(initialQuery){
        setQuery(initialQuery);
    }
  }, [initialQuery, setQuery]);
  
  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const result = await searchContent({ query });

      if (result.success && result.data) {
        setResults(result.data as Content[]);
      } else {
        toast({
          variant: "destructive",
          title: "Search Error",
          description:
            result.error ||
            "An unexpected error occurred. Please try again later.",
        });
        setResults([]);
      }
      setIsLoading(false);
    };

    performSearch();
  }, [query, setResults, toast]);


  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim().length >= 3) {
        // Just update the query, the useEffect will trigger the search
        setQuery(searchQuery)
        router.push(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript);
    handleSearch(transcript);
  };

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
                        handleSearch(query);
                      }
                    }}
                />
            </div>
            <VoiceSearch onTranscriptChanged={handleVoiceSearch} />
            <Button onClick={() => handleSearch(query)} size="lg" className="h-12">
                Search
            </Button>
        </div>

        {isLoading && (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {!isLoading && results.length > 0 && (
            <section id="search-results" className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">
                    Search Results for &quot;{query}&quot;
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {results.map((content) => (
                    <ContentCard key={content.id} content={content} />
                ))}
                </div>
            </section>
        )}

        {!isLoading && results.length === 0 && query && (
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
