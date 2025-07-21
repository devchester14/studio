import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
      default:
        return "default";
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-primary/20">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={content.imageUrl}
            alt={content.title}
            fill
            className="object-cover"
            data-ai-hint={content.aiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-lg font-headline mb-2">
          {content.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant={getBadgeVariant(content.platform)}>
            {content.platform}
          </Badge>
          <Badge variant="outline">{content.availability}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center gap-2">
          {content.availability.toLowerCase() === "subscription" && (
            <Button className="w-full">
              <PlayCircle />
              Watch Now
            </Button>
          )}
          {content.availability.toLowerCase().includes("rent") && (
            <Button variant="secondary" className="w-full">
              <ShoppingCart />
              Rent
            </Button>
          )}
          {content.availability.toLowerCase().includes("purchase") && (
            <Button variant="outline" className="w-full">
              <Tv />
              Buy
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
