import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Content } from "@/types";
import { PlayCircle } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ContentCardProps {
  content: Content;
}

// Mapping of platform names to logo file paths or generated icons
const platformLogos: Record<string, string> = {
  "Netflix": "/assets/netflix.png",
  "Hulu": "/assets/hulu.png",
  "Amazon Prime": "/assets/prime.png",
  "HBO Max": "/assets/hbomax.png",
  "Paramount+": "/assets/paramount+.png",
  "Peacock": "/assets/peacock.png",
  "ESPN+": "/assets/espn+.png",
  "Hotstar": "/assets/hotstar.png",
  "Sling TV": "/assets/sling.png",
  "YouTube TV": "/assets/youtube.png",
  "Apple TV": "/assets/appletv.png",
  "Google Play": "/assets/googleplay.png",
  "Vudu": "/assets/vudu.png",
  "Crunchyroll": "/assets/crunchyroll.png",
  "fuboTV": "/assets/fubotv.png",
  "Disney+": "/assets/disneyplus.png",
  // Generated icons for generic options
  "Rental": 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  "Purchase": 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.392.982a2.25 2.25 0 002.013 1.244H19.5m-16.5 0h16.5m-16.5 0v-8.894m0 8.894h-1.5a2.25 2.25 0 01-2.25-2.25v-1.5m2.25 3.75v-.886m0 0a2.25 2.25 0 011.243-2.013l1.943-.548a3.75 3.75 0 012.139.925l4.663 4.663a3.75 3.75 0 002.14.925l1.943-.548a2.25 2.25 0 011.243-2.013m0 0v-.375a2.25 2.25 0 00-1.124-1.908L20.5 9.5m-8.217-3.382a42.502 42.502 0 013.6-1.334L19.5 7.5m-9.217-3.382c.05-.02.105-.037.16-.054m-5.306 D4.5 5.625a42.45 42.45 0 01-.778 1.233h-.75" /></svg>',
};

// Helper function to get unique platforms from content availability string
const getUniquePlatforms = (availability: string): string[] => {
    // This split and trim might need adjustment based on the exact format
    // of your availability strings from the AI.
    const platforms = availability.split(',').map(p => p.trim()).filter(p => p);
    
    // Attempt to map various availability descriptions to known platform keys
    return platforms.map(p => {
        const lowerP = p.toLowerCase();
        if (lowerP.includes('netflix')) return 'Netflix';
        if (lowerP.includes('hulu')) return 'Hulu';
        if (lowerP.includes('amazon prime') || lowerP.includes('prime video')) return 'Amazon Prime'; // Handle variations
        if (lowerP.includes('hbo max')) return 'HBO Max';
        if (lowerP.includes('paramount+')) return 'Paramount+';
        if (lowerP.includes('peacock')) return 'Peacock';
        if (lowerP.includes('espn+')) return 'ESPN+';
        if (lowerP.includes('hotstar')) return 'Hotstar';
        if (lowerP.includes('sling tv')) return 'Sling TV';
        if (lowerP.includes('youtube tv')) return 'YouTube TV';
        if (lowerP.includes('apple tv')) return 'Apple TV';
        if (lowerP.includes('google play')) return 'Google Play';
        if (lowerP.includes('vudu')) return 'Vudu';
        if (lowerP.includes('crunchyroll')) return 'Crunchyroll';
        if (lowerP.includes('fubotv')) return 'fuboTV';
        if (lowerP.includes('disney+')) return 'Disney+';
        if (lowerP.includes('rent')) return 'Rental'; // Map 'rent' keywords to generic Rental icon
        if (lowerP.includes('purchase') || lowerP.includes('buy')) return 'Purchase'; // Map 'purchase'/'buy' keywords to generic Purchase icon
        return p; // Return original if not mapped
    }).filter(p => platformLogos[p]) // Filter out platforms without a corresponding logo
    .reduce((unique: string[], item: string) => unique.includes(item) ? unique : [...unique, item], []); // Get unique values
};

export function ContentCard({ content }: ContentCardProps) {
  // We use a temporary local storage item to pass the full movie object
  // to the detail page. This is a hackathon-friendly way to avoid
  // having to re-fetch data on the detail page.
  const [, setMovieForDetailPage] = useLocalStorage<Content | null>(`movie-${content.id}`, null);

  const renderActionButtons = () => {
    const availabilityLower = content.availability.toLowerCase();
    const actions = [];

    if (availabilityLower.includes("subscription")) {
      actions.push(
        <Button key="watch" className="flex-1">
          <PlayCircle />
          Watch Now
        </Button>
      );
    }
    if (availabilityLower.includes("rent")) {
      actions.push(
        <Button key="rent" variant="secondary" className="flex-1">
          Rent
        </Button>
      );
    }
    if (availabilityLower.includes("purchase") || availabilityLower.includes("buy")) {
       actions.push(
        <Button key="buy" variant="outline" className="flex-1">
          Buy
        </Button>
      );
    }
    
    if(actions.length === 0) {
        actions.push(
             <Button key="info" variant="ghost" className="flex-1">
                More Info
             </Button>
        )
    }

    return actions;
  };
  
  const handleCardClick = () => {
    setMovieForDetailPage(content);
  };

  const platforms = getUniquePlatforms(content.availability);
  const displayedPlatforms = platforms.slice(0, 2);
  const remainingPlatformsCount = platforms.length - displayedPlatforms.length;

  return (
    <Link href={`/movie/${content.id}`} onClick={handleCardClick} className="block h-full">
      <Card className="flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-primary/20 h-full">
        <CardHeader className="p-0">
          <div className="relative aspect-[2/3]">
            <Image
              src={content.imageUrl}
              alt={`Poster for ${content.title}`}
              fill
              className="object-cover"
              data-ai-hint={content.aiHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <CardTitle className="absolute bottom-4 left-4 text-2xl font-bold text-white font-headline">
              {content.title}
            </CardTitle>
            {/* Display OTT logos */}
            <div className="absolute top-2 right-2 flex gap-1">
                {displayedPlatforms.map((platform) => (
                    platformLogos[platform] && (
                        <Image
                            key={platform}
                            src={platformLogos[platform]}
                            alt={`${platform} logo`}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    )
                ))}
                {remainingPlatformsCount > 0 && (
                    <Badge className="rounded-full">+{remainingPlatformsCount}</Badge>
                )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <CardDescription className="line-clamp-3 text-sm mb-4">
              {content.plot}
          </CardDescription>
          {/* Removed old platform/availability badges */}
          {/*
          <div className="flex flex-wrap gap-2 mt-auto">
            <Badge variant="secondary">{content.platform}</Badge>
            <Badge variant="outline">{content.availability}</Badge>
            {content.genre && <Badge variant="default">{content.genre}</Badge>}
          </div>
          */}
           <div className="flex flex-wrap gap-2 mt-auto">
             {content.genre && <Badge variant="default">{content.genre}</Badge>}
           </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="w-full flex items-center gap-2">
            {renderActionButtons()}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
