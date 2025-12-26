import type { Card, Suit, Rank } from '../types/game';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

/**
 * Creates a full deck of 52 cards
 */
export function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({
                id: `${suit}-${rank}`,
                suit,
                rank,
                faceUp: false,
            });
        }
    }
    return deck;
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Returns the color of a card (red or black)
 */
export function getCardColor(card: Card): 'red' | 'black' {
    return card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
}

/**
 * Checks if two cards are opposite colors
 */
export function areOppositeColors(card1: Card, card2: Card): boolean {
    return getCardColor(card1) !== getCardColor(card2);
}

/**
 * Gets the display rank for a card (A, 2-10, J, Q, K)
 */
export function getRankDisplay(rank: Rank): string {
    if (rank === 1) return 'A';
    if (rank === 11) return 'J';
    if (rank === 12) return 'Q';
    if (rank === 13) return 'K';
    return rank.toString();
}

/**
 * Gets the suit symbol
 */
export function getSuitSymbol(suit: Suit): string {
    switch (suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
    }
}

/**
 * Deep clone a card
 */
export function cloneCard(card: Card): Card {
    return { ...card };
}

/**
 * Deep clone an array of cards
 */
export function cloneCards(cards: Card[]): Card[] {
    return cards.map(cloneCard);
}
