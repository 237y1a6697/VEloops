import { ArrowLeft, Coins, Gamepad2, Gift, Play, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { games } from '../data/games';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { useState } from 'react';

export default function GameHome() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { wallet, refreshWallet } = useWallet();
  const game = games.find(item => item.id === gameId);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  if (!game) return <div className="game-page"><h2>Game not found</h2><Link to="/games">Back to Games</Link></div>;

  const start = async () => {
    if (!game.playable) return setMessage('This game is part of the upcoming lineup. Try one of the two playable games.');
    setBusy(true); setMessage('');
    try {
      const data = await api.startGame(game.id);
      await refreshWallet();
      navigate(`/games/${game.id}/play`, { state: { sessionId: data.sessionId } });
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };

  return <main className="game-page">
    <nav className="game-nav"><Link to="/games"><ArrowLeft size={18}/> Games</Link><div className="brand"><Gamepad2 size={20}/> VELOOP</div><Link to="/redeem"><Gift size={17}/> Redeem</Link></nav>
    <section className="game-home container">
      <div className="game-hero-art" style={{ '--game-color': game.theme }}><span>{game.category}</span><strong>{game.name}</strong><small>GAME {game.id.split('-')[1].padStart(2, '0')}</small></div>
      <div className="game-home-copy">
        <div className="eyebrow">READY TO PLAY</div>
        <h1>{game.name}</h1>
        <p>{game.description} Spend 20 Tokens to start a run and convert your performance into Game Coins.</p>
        <div className="entry-box"><span><Coins size={18}/> Entry fee</span><strong>20 Tokens</strong></div>
        <button className="big-play" onClick={start} disabled={busy}>{busy ? 'Starting...' : <><Play size={20} fill="currentColor"/> Play Now</>}</button>
        {message && <div className="alert-box">{message}</div>}
        <div className="trust-row"><ShieldCheck size={18}/> Reward transactions are recorded by the VELOOP API.</div>
      </div>
    </section>
  </main>;
}
