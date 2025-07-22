// src/app/results/page.tsx
"use client";

import { useState }from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import type { Content } from "@/types";

export default function ResultsPage() {
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <SearchSection
          onResults={setResults}
          onLoading={setIsLoading}
          onSearched={setHasSearched}
        />
      </main>
    </>
  );
}
