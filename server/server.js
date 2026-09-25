import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import crypto from 'crypto';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const gameNames = ['Neon Dash','Coin Catcher','Memory Grid','Quick Tap','Color Rush','Stack Master','Target Strike','Number Sprint','Tile Flip','Orbit Run','Word Blitz','Shape Match','Lucky Spin'];
const gameCategories = ['Arcade','Arcade','Puzzle','Reaction','Arcade','Skill','Action','Puzzle','Memory','Arcade','Word','Puzzle','Chance'];
const games = gameNames.map((name, i) => ({ id: `game-${i + 1}`, name, category: gameCategories[i], description: 'Play, score and earn Game Coins.', entryCost: 20, playable: i < 2 }));

const memory = {
  wallet: { tokens: 150, gameCoins: 0 },
  sessions: new Map(),
  redemptions: []
};

let mongoReady = false;
const WalletSchema = new mongoose.Schema({ key: { type: String, unique: true }, tokens: Number, gameCoins: Number }, { timestamps: true });
const SessionSchema = new mongoose.Schema({ sessionId: String, gameId: String, score: Number, status: String, revived: Boolean }, { timestamps: true });
const RedemptionSchema = new mongoose.Schema({ type: String, cost: Number, amount: Number, createdAt: { type: Date, default: Date.now } });
const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
const Redemption = mongoose.models.Redemption || mongoose.model('Redemption', RedemptionSchema);

async function getWallet() {
  if (!mongoReady) return memory.wallet;
  let wallet = await Wallet.findOne({ key: 'demo-wallet' });
  if (!wallet) wallet = await Wallet.create({ key: 'demo-wallet', tokens: 150, gameCoins: 0 });
  return { tokens: wallet.tokens, gameCoins: wallet.gameCoins };
}

async function saveWallet(wallet) {
  memory.wallet = wallet;
  if (mongoReady) await Wallet.findOneAndUpdate({ key: 'demo-wallet' }, wallet, { upsert: true, new: true });
}

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'VELOOP API is running', database: mongoReady ? 'MongoDB connected' : 'Memory fallback' }));
app.get('/api/games', (_req, res) => res.json({ success: true, games }));
app.get('/api/wallet', async (_req, res) => res.json({ success: true, wallet: await getWallet() }));

app.post('/api/games/:gameId/start', async (req, res) => {
  const game = games.find(g => g.id === req.params.gameId);
  if (!game) return res.status(404).json({ message: 'Game not found' });
  if (!game.playable) return res.status(400).json({ message: 'This game is not playable yet' });
  const wallet = await getWallet();
  if (wallet.tokens < game.entryCost) return res.status(400).json({ message: `Not enough Tokens. You need ${game.entryCost} Tokens.` });
  wallet.tokens -= game.entryCost;
  await saveWallet(wallet);
  const sessionId = crypto.randomUUID();
  const session = { sessionId, gameId: game.id, score: 0, status: 'active', revived: false };
  memory.sessions.set(sessionId, session);
  if (mongoReady) await Session.create(session);
  res.json({ success: true, sessionId, wallet });
});

app.post('/api/game-sessions/:sessionId/revive', async (req, res) => {
  const session = memory.sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ message: 'Game session not found' });
  session.revived = true;
  session.status = 'active';
  if (mongoReady) await Session.findOneAndUpdate({ sessionId: session.sessionId }, session);
  res.json({ success: true, message: 'Revive granted. Continue the run.' });
});

app.post('/api/game-sessions/:sessionId/complete', async (req, res) => {
  const session = memory.sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ message: 'Game session not found' });
  const score = Math.max(0, Number(req.body.score) || 0);
  const earnedCoins = Math.max(5, Math.min(100, Math.floor(score / 20) + (session.revived ? 5 : 0)));
  session.score = score;
  session.status = 'completed';
  const wallet = await getWallet();
  wallet.gameCoins += earnedCoins;
  await saveWallet(wallet);
  if (mongoReady) await Session.findOneAndUpdate({ sessionId: session.sessionId }, session);
  res.json({ success: true, earnedCoins, wallet, score });
});

const rewardMap = { VEs: 10, SVEs: 10, Gems: 5, Tokens: 20, Spins: 1 };
app.post('/api/redemptions', async (req, res) => {
  const { type, cost } = req.body;
  const amount = rewardMap[type];
  if (!amount || !Number.isFinite(Number(cost))) return res.status(400).json({ message: 'Invalid reward request' });
  const wallet = await getWallet();
  const numericCost = Number(cost);
  if (wallet.gameCoins < numericCost) return res.status(400).json({ message: `Not enough Game Coins. You need ${numericCost}.` });
  wallet.gameCoins -= numericCost;
  if (type === 'Tokens') wallet.tokens += amount;
  await saveWallet(wallet);
  memory.redemptions.push({ type, cost: numericCost, amount });
  if (mongoReady) await Redemption.create({ type, cost: numericCost, amount });
  res.json({ success: true, message: `Redeemed ${numericCost} Game Coins for ${amount} ${type}.`, wallet });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI); mongoReady = true; console.log('MongoDB connected'); }
    catch (error) { console.warn('MongoDB unavailable; using memory fallback:', error.message); }
  }
  app.listen(PORT, () => console.log(`VELOOP API running on http://localhost:${PORT}`));
}
start();
