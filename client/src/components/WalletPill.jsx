import { Coins, Gem } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export default function WalletPill() {
  const { wallet } = useWallet();
  return <div className="wallet-pill">
    <span><Gem size={16} /> {wallet.tokens} Tokens</span>
    <span><Coins size={16} /> {wallet.gameCoins} Coins</span>
  </div>;
}
