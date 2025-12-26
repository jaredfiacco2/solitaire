import type { GameState } from '../types/game';
import { canPlaceOnFoundation, canPlaceOnTableau } from './rules';

/**
 * A basic heuristic-based Klondike solver to check for "likely winnable" deals.
 * This is not an exhaustive search, but a greedy approach to find a solution path.
 */

interface SolverState extends GameState { }

function cloneSolverState(state: GameState): SolverState {
    return JSON.parse(JSON.stringify(state));
}

/**
 * Attempts to solve a given Solitaire state using a greedy algorithm.
 * Returns true if the game can be won, false otherwise.
 */
export function canSolve(initialState: GameState, maxDepth = 1000): boolean {
    let state = cloneSolverState(initialState);
    let moves = 0;
    let stuckCount = 0;

    // We use a simple greedy loop:
    // 1. Prioritize foundation moves.
    // 2. Prioritize tableau moves that flip face-down cards.
    // 3. Draw from stock if no other moves.

    while (moves < maxDepth) {
        let moved = false;

        // 1. Check foundation moves (Higher Priority)
        // From Waste
        if (state.waste.length > 0) {
            const card = state.waste[state.waste.length - 1];
            for (let i = 0; i < 4; i++) {
                if (canPlaceOnFoundation(card, state.foundations[i])) {
                    state.foundations[i].push(state.waste.pop()!);
                    moved = true;
                    break;
                }
            }
        }
        if (moved) { moves++; stuckCount = 0; if (isWon(state)) return true; continue; }

        // From Tableau
        for (let i = 0; i < 7; i++) {
            const pile = state.tableau[i];
            if (pile.length > 0) {
                const card = pile[pile.length - 1];
                for (let j = 0; j < 4; j++) {
                    if (canPlaceOnFoundation(card, state.foundations[j])) {
                        state.foundations[j].push(pile.pop()!);
                        // Flip top card if needed
                        if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
                            pile[pile.length - 1].faceUp = true;
                        }
                        moved = true;
                        break;
                    }
                }
            }
            if (moved) break;
        }
        if (moved) { moves++; stuckCount = 0; if (isWon(state)) return true; continue; }

        // 2. Tableau to Tableau moves that expose new cards
        for (let i = 0; i < 7; i++) {
            const fromPile = state.tableau[i];
            if (fromPile.length === 0) continue;

            // Find the highest face-up card in the pile
            const firstFaceUpIdx = fromPile.findIndex(c => c.faceUp);
            if (firstFaceUpIdx === -1) continue;

            const cardToMove = fromPile[firstFaceUpIdx];

            // Try to move to another tableau pile
            for (let j = 0; j < 7; j++) {
                if (i === j) continue;
                if (canPlaceOnTableau(cardToMove, state.tableau[j])) {
                    // Only move if it exposes a face-down card or if it's a King moving to an empty space from a non-empty pile
                    const isExposingCard = firstFaceUpIdx > 0 && !fromPile[firstFaceUpIdx - 1].faceUp;
                    const isKingToEmpty = cardToMove.rank === 13 && state.tableau[j].length === 0 && firstFaceUpIdx > 0;

                    if (isExposingCard || isKingToEmpty) {
                        const cards = fromPile.splice(firstFaceUpIdx);
                        state.tableau[j].push(...cards);
                        if (fromPile.length > 0 && !fromPile[fromPile.length - 1].faceUp) {
                            fromPile[fromPile.length - 1].faceUp = true;
                        }
                        moved = true;
                        break;
                    }
                }
            }
            if (moved) break;
        }
        if (moved) { moves++; stuckCount = 0; continue; }

        // 3. Waste to Tableau
        if (state.waste.length > 0) {
            const card = state.waste[state.waste.length - 1];
            for (let i = 0; i < 7; i++) {
                if (canPlaceOnTableau(card, state.tableau[i])) {
                    state.tableau[i].push(state.waste.pop()!);
                    moved = true;
                    break;
                }
            }
        }
        if (moved) { moves++; stuckCount = 0; continue; }

        // 4. Draw from Stock
        if (state.stock.length > 0) {
            const drawCount = Math.min(state.drawMode, state.stock.length);
            const drawn = state.stock.splice(-drawCount);
            state.waste.push(...drawn.map(c => ({ ...c, faceUp: true })));
            moved = true;
        } else if (state.waste.length > 0) {
            // Recycle stock
            state.stock = [...state.waste].reverse().map(c => ({ ...c, faceUp: false }));
            state.waste = [];
            moved = true;
            stuckCount++; // Track recycling to avoid infinite loops
        }

        if (!moved || stuckCount > 3) break; // Stuck
        moves++;
    }

    return isWon(state);
}

function isWon(state: SolverState): boolean {
    return state.foundations.every(f => f.length === 13);
}

/**
 * Generates an initial game state that is verified winnable by the solver.
 */
export function generateWinnableDeal(
    createInitialStateFn: (drawMode: 1 | 3) => GameState,
    drawMode: 1 | 3,
    maxTries = 50
): GameState {
    for (let i = 0; i < maxTries; i++) {
        const state = createInitialStateFn(drawMode);
        if (canSolve(state)) {
            console.log(`Winnable deal found in ${i + 1} tries`);
            return state;
        }
    }
    // Fallback to a random deal if it takes too many tries (unlikely)
    console.warn("Failed to find guaranteed winnable deal, falling back to random.");
    return createInitialStateFn(drawMode);
}
