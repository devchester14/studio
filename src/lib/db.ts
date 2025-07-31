// src/lib/db.ts

import type { Content } from '@/types';

// This is our in-memory "database" for the hackathon.
// In a real application, this would be a database like Firestore or a REST API.
// It stores data for two distinct users, user1 and user2.

interface UserData {
    likedMovies: Content[];
    searchQuery: string;
    searchResults: Content[];
}

interface Database {
    user1: UserData;
    user2: UserData;
}

export const db: Database = {
    user1: {
        likedMovies: [],
        searchQuery: '',
        searchResults: [],
    },
    user2: {
        likedMovies: [],
        searchQuery: '',
        searchResults: [],
    },
};

export type User = keyof typeof db;

// --- API-like functions to interact with the database ---

export function getUserData(userId: User): UserData {
    return db[userId];
}

export function addLikedMovie(userId: User, movie: Content) {
    const user = db[userId];
    if (!user.likedMovies.some(m => m.id === movie.id)) {
        user.likedMovies.push(movie);
    }
}

export function removeLikedMovie(userId: User, movieId: string) {
    const user = db[userId];
    user.likedMovies = user.likedMovies.filter(m => m.id !== movieId);
}

export function getLikedMovies(userId: User): Content[] {
    return db[userId].likedMovies;
}

export function setSearchQuery(userId: User, query: string) {
    db[userId].searchQuery = query;
}

export function getSearchQuery(userId: User): string {
    return db[userId].searchQuery;
}

export function setSearchResults(userId: User, results: Content[]) {
    db[userId].searchResults = results;
}

export function getSearchResults(userId: User): Content[] {
    return db[userId].searchResults;
}
