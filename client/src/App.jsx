import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Games from './pages/Games';
import GameHome from './pages/GameHome';
import GamePlay from './pages/GamePlay';
import Redeem from './pages/Redeem';

export default function App() {
  return <WalletProvider><BrowserRouter><Routes>
    <Route path="/" element={<Navigate to="/games" replace />} />
    <Route path="/games" element={<Games />} />
    <Route path="/games/:gameId" element={<GameHome />} />
    <Route path="/games/:gameId/play" element={<GamePlay />} />
    <Route path="/redeem" element={<Redeem />} />
    <Route path="*" element={<Navigate to="/games" replace />} />
  </Routes></BrowserRouter></WalletProvider>;
}
