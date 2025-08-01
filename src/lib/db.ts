
import type { Content } from '@/types';
import * as fs from 'fs';
import * as path from 'path';

// This is our in-memory "database" for the hackathon.
// In a real application, this would be a database like Firestore or a REST API.
// It stores data for two distinct users, user1 and user2.

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

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

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

// Load database from file on initialization
try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(data);
} catch (error) {
    console.error('Error loading database file, using default initial data:', error);
}

// Save database to file
function saveDatabase() {
    try {
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving database file:', error);
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
