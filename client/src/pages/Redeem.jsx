import { ArrowLeft, CheckCircle2, Coins, Gift, Gem, RefreshCw, Ticket, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';

const rewards = [
  { type: 'VEs', amount: 10, cost: 100, icon: Gem },
  { type: 'SVEs', amount: 10, cost: 100, icon: Zap },
  { type: 'Gems', amount: 5, cost: 50, icon: Gem },
  { type: 'Tokens', amount: 20, cost: 50, icon: Coins },
  { type: 'Spins', amount: 1, cost: 25, icon: RefreshCw }
];

export default function Redeem() {
  const { wallet, refreshWallet } = useWallet();
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const confirm = async () => { if (!selected) return; try { const data = await api.redeem(selected.type, selected.cost); setStatus(data.message); setSelected(null); await refreshWallet(); } catch (error) { setStatus(error.message); } };
  return <main className="redeem-page">
    <nav className="game-nav container"><Link to="/games"><ArrowLeft size={18}/> Games</Link><div className="brand"><Gift size={20}/> REDEEM</div><span className="coin-balance"><Coins size={17}/> {wallet.gameCoins}</span></nav>
    <section className="container redeem-content"><div className="eyebrow">REWARD STORE</div><h1>Turn Game Coins into rewards.</h1><p className="redeem-lead">Your balance is shared across both games and updated after every completed run.</p><div className="balance-card"><Coins size={28}/><div><span>Available Game Coins</span><strong>{wallet.gameCoins}</strong></div></div><div className="reward-grid">{rewards.map(item => { const Icon = item.icon; return <article className="reward-card" key={item.type}><div className="reward-icon"><Icon size={23}/></div><div><h3>{item.type}</h3><p>{item.cost} Game Coins → {item.amount} {item.type}</p></div><button disabled={wallet.gameCoins < item.cost} onClick={() => setSelected(item)}>Redeem</button></article>; })}</div>{status && <div className="success-box"><CheckCircle2 size={19}/>{status}</div>}</section>
    {selected && <div className="modal-backdrop"><div className="confirm-modal"><Gift size={28}/><h2>Confirm redemption</h2><p>Spend <strong>{selected.cost} Game Coins</strong> for <strong>{selected.amount} {selected.type}</strong>?</p><div><button className="secondary-button" onClick={() => setSelected(null)}>Cancel</button><button className="big-play" onClick={confirm}>Confirm</button></div></div></div>}
  </main>;
}
