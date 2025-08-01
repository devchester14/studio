
import type { Content } from '@/types';

// This is our in-memory "database" facade for the hackathon.
// It interacts with API routes to persist data on the server.

interface UserProfile {
  age?: number;
  location?: { latitude: number; longitude: number };
}

interface UserData extends UserProfile {
    likedMovies: Content[];
    searchQuery: string;
    searchResults: Content[];
}

interface Database {
    user1: UserData;
    user2: UserData;
}

let db: Database = {
    user1: {
        likedMovies: [],
        searchQuery: '',
        searchResults: [],
        age: undefined,
        location: undefined,
    },
    user2: {
        likedMovies: [],
        searchQuery: '',
        searchResults: [],
        age: undefined,
        location: undefined,
    },
};

// Function to load database from API route
export async function loadDatabase() {
    try {
        const response = await fetch('/api/db');
        if (response.ok) {
            db = await response.json();
        } else {
            console.error('Error loading database from API:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching database from API:', error);
    }
}

// Function to save database to API route
async function saveDatabase() {
    try {
        await fetch('/api/db/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(db),
        });
    } catch (error) {
        console.error('Error saving database to API:', error);
    }
}

export type User = keyof typeof db;

// --- API-like functions to interact with the database ---

export function getUserData(userId: User): UserData {
    return db[userId];
}

export function addLikedMovie(userId: User, movie: Content) {
    const user = db[userId];
    if (!user.likedMovies.some(m => m.id === movie.id)) {
        user.likedMovies.push(movie);
        saveDatabase();
    }
}

export function removeLikedMovie(userId: User, movieId: string) {
    const user = db[userId];
    user.likedMovies = user.likedMovies.filter(m => m.id !== movieId);
    saveDatabase();
}

export function getLikedMovies(userId: User): Content[] {
    return db[userId].likedMovies;
}

export function setSearchQuery(userId: User, query: string) {
    db[userId].searchQuery = query;
    saveDatabase();
}

export function getSearchQuery(userId: User): string {
    return db[userId].searchQuery;
}

export function setSearchResults(userId: User, results: Content[]) {
    db[userId].searchResults = results;
    saveDatabase();
}

export function getSearchResults(userId: User): Content[] {
    return db[userId].searchResults;
}

export function setUserAge(userId: User, age: number | undefined) {
    db[userId].age = age;
    saveDatabase();
}

export function getUserAge(userId: User): number | undefined {
    return db[userId].age;
}

export function setUserLocation(userId: User, location: { latitude: number; longitude: number } | undefined) {
    db[userId].location = location;
    saveDatabase();
}

export function getUserLocation(userId: User): { latitude: number; longitude: number } | undefined {
    return db[userId].location;
}
