import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read all JSON files from the games directory
    const gamesDir = path.join(process.cwd(), 'data', 'games');
    if (!fs.existsSync(gamesDir)) {
      return NextResponse.json([], { status: 200 });
    }
    const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('.json'));
    const games = files.map(file => {
      const filePath = path.join(gamesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }).filter(game => game && game.field_positions && Array.isArray(game.field_positions));
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error reading game data:', error);
    return NextResponse.json(
      { error: 'Failed to load game data' },
      { status: 500 }
    );
  }
} 