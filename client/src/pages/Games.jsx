import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Gamepad2, Gift, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import WalletPill from '../components/WalletPill';
import { games as localGames } from '../data/games';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function Games() {
  const [games, setGames] = useState(localGames);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.getGames().then(data => setGames(data.games)).catch(() => setGames(localGames));
  }, []);

  const visible = useMemo(() => {
    const result = [];
    for (let i = 0; i < 3; i++) result.push(games[(index + i) % games.length]);
    return result;
  }, [games, index]);

  useEffect(() => {
    const timer = setInterval(() => setIndex(current => (current + 1) % games.length), 5000);
    return () => clearInterval(timer);
  }, [games.length]);

  return <main className="app-shell">
    <nav className="topbar container-fluid px-3 px-md-5">
      <Link to="/games" className="brand"><Gamepad2 size={24}/> VELOOP</Link>
      <div className="nav-links"><a href="#games">Games</a><Link to="/redeem"><Gift size={17}/> Redeem</Link></div>
      <WalletPill />
    </nav>

    <section className="hero container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="eyebrow"><Sparkles size={15}/> REWARDS ARCADE</div>
        <h1>Play games.<br/><span>Earn more.</span></h1>
        <p>Jump into quick games, build your Game Coin balance and redeem your rewards.</p>
        <a href="#games" className="hero-cta">Explore Games <ChevronDown size={18}/></a>
      </motion.div>
      <div className="hero-stats">
        <div><strong>13</strong><span>Games</span></div>
        <div><strong>20</strong><span>Token entry</span></div>
        <div><strong>∞</strong><span>Rewards</span></div>
      </div>
    </section>

    <section id="games" className="container games-section">
      <div className="section-heading"><div><div className="eyebrow">GAME HUB</div><h2>Choose your challenge</h2></div><span className="slide-count">{index + 1} / {games.length}</span></div>
      <div className="games-grid">{visible.map(game => <GameCard key={game.id} game={game}/>)}</div>
      <div className="dots">{games.map((game, i) => <button key={game.id} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Show game ${i + 1}`} />)}</div>
    </section>

    <footer className="footer container">VELOOP Games · Built as a MERN rewards gaming experience</footer>
  </main>;
}
