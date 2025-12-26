// Card suits
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

// Card ranks (1 = Ace, 11 = Jack, 12 = Queen, 13 = King)
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
    id: string;
    suit: Suit;
    rank: Rank;
    faceUp: boolean;
}

// Pile locations in the game
export type PileType = 'stock' | 'waste' | 'foundation' | 'tableau';

export interface Pile {
    type: PileType;
    index: number; // 0-3 for foundations, 0-6 for tableau, 0 for stock/waste
    cards: Card[];
}

// Game state
export interface GameState {
    stock: Card[];
    waste: Card[];
    foundations: [Card[], Card[], Card[], Card[]]; // 4 foundation piles (one per suit)
    tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]]; // 7 tableau piles
    drawMode: 1 | 3; // Draw 1 or Draw 3
    moves: number;
    score: number; // Points earned
    startTime: number | null;
    isComplete: boolean;
    canAutoComplete: boolean;
    isAutoCompleting: boolean; // True during auto-complete animation
    isDealing: boolean; // True during the initial card layout animation
    comboMultiplier: number; // Multiplier for rapid moves
    lastMoveTime: number | null; // Timestamp of the last scoring move
}

// Move for undo/redo
export interface Move {
    from: { type: PileType; index: number };
    to: { type: PileType; index: number };
    cards: Card[];
    wasFlipped?: boolean; // Whether a card was flipped face-up after this move
}

// Statistics stored in localStorage
export interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    bestTime: number; // in seconds, 0 means no best time yet
    bestScore: number; // highest score achieved
    currentStreak: number;
    bestStreak: number;
    totalMoves: number;
}

// Settings
export interface GameSettings {
    drawMode: 1 | 3;
    soundEnabled: boolean;
    hapticEnabled: boolean;
    autoComplete: boolean;
    cardSize: 'normal' | 'large' | 'xlarge';
    tableTheme: 'midnight' | 'emerald' | 'amethyst';
}

// Drag state
export interface DragState {
    isDragging: boolean;
    cards: Card[];
    fromPile: { type: PileType; index: number } | null;
    position: { x: number; y: number };
    offset: { x: number; y: number };
}
