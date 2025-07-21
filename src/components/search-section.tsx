"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ContentCard } from "./content-card";
import type { Content } from "@/types";

const mockContent: Content[] = [
  {
    id: "1",
    title: "Cyber City Chronicles",
    platform: "Netflix",
    availability: "Subscription",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "cyberpunk city",
  },
  {
    id: "2",
    title: "Galactic Pioneers",
    platform: "Amazon Prime",
    availability: "Rent/Purchase",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "space ship",
  },
  {
    id: "3",
    title: "The Last Sorcerer",
    platform: "Hulu",
    availability: "Subscription",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "fantasy castle",
  },
  {
    id: "4",
    title: "Echoes of Tomorrow",
    platform: "Apple TV+",
    availability: "Subscription",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "futuristic technology",
  },
];

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    // Simulate API call
    setSearchResults(mockContent);
  };

  return (
    <section id="search" className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Find Anything, Instantly
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Search across all your streaming services from one place.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex w-full max-w-2xl mx-auto items-center space-x-2"
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for movies, shows, actors..."
            className="pl-10 text-base h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search content"
          />
        </div>
        <Button type="submit" size="lg" className="h-12">
          Search
        </Button>
      </form>

      {hasSearched && (
        <div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {searchResults.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No results found for &quot;{searchQuery}&quot;. Try another search.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
