// src/app/page.tsx
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import { RecommendationsSection } from "@/components/recommendations-section";
import { Separator } from "@/components/ui/separator";
import { VoiceSearch } from "@/components/voice-search";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-12 md:gap-16">
          <VoiceSearch onTranscriptChanged={setSearchQuery} />
          <SearchSection query={searchQuery} onQueryChange={setSearchQuery} />
          <Separator />
          <RecommendationsSection />
        </div>
      </main>
    </>
  );
}