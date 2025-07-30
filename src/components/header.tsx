import Link from "next/link";
import { AppLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-white/10 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-4">
        <AppLogo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">
          StreamWeaver
        </h1>
      </Link>
      <nav>
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <LayoutGrid />
            Dashboard
          </Link>
        </Button>
      </nav>
    </header>
  );
}
