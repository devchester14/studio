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
import type { Content, AvailabilityOption } from "@/types"; // Import AvailabilityOption
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
  "Disney+": "/assets/disneyplus.png",
  // Generated icons for generic options
  "Rental": 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  "Purchase": 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.392.982a2.25 2.25 0 002.013 1.244H19.5m-16.5 0h16.5m-16.5 0v-8.894m0 8.894h-1.5a2.25 2.25 0 01-2.25-2.25v-1.5m2.25 3.75v-.886m0 0a2.25 2.25 0 011.243-2.013l1.943-.548a3.75 3.75 0 012.139.925l4.663 4.663a3.75 3.75 0 002.14.925l1.943-.548a2.25 2.25 0 011.243-2.013m0 0v-.375a2.25 2.25 0 00-1.124-1.908L20.5 9.5m-8.217-3.382a42.502 42.502 0 013.6-1.334L19.5 7.5m-9.217-3.382c.05-.02.105-.037.16-.054m-5.306 D4.5 5.625a42.45 42.45 0 01-.778 1.233h-.75" /></svg>',
};

// Helper function to get unique platforms from content availability array
const getUniquePlatforms = (availability: AvailabilityOption[] | string): string[] => {
    // Check if availability is the old string format for backward compatibility if needed
    if (typeof availability === 'string') {
        // This part can be removed once the agent consistently returns the array format
        console.warn("Using old string availability format in getUniquePlatforms.");
        const platforms = availability.split(',').map(p => p.trim()).filter(p => p);
        return platforms.map(p => {
            const lowerP = p.toLowerCase();
            if (lowerP.includes('netflix')) return 'Netflix';
            // Add other platform mappings here if needed for the old format
            return p;
        }).filter(p => platformLogos[p])
        .reduce((unique: string[], item: string) => unique.includes(item) ? unique : [...unique, item], []);
    }

    // Handle the new array format
    if (Array.isArray(availability)) {
        const platforms = availability.map(option => option.platform).filter(p => p);
        // Get unique platform names and filter out those without a corresponding logo
        return platforms.filter(p => platformLogos[p])
                        .reduce((unique: string[], item: string) => unique.includes(item) ? unique : [...unique, item], []);
    }

    return []; // Return empty array if availability is neither string nor array
};

export function ContentCard({ content }: ContentCardProps) {
  // We use a temporary local storage item to pass the full movie object
  // to the detail page. This is a hackathon-friendly way to avoid
  // having to re-fetch data on the detail page.
  const [, setMovieForDetailPage] = useLocalStorage<Content | null>(`movie-${content.id}`, null);

  // Modify renderActionButtons to use the new availability structure
  const renderActionButtons = () => {
    const actions: JSX.Element[] = [];
    
    if (Array.isArray(content.availability)) {
        // Filter for unique availability types (Subscription, Rental, Purchase)
        const uniqueAvailabilityTypes = content.availability.reduce((types, option) => {
            if (!types.includes(option.availability)) {
                types.push(option.availability);
            }
            return types;
        }, [] as string[]);

        uniqueAvailabilityTypes.forEach(type => {
            const lowerType = type.toLowerCase();
            if (lowerType.includes("subscription")) {
                actions.push(
                    <Button key="watch" className="flex-1" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Deep link to first available platform
                        if (Array.isArray(content.availability)) {
                            const firstPlatform = content.availability.find(opt => 
                                opt.availability.toLowerCase().includes("subscription")
                            );
                            if (firstPlatform) {
                                window.open(getDeepLink(firstPlatform.platform, content.title), '_blank');
                            }
                        }
                    }}>
                      <PlayCircle />
                      Watch Now
                    </Button>
                  );
            } else if (lowerType.includes("rental")) {
                actions.push(
                    <Button key="rent" variant="secondary" className="flex-1" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (Array.isArray(content.availability)) {
                            const firstPlatform = content.availability.find(opt => 
                                opt.availability.toLowerCase().includes("rental")
                            );
                            if (firstPlatform) {
                                window.open(getDeepLink(firstPlatform.platform, content.title), '_blank');
                            }
                        }
                    }}>
                      Rent
                    </Button>
                  );
            } else if (lowerType.includes("purchase") || lowerType.includes("buy")) {
                 actions.push(
                    <Button key="buy" variant="outline" className="flex-1" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (Array.isArray(content.availability)) {
                            const firstPlatform = content.availability.find(opt => 
                                opt.availability.toLowerCase().includes("purchase") || 
                                opt.availability.toLowerCase().includes("buy")
                            );
                            if (firstPlatform) {
                                window.open(getDeepLink(firstPlatform.platform, content.title), '_blank');
                            }
                        }
                    }}>
                      Buy
                    </Button>
                  );
            }
        });
    } else {
         // Fallback for old string format if necessary (can remove later)
         const availabilityLower = String(content.availability).toLowerCase();
         if (availabilityLower.includes("subscription")) {
            actions.push(
              <Button key="watch" className="flex-1" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Try to find a platform from the availability string
                  const platforms = getUniquePlatforms(content.availability);
                  if (platforms.length > 0) {
                      window.open(getDeepLink(platforms[0], content.title), '_blank');
                  }
              }}>
                <PlayCircle />
                Watch Now
              </Button>
            );
          }
          if (availabilityLower.includes("rent")) {
            actions.push(
              <Button key="rent" variant="secondary" className="flex-1" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const platforms = getUniquePlatforms(content.availability);
                  if (platforms.length > 0) {
                      window.open(getDeepLink(platforms[0], content.title), '_blank');
                  }
              }}>
                Rent
              </Button>
            );
          }
          if (availabilityLower.includes("purchase") || availabilityLower.includes("buy")) {
             actions.push(
              <Button key="buy" variant="outline" className="flex-1" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const platforms = getUniquePlatforms(content.availability);
                  if (platforms.length > 0) {
                      window.open(getDeepLink(platforms[0], content.title), '_blank');
                  }
              }}>
                Buy
              </Button>
            );
          }
    }

    // Add More Info button if no specific actions are generated
    if(actions.length === 0) {
        actions.push(
             <Button key="info" variant="ghost" className="flex-1">
                More Info
             </Button>
        )
    }

    return actions;
  };

  // Deep link function
  const getDeepLink = (platform: string, title: string): string => {
    const encodedTitle = encodeURIComponent(title);
    const platformLower = platform.toLowerCase();
    
    switch (platformLower) {
      case 'netflix':
        return `https://www.netflix.com/search?q=${encodedTitle}`;
      case 'hulu':
        return `https://www.hulu.com/search?q=${encodedTitle}`;
      case 'amazon prime':
        return `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video`;
      case 'hbo max':
        return `https://play.max.com/search?q=${encodedTitle}`;
      case 'disney+':
        return `https://www.disneyplus.com/search?q=${encodedTitle}`;
      case 'paramount+':
        return `https://www.paramountplus.com/search?q=${encodedTitle}`;
      case 'peacock':
        return `https://www.peacocktv.com/search?q=${encodedTitle}`;
      case 'apple tv':
        return `https://tv.apple.com/search?q=${encodedTitle}`;
      case 'google play':
        return `https://play.google.com/store/search?q=${encodedTitle}&c=movies`;
      case 'vudu':
        return `https://www.vudu.com/search?q=${encodedTitle}`;
      default:
        // Fallback to a general search
        return `https://www.google.com/search?q=${encodedTitle}+streaming`;
    }
  };
  
  const handleCardClick = () => {
    setMovieForDetailPage(content);
  };

  // Ensure content.availability is treated as an array for displaying logos
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
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col">
          <CardDescription className="line-clamp-3 text-sm mb-4">
              {content.plot}
          </CardDescription>
          
           <div className="flex flex-wrap gap-2 mt-auto">
             {content.genre && <Badge variant="default">{content.genre}</Badge>}
              {/* Display OTT logos */}
              <div className="flex gap-1">
                  {displayedPlatforms.map((platform) => (
                      platformLogos[platform] && (
                          <Image
                              key={platform}
                              src={platformLogos[platform]}
                              alt={`${platform} logo`}
                              width={16}
                              height={16}
                              className="rounded-full"
                          />
                      )
                  ))}
                  {remainingPlatformsCount > 0 && (
                      <Badge className="rounded-full">+{remainingPlatformsCount}</Badge>
                  )}
              </div>
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
