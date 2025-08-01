// src/app/api/db/route.ts
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

export async function GET() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(data);
    return NextResponse.json(db);
  } catch (error) {
    console.error('Error loading database file:', error);
    // Return an empty database structure if the file doesn't exist or there's an error
    return NextResponse.json({
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
    });
  }
}
