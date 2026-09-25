# VELOOP Games

Full-stack rewards gaming platform built with MERN.

## Stack

- React + Vite
- Bootstrap 5
- React Router
- Lucide React
- Framer Motion
- Node.js + Express
- MongoDB + Mongoose (with memory fallback for local demo)

## Features

- 13-game responsive Games Hub
- Auto-advancing game carousel with pagination dots
- Token-based game entry
- Two playable games with score, timer and revive flow
- Central Game Coin wallet
- Redemption for VEs, SVEs, Gems, Tokens and Spins
- Responsive light game environment and dark rewards hub

## Run locally

### Backend

```bash
cd server
npm install
npm run dev
```

API: `http://localhost:5000`

MongoDB is optional for the first run. Copy `server/.env.example` to `server/.env` and add a MongoDB Atlas connection string for database persistence.

### Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

## Routes

- `/games` — Games Hub
- `/games/game-1` — Game Home
- `/games/game-1/play` — Playable game
- `/games/game-2` — Second playable game
- `/redeem` — Reward redemption

## Artwork

The current repository uses CSS-generated artwork so the app works immediately without external image dependencies. Replace the generated game-art blocks with the supplied VELOOP artwork assets when those files are available.
