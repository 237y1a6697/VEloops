const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  health: () => request('/health'),
  getWallet: () => request('/wallet'),
  getGames: () => request('/games'),
  startGame: (gameId) => request(`/games/${gameId}/start`, { method: 'POST' }),
  completeGame: (sessionId, score) => request(`/game-sessions/${sessionId}/complete`, { method: 'POST', body: JSON.stringify({ score }) }),
  reviveGame: (sessionId) => request(`/game-sessions/${sessionId}/revive`, { method: 'POST' }),
  redeem: (type, cost) => request('/redemptions', { method: 'POST', body: JSON.stringify({ type, cost }) })
};
