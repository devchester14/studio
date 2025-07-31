// src/app/admin/page.tsx
"use client";

import { db } from "@/lib/db";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import type { Content } from "@/types";

export default function AdminAnalyticsPage() {

  const platformPopularityData = useMemo(() => {
    const platformCounts: Record<string, number> = {};
    
    // Aggregate data across all users
    (Object.keys(db) as Array<keyof typeof db>).forEach(userId => {
        const userData = db[userId];
        userData.likedMovies.forEach((movie: Content) => {
            platformCounts[movie.platform] = (platformCounts[movie.platform] || 0) + 1;
        });
    });

    return Object.entries(platformCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight font-headline">
            Admin Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
            Business insights from aggregated user data.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Platform Popularity Heatmap</CardTitle>
                <CardDescription>
                    This chart shows the total number of "liked" items per streaming platform across all users.
                    A higher bar indicates a more valuable potential partnership.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={platformPopularityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="hsl(var(--primary))" name="Total Liked Items" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </main>
    </>
  );
}