import { Header } from "@/components/header";
import { SearchSection } from "@/components/search-section";
import { RecommendationsSection } from "@/components/recommendations-section";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-12 md:gap-16">
          <SearchSection />
          <Separator />
          <RecommendationsSection />
        </div>
      </main>
    </>
  );
}
