export const GAME_MODES = [
  { id: 1, name: 'Single player' },
  { id: 2, name: 'Multiplayer' },
  { id: 3, name: 'Co-operative' },
  { id: 4, name: 'Split screen' },
  { id: 5, name: 'MMO' },
  { id: 6, name: 'Battle Royale' }
];

export const PLAYER_PERSPECTIVES = [
  { id: 1, name: 'First-person' },
  { id: 2, name: 'Third-person' },
  { id: 3, name: 'Bird view / Isometric' },
  { id: 4, name: 'Side view' },
  { id: 5, name: 'Text-based' },
  { id: 6, name: 'Auditory' },
  { id: 7, name: 'Virtual Reality' }
];

const START_YEAR = 1970;
const CURRENT_YEAR = new Date().getFullYear();
const FUTURE_BUFFER = 2;

export const YEAR_OPTIONS = Array.from(
  { length: (CURRENT_YEAR + FUTURE_BUFFER) - START_YEAR + 1 },
  (_, i) => (CURRENT_YEAR + FUTURE_BUFFER - i).toString()
);

export const SORT_OPTIONS = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'popularity_desc', name: 'Most Popular' },
  { id: 'rating_desc', name: 'Top Rated' },
  { id: 'release_desc', name: 'Newest Releases' },
  { id: 'release_asc', name: 'Oldest Releases' },
  { id: 'anticipated_desc', name: 'Most Anticipated' },
  { id: 'upcoming_asc', name: 'Upcoming' },
  { id: 'name_asc', name: 'Alphabetical (A–Z)' },

];

export const PLATFORMS = [
  { id: 34, name: 'Android', priority: 1 },
  { id: 39, name: 'iOS', priority: 1 },
  { id: 130, name: 'Nintendo Switch', priority: 1 },
  { id: 6, name: 'PC (Microsoft Windows)', priority: 1 },
  { id: 48, name: 'PlayStation 4', priority: 1 },
  { id: 167, name: 'PlayStation 5', priority: 1 },
  { id: 49, name: 'Xbox One', priority: 1 },
  { id: 169, name: 'Xbox Series X|S', priority: 1 },
];

export const GENRES = [
  { id: 2, name: 'Point-and-click' },
  { id: 4, name: 'Fighting' },
  { id: 5, name: 'Shooter' },
  { id: 7, name: 'Music' },
  { id: 8, name: 'Platform' },
  { id: 9, name: 'Puzzle' },
  { id: 10, name: 'Racing' },
  { id: 11, name: 'Real Time Strategy (RTS)' },
  { id: 12, name: 'Role-playing (RPG)' },
  { id: 13, name: 'Simulator' },
  { id: 14, name: 'Sport' },
  { id: 15, name: 'Strategy' },
  { id: 16, name: 'Turn-based strategy (TBS)' },
  { id: 24, name: 'Tactical' },
  { id: 25, name: "Hack and slash/Beat 'em up" },
  { id: 26, name: 'Quiz/Trivia' },
  { id: 30, name: 'Pinball' },
  { id: 31, name: 'Adventure' },
  { id: 32, name: 'Indie' },
  { id: 33, name: 'Arcade' },
  { id: 34, name: 'Visual Novel' },
  { id: 35, name: 'Card & Board Game' },
  { id: 36, name: 'MOBA' },
];

export const THEMES = [
  { id: 31, name: 'Drama' },
  { id: 32, name: 'Non-fiction' },
  { id: 33, name: 'Sandbox' },
  { id: 34, name: 'Educational' },
  { id: 35, name: 'Kids' },
  { id: 38, name: 'Open world' },
  { id: 39, name: 'Warfare' },
  { id: 40, name: 'Party' },
  { id: 41, name: '4X (explore, expand, exploit, and exterminate)' },
  { id: 42, name: 'Erotic' },
  { id: 43, name: 'Mystery' },
  { id: 1, name: 'Action' },
  { id: 17, name: 'Fantasy' },
  { id: 18, name: 'Science fiction' },
  { id: 19, name: 'Horror' },
  { id: 20, name: 'Thriller' },
  { id: 21, name: 'Survival' },
  { id: 22, name: 'Historical' },
  { id: 23, name: 'Stealth' },
  { id: 27, name: 'Comedy' },
  { id: 28, name: 'Business' },
  { id: 44, name: 'Romance' },
];
  
  export const ALLOWED_SORTS = new Set([
    'rating_desc',
    'release_desc',
    'release_asc',
    'name_asc',
    'popularity_desc',
    'anticipated_desc',
    'upcoming_asc'
  ]);

