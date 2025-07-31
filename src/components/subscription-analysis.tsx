// src/components/subscription-analysis.tsx
"use client";

import { useEffect, useState, memo } from 'react';
import { getSubscriptionAnalysis } from '@/app/actions';
import type { Content } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wallet, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useUser } from '@/hooks/use-user';

interface AnalysisResult {
    insight: string;
    primaryPlatform: string;
    suggestion: string;
}

const MemoizedBarChart = memo(({ data }: { data: {name: string, count: number}[] }) => (
    <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
            <Tooltip cursor={{fill: 'hsl(var(--secondary))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
    </ResponsiveContainer>
));
MemoizedBarChart.displayName = 'MemoizedBarChart';


export function SubscriptionAnalysis() {
    const { likedMovies } = useUser();
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [platformData, setPlatformData] = useState<{name: string, count: number}[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    
    useEffect(() => {
        if(likedMovies === undefined) return; // Wait for user data to load

        const analyze = async () => {
            if (likedMovies.length === 0) {
                setIsLoading(false);
                setPlatformData([]);
                setAnalysis(null);
                return;
            }

            setIsLoading(true);

            const platformCounts = likedMovies.reduce((acc, movie) => {
                acc[movie.platform] = (acc[movie.platform] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const chartData = Object.entries(platformCounts).map(([name, count]) => ({
                name,
                count
            })).sort((a,b) => b.count - a.count);
            setPlatformData(chartData);

            const result = await getSubscriptionAnalysis({ platformCounts: JSON.stringify(platformCounts) });

            if (result.success && result.data) {
                setAnalysis(result.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "Analysis Error",
                    description: result.error || "Could not analyze your subscriptions."
                });
            }
            setIsLoading(false);
        };

        analyze();
    }, [likedMovies, toast]);
    
    if (likedMovies.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold font-headline">Subscription Saver</CardTitle>
                    <Wallet className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Like some movies to get personalized advice on your streaming subscriptions!</p>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold font-headline">Subscription Saver</CardTitle>
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Analyzing your viewing habits...</p>
                </CardContent>
            </Card>
        )
    }


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold font-headline">Subscription Saver</CardTitle>
                    <Wallet className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground pt-2">Your viewing habits, visualized.</p>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                     <h3 className="text-lg font-semibold mb-2">Liked Content by Platform</h3>
                     <MemoizedBarChart data={platformData} />
                </div>
                <div className="bg-secondary/50 p-6 rounded-lg flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <Lightbulb className="h-8 w-8 text-primary" />
                        <h3 className="text-xl font-semibold">AI-Powered Insight</h3>
                    </div>
                    {analysis && (
                        <div className="space-y-2">
                            <p className="font-semibold text-lg">{analysis.insight}</p>
                            <p className="text-muted-foreground">{analysis.suggestion}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
