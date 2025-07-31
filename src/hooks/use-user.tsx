// src/hooks/use-user.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Content } from '@/types';
import * as db from '@/lib/db';
import { useLocalStorage } from './use-local-storage';

type User = db.User;

interface UserContextType {
    user: User;
    setUser: (user: User) => void;
    likedMovies: Content[];
    toggleLikeMovie: (movie: Content) => void;
    isMovieLiked: (movieId: string) => boolean;
    query: string;
    setQuery: (query: string) => void;
    searchResults: Content[];
    setSearchResults: (results: Content[]) => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    // We still use localStorage for the *current user* so it persists across reloads.
    const [user, setUser] = useLocalStorage<User>('currentUser', 'user1');
    const [isLoading, setIsLoading] = useState(true);

    // All other data now comes from our simulated DB
    const [likedMovies, setLikedMoviesState] = useState<Content[]>([]);
    const [query, setQueryState] = useState<string>('');
    const [searchResults, setSearchResultsState] = useState<Content[]>([]);
    
    // Load data from DB when user changes
    useEffect(() => {
        setIsLoading(true);
        const userData = db.getUserData(user);
        setLikedMoviesState(userData.likedMovies);
        setQueryState(userData.searchQuery);
        setSearchResultsState(userData.searchResults);
        setIsLoading(false);
    }, [user]);

    const setQuery = useCallback((newQuery: string) => {
        setQueryState(newQuery);
        db.setSearchQuery(user, newQuery);
    },[user]);

    const setSearchResults = useCallback((results: Content[]) => {
        setSearchResultsState(results);
        db.setSearchResults(user, results);
    }, [user]);

    const isMovieLiked = useCallback((movieId: string) => {
       return likedMovies.some(m => m.id === movieId);
    }, [likedMovies]);

    const toggleLikeMovie = useCallback((movie: Content) => {
        if (isMovieLiked(movie.id)) {
            db.removeLikedMovie(user, movie.id);
        } else {
            db.addLikedMovie(user, movie);
        }
        // refresh state from DB
        setLikedMoviesState([...db.getLikedMovies(user)]);
    }, [user, isMovieLiked]);
    
    const value = {
        user,
        setUser,
        likedMovies,
        toggleLikeMovie,
        isMovieLiked,
        query,
        setQuery,
        searchResults,
        setSearchResults,
        isLoading,
    };

    return (
        <UserContext.Provider value={value}>
            {!isLoading ? children : null /* Or a loading spinner */}
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
