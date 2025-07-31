// src/hooks/use-user.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from './use-local-storage';
import type { Content } from '@/types';

type User = 'user1' | 'user2';

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    likedMovies: Content[];
    setLikedMovies: (movies: Content[]) => void;
    query: string;
    setQuery: (query: string) => void;
    searchResults: Content[];
    setSearchResults: (results: Content[]) => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useLocalStorage<User | null>('currentUser', 'user1');
    const [isLoading, setIsLoading] = useState(true);

    const [likedMovies, setLikedMovies] = useLocalStorage<Content[]>(
        user ? `${user}_likedMovies` : 'likedMovies',
        []
    );
    const [query, setQuery] = useLocalStorage<string>(
        user ? `${user}_searchQuery` : 'searchQuery',
        ''
    );
     const [searchResults, setSearchResults] = useLocalStorage<Content[]>(
        user ? `${user}_searchResults` : 'searchResults',
        []
    );

    useEffect(() => {
        // This effect ensures that when the user switches,
        // we re-initialize the localStorage hooks with the new user-specific keys.
        // It's a bit of a re-render, but it correctly loads the new user's data.
        if (user) {
            setIsLoading(false);
        }
    }, [user]);
    
    const value = {
        user,
        setUser,
        likedMovies,
        setLikedMovies,
        query,
        setQuery,
        searchResults,
        setSearchResults,
        isLoading,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
