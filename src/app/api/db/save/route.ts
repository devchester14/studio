// src/app/api/db/save/route.ts
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

export async function POST(request: Request) {
  try {
    const db = await request.json();
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Database saved successfully' });
  } catch (error) {
    console.error('Error saving database file:', error);
    return NextResponse.json({ message: 'Error saving database' }, { status: 500 });
  }
}
