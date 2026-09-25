const names = ['Neon Dash','Coin Catcher','Memory Grid','Quick Tap','Color Rush','Stack Master','Target Strike','Number Sprint','Tile Flip','Orbit Run','Word Blitz','Shape Match','Lucky Spin'];
const categories = ['Arcade','Arcade','Puzzle','Reaction','Arcade','Skill','Action','Puzzle','Memory','Arcade','Word','Puzzle','Chance'];
const themes = ['#7c3aed','#0ea5e9','#16a34a','#f97316','#db2777','#0891b2','#dc2626','#4f46e5','#059669','#9333ea','#ca8a04','#2563eb','#e11d48'];

export const games = names.map((name, index) => ({
  id: `game-${index + 1}`,
  name,
  category: categories[index],
  description: 'Play, score and earn Game Coins.',
  entryCost: 20,
  playable: index < 2,
  theme: themes[index]
}));
