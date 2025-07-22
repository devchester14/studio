// src/app/results/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import type { Content } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { VoiceSearch } from "@/components/voice-search";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useLocalStorage("searchQuery", initialQuery);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  const [results, setResults] = useState<Content[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Sync query in local storage with URL param on initial load
    if(initialQuery){
        setQuery(initialQuery);
    }
  }, [initialQuery, setQuery]);
  

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim().length >= 3) {
      setIsLoadingSearch(true);
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
                 {isLoadingSearch && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />}
            </div>
            <VoiceSearch onTranscriptChanged={handleVoiceSearch} />
            <Button onClick={() => handleSearch(query)} size="lg" className="h-12">
                Search
            </Button>
        </div>

        <SearchSection
          onResults={setResults}
          onLoading={setIsLoadingResults}
          onSearched={setHasSearched}
        />
      </main>
    </>
  );
}
