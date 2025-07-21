// src/components/search-section.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { searchContent } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Search, Loader2 } from "lucide-react";
import { ContentCard } from "./content-card";
import type { Content } from "@/types";

const searchSchema = z.object({
  query: z.string(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchSection({ query, onQueryChange }: SearchSectionProps) {
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  // Sync external query changes to the form
  useEffect(() => {
    form.setValue("query", query);
  }, [query, form]);

  const formQuery = form.watch("query");

  // Sync internal form changes to the parent
  useEffect(() => {
      onQueryChange(formQuery);
  }, [formQuery, onQueryChange]);


  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      if (formQuery.length >= 3) {
        setIsLoading(true);
        setHasSearched(true);
        setCurrentQuery(formQuery);
        setSearchResults([]);

        const result = await searchContent({ query: formQuery });
        setIsLoading(false);

        if (result.success && result.data) {
          setSearchResults(result.data as Content[]);
        } else {
          toast({
            variant: "destructive",
            title: "Search Error",
            description:
              result.error ||
              "An unexpected error occurred. Please try again later.",
          });
        }
      } else {
        setSearchResults([]);
        setHasSearched(false);
        if (isLoading) setIsLoading(false);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(debounceSearch);
  }, [formQuery, toast]);


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

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()} // Prevent form submission on enter
          className="flex w-full max-w-2xl mx-auto items-start space-x-2"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormControl>
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      type="search"
                      placeholder="Search for 'sci-fi movies with spaceships'..."
                      className="pl-10 text-base h-12"
                      aria-label="Search content"
                    />
                  </div>
                </FormControl>
                 <FormMessage className="absolute" />
              </FormItem>
            )}
          />
        </form>
      </Form>


      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {hasSearched && !isLoading && (
        <div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {searchResults.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
             formQuery.length >= 3 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    No results found for &quot;{currentQuery}&quot;. Try another search.
                  </p>
                </div>
             )
          )}
        </div>
      )}
    </section>
  );
}