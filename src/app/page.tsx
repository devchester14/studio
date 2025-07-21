// src/app/page.tsx
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import { Content } from "@/types";

export default function Home() {
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
