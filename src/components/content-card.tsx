import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Content } from "@/types";
import { PlayCircle, ShoppingCart, Tv } from "lucide-react";

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const getBadgeVariant = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "netflix":
        return "destructive";
      case "hulu":
        return "secondary";
      case "amazon prime":
        return "default";
      default:
        return "outline";
    }
  };

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

  return (
    <Card className="flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-primary/20 h-full">
      <div className="relative aspect-video bg-gradient-to-t from-black via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white text-center font-headline">
          {content.title}
        </h2>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mt-auto">
          <Badge variant={getBadgeVariant(content.platform)}>
            {content.platform}
          </Badge>
          <Badge variant="outline">{content.availability}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center gap-2">
          {renderActionButtons()}
        </div>
      </CardFooter>
    </Card>
  );
}
