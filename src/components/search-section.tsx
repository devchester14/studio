// src/components/search-section.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { searchContent } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { ContentCard } from "./content-card";
import type { Content } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SearchSectionProps {
  onResults: (results: Content[]) => void;
  onLoading: (isLoading: boolean) => void;
  onSearched: (hasSearched: boolean) => void;
}

export function SearchSection({ onResults, onLoading, onSearched }: SearchSectionProps) {
  const [searchResults, setSearchResults] = useLocalStorage<Content[]>("searchResults", []);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading, onLoading]);

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 3) {
        setSearchResults([]);
        setIsLoading(false);
        onSearched(false);
        return;
      }
      
      onSearched(true);
      setIsLoading(true);

      const result = await searchContent({ query });

      if (result.success && result.data) {
        setSearchResults(result.data as Content[]);
        onResults(result.data as Content[]);
      } else {
        toast({
          variant: "destructive",
          title: "Search Error",
          description:
            result.error ||
            "An unexpected error occurred. Please try again later.",
        });
        setSearchResults([]);
        onResults([]);
      }
      setIsLoading(false);
    };

    performSearch();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (searchResults.length > 0) {
    return (
      <section id="search-results" className="space-y-8">
         <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
              Search Results for &quot;{query}&quot;
            </h2>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {searchResults.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </section>
    );
  }

  if (query) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No results found for &quot;{query}&quot;. Try another search.
        </p>
      </div>
    );
  }

  return null;
}
