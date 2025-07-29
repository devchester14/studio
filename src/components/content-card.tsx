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
import { PlayCircle, ShoppingCart, Tv } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const [, setMovie] = useLocalStorage<Content | null>(`movie-${content.id}`, null);

  const renderActionButtons = () => {
    const availabilityLower = content.availability.toLowerCase();
    const actions = [];

    if (availabilityLower === "subscription") {
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
          <ShoppingCart />
          Rent
        </Button>
      );
    }
    if (availabilityLower.includes("purchase") || availabilityLower.includes("buy")) {
       actions.push(
        <Button key="buy" variant="outline" className="flex-1">
          <Tv />
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
    setMovie(content);
  };

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
            <Badge variant="secondary">{content.platform}</Badge>
            <Badge variant="outline">{content.availability}</Badge>
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
