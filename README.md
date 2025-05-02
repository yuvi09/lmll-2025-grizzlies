# Little League Baseball Statistics

A Next.js web application for tracking and analyzing little league baseball statistics, including player positions, batting orders, and runs.

## Features

- Visual representation of player positions on a baseball diamond
- Detailed statistics for each player including:
  - Position history and percentage of time played at each position
  - Batting order history
  - Total runs and average runs per game
- Game-by-game analysis
- Responsive design for desktop and mobile viewing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your game data JSON files to the `data/games` directory
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Game Data Format

Each game should be stored as a JSON file in the `data/games` directory with the following structure:

```json
{
  "id": "unique-game-id",
  "date": "YYYY-MM-DD",
  "opponent": "Opponent Team Name",
  "totalInnings": number,
  "positions": [
    {
      "playerId": "player-id",
      "inning": inning-number,
      "position": "position-code"
    }
  ],
  "battingOrder": [
    {
      "playerId": "player-id",
      "order": batting-order-number
    }
  ],
  "runs": [
    {
      "playerId": "player-id",
      "count": number-of-runs
    }
  ]
}
```

Position codes:
- P: Pitcher
- C: Catcher
- 1B: First Base
- 2B: Second Base
- SS: Short Stop
- 3B: Third Base
- LF: Left Field
- LC: Left Center
- RC: Right Center
- RF: Right Field

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Deploy!

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.
