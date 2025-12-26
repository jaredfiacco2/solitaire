import type { Card, GameState, PileType } from '../types/game';
import { areOppositeColors } from './deck';

/**
 * Check if a card can be placed on a tableau pile
 * Rules: Alternating colors, descending order (K->Q->J->10...->A)
 * Empty tableau can only accept a King
 */
export function canPlaceOnTableau(card: Card, pile: Card[]): boolean {
    // Empty pile - only Kings can go here
    if (pile.length === 0) {
        return card.rank === 13; // King
    }

    const topCard = pile[pile.length - 1];

    // Top card must be face up
    if (!topCard.faceUp) return false;

    // Must be opposite color and one rank lower
    return areOppositeColors(card, topCard) && card.rank === topCard.rank - 1;
}

/**
 * Check if a card can be placed on a foundation pile
 * Rules: Same suit, ascending order (A->2->3...->K)
 * Empty foundation can only accept an Ace
 */
export function canPlaceOnFoundation(card: Card, pile: Card[]): boolean {
    // Empty pile - only Aces can go here
    if (pile.length === 0) {
        return card.rank === 1; // Ace
    }

    const topCard = pile[pile.length - 1];

    // Must be same suit and one rank higher
    return card.suit === topCard.suit && card.rank === topCard.rank + 1;
}

/**
 * Check if a move is valid
 */
export function isValidMove(
    cards: Card[],
    _fromType: PileType,
    _fromIndex: number,
    toType: PileType,
    toIndex: number,
    state: GameState
): boolean {
    if (cards.length === 0) return false;

    const firstCard = cards[0];

    // Can only move face-up cards
    if (!firstCard.faceUp) return false;

    // Can't move to stock
    if (toType === 'stock') return false;

    // Can't move to waste
    if (toType === 'waste') return false;

    // Foundation accepts only single cards
    if (toType === 'foundation') {
        if (cards.length !== 1) return false;
        return canPlaceOnFoundation(firstCard, state.foundations[toIndex]);
    }

    // Tableau
    if (toType === 'tableau') {
        // Validate that all cards form a valid sequence
        for (let i = 0; i < cards.length - 1; i++) {
            const current = cards[i];
            const next = cards[i + 1];
            if (!areOppositeColors(current, next) || current.rank !== next.rank + 1) {
                return false;
            }
        }
        return canPlaceOnTableau(firstCard, state.tableau[toIndex]);
    }

    return false;
}

/**
 * Check if the game can be auto-completed
 * All cards are face-up and no cards in stock/waste
 */
export function canAutoComplete(state: GameState): boolean {
    // Stock must be empty
    if (state.stock.length > 0) return false;

    // Waste must be empty
    if (state.waste.length > 0) return false;

    // All tableau cards must be face-up
    for (const pile of state.tableau) {
        for (const card of pile) {
            if (!card.faceUp) return false;
        }
    }

    return true;
}

/**
 * Check if the game is won (all cards in foundations)
 */
export function isGameWon(state: GameState): boolean {
    return state.foundations.every(foundation => foundation.length === 13);
}

/**
 * Find the best auto-move for a card (returns foundation index or -1)
 */
export function findAutoMove(card: Card, state: GameState): number {
    for (let i = 0; i < 4; i++) {
        if (canPlaceOnFoundation(card, state.foundations[i])) {
            return i;
        }
    }
    return -1;
}

/**
 * Find first valid tableau destination for a card
 */
export function findValidTableauDestination(card: Card, state: GameState): number {
    for (let i = 0; i < 7; i++) {
        if (canPlaceOnTableau(card, state.tableau[i])) {
            return i;
        }
    }
    return -1;
}

/**
 * Check if there are any valid moves available
 * Returns false when the game is stuck (no moves possible)
 */
export function hasAnyValidMove(state: GameState): boolean {
    // If stock has cards, player can always draw
    if (state.stock.length > 0) return true;

    // Check waste card
    if (state.waste.length > 0) {
        const wasteCard = state.waste[state.waste.length - 1];
        // Can move to foundation?
        if (findAutoMove(wasteCard, state) !== -1) return true;
        // Can move to tableau?
        if (findValidTableauDestination(wasteCard, state) !== -1) return true;
    }

    // Check all tableau face-up cards
    for (let pileIdx = 0; pileIdx < 7; pileIdx++) {
        const pile = state.tableau[pileIdx];
        for (let cardIdx = 0; cardIdx < pile.length; cardIdx++) {
            const card = pile[cardIdx];
            if (!card.faceUp) continue;

            // Can move to foundation? (only top card)
            if (cardIdx === pile.length - 1) {
                if (findAutoMove(card, state) !== -1) return true;
            }

            // Can move to another tableau pile?
            const destIdx = findValidTableauDestination(card, state);
            if (destIdx !== -1 && destIdx !== pileIdx) {
                // Valid move exists (even if it doesn't expose a new card)
                return true;
            }
        }
    }

    // No valid moves found
    return false;
}
