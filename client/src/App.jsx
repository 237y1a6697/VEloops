import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function GamesPlaceholder() {
  return (
    <main className="app-shell">
      <section className="container py-5">
        <p className="eyebrow">VELOOP</p>
        <h1>Games</h1>
        <p className="text-secondary">The Games Hub is the next build step.</p>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/games" replace />} />
        <Route path="/games" element={<GamesPlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
