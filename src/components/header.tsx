// src/components/header.tsx
"use client";

import Link from "next/link";
import { AppLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LayoutGrid, User, Users } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, setUser } = useUser();

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-white/10 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-4">
        <AppLogo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">
          StreamWeaver
        </h1>
      </Link>
      <nav className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <LayoutGrid />
            Dashboard
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User />
              <span className="sr-only">Switch User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUser("user1")} disabled={user === 'user1'}>
              User 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUser("user2")} disabled={user === 'user2'}>
              User 2
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
