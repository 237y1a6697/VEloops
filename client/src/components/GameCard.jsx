import { ArrowRight, Coins, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  return <motion.article className="game-card" whileHover={{ y: -6 }}>
    <div className="game-art" style={{ '--game-color': game.theme }}>
      <span className="game-category">{game.category}</span>
      <div className="art-orb orb-one" />
      <div className="art-orb orb-two" />
      <div className="art-title">{game.name}</div>
      <div className="art-number">{game.id.replace('game-', '').padStart(2, '0')}</div>
    </div>
    <div className="game-card-body">
      <div className="game-meta"><span><Coins size={16} /> {game.entryCost} Tokens</span>{!game.playable && <span className="locked"><Lock size={14}/> Soon</span>}</div>
      <p>{game.description}</p>
      <button className="play-button" onClick={() => navigate(`/games/${game.id}`)}>
        {game.playable ? 'Play Now' : 'View Game'} <ArrowRight size={18}/>
      </button>
    </div>
  </motion.article>;
}
