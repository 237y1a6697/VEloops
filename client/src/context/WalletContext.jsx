import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState({ tokens: 150, gameCoins: 0 });
  const [loading, setLoading] = useState(true);

  const refreshWallet = async () => {
    try {
      const data = await api.getWallet();
      setWallet(data.wallet);
    } catch (error) {
      console.warn(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshWallet(); }, []);

  return <WalletContext.Provider value={{ wallet, setWallet, refreshWallet, loading }}>
    {children}
  </WalletContext.Provider>;
}

export function useWallet() {
  return useContext(WalletContext);
}
