import { ArrowLeft, Coins, Heart, RotateCcw, Timer, Trophy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { games } from '../data/games';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';

function TapGame({ onScore, score, time, onFinish }) {
  const [target, setTarget] = useState({ x: 50, y: 50 });
  useEffect(() => { if (time <= 0) return; const t = setInterval(() => setTarget({ x: 12 + Math.random() * 76, y: 18 + Math.random() * 64 }), 700); return () => clearInterval(t); }, [time]);
  return <div className="play-area tap-area"><div className="game-instruction">Tap the target as many times as you can.</div><button className="target" style={{ left: `${target.x}%`, top: `${target.y}%` }} onClick={() => onScore(10)}>+10</button>{time <= 0 && <button className="finish-btn" onClick={onFinish}>Finish Run</button>}</div>;
}

function MemoryGame({ onScore, score, time, onFinish }) {
  const [pattern, setPattern] = useState(() => Array.from({ length: 9 }, () => Math.random() > 0.55));
  const [selected, setSelected] = useState([]);
  const [round, setRound] = useState(1);
  const [showPattern, setShowPattern] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShowPattern(false), 1200); return () => clearTimeout(t); }, [round]);
  const tap = (i) => { if (showPattern || selected.includes(i)) return; const next = [...selected, i]; setSelected(next); if (pattern[i] && next.length >= pattern.filter(Boolean).length) { onScore(25); setSelected([]); setPattern(Array.from({ length: 9 }, () => Math.random() > 0.55)); setRound(r => r + 1); setShowPattern(true); } };
  return <div className="play-area memory-area"><div className="game-instruction">Memorize the highlighted tiles. Round {round}.</div><div className="memory-grid">{pattern.map((active, i) => <button key={i} className={(showPattern && active) || selected.includes(i) ? 'memory-tile active' : 'memory-tile'} onClick={() => tap(i)} />)}</div>{time <= 0 && <button className="finish-btn" onClick={onFinish}>Finish Run</button>}</div>;
}

export default function GamePlay() {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshWallet } = useWallet();
  const game = games.find(g => g.id === gameId);
  const sessionId = location.state?.sessionId;
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [ended, setEnded] = useState(false);
  const [revived, setRevived] = useState(false);
  const [result, setResult] = useState(null);
  const timer = useRef(null);

  useEffect(() => { timer.current = setInterval(() => setTime(t => t <= 1 ? 0 : t - 1), 1000); return () => clearInterval(timer.current); }, []);
  useEffect(() => { if (time === 0 && !ended) setEnded(true); }, [time, ended]);

  if (!game || !sessionId) return <main className="game-page center-page"><div><h2>Session unavailable</h2><button className="play-button" onClick={() => navigate(`/games/${gameId}`)}>Return to Game</button></div></main>;

  const finish = async () => { clearInterval(timer.current); try { const data = await api.completeGame(sessionId, score); setResult(data); setEnded(true); await refreshWallet(); } catch (error) { setResult({ error: error.message }); } };
  const revive = async () => { try { await api.reviveGame(sessionId); setRevived(true); setEnded(false); setTime(15); setResult(null); } catch (error) { setResult({ error: error.message }); } };
  const reward = result?.earnedCoins ?? Math.max(5, Math.floor(score / 20));

  return <main className="game-page gameplay-page">
    <header className="hud"><button onClick={() => navigate(`/games/${gameId}`)}><ArrowLeft size={18}/></button><div><Trophy size={17}/> {score}</div><div><Timer size={17}/> {time}s</div><div><Coins size={17}/> Reward run</div></header>
    {!ended ? (game.id === 'game-1' ? <TapGame onScore={set => setScore(s => s + set)} score={score} time={time} onFinish={finish}/> : <MemoryGame onScore={set => setScore(s => s + set)} score={score} time={time} onFinish={finish}/>) : <div className="game-over"><div className="game-over-card"><div className="eyebrow">RUN COMPLETE</div><h1>Game Over</h1><div className="final-score">{score}</div>{result?.error ? <div className="alert-box">{result.error}</div> : <p><Coins size={18}/> {reward} Game Coins earned</p>}{!revived && !result?.error && <button className="big-play" onClick={revive}><RotateCcw size={19}/> Revive</button>}<button className="secondary-button" onClick={() => navigate(`/games/${gameId}`)}><X size={17}/> No Thanks</button></div></div>}
  </main>;
}
