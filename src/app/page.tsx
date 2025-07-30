// src/app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { VoiceSearch } from "@/components/voice-search";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function Home() {
  const [query, setQuery] = useLocalStorage("searchQuery", "");
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim().length >= 3) {
      router.push(`/results?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript);
    handleSearch(transcript);
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="w-full text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">
              Find Anything, Instantly
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your universal guide to streaming content.
            </p>
        </div>
        <div className="flex w-full items-center space-x-2">
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
        </div>
      </main>
    </>
  );
}
