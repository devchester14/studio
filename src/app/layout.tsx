import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import { UserProvider } from "@/hooks/use-user";

export const metadata: Metadata = {
  title: "StreamWeaver",
  description: "Unified search and personalized recommendations across streaming platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <UserProvider>
            {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
