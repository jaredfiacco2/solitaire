import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, GameSettings, Card, PileType } from '../types/game';
import { createDeck, shuffleDeck } from '../utils/deck';
import { isGameWon, canAutoComplete, findAutoMove, findValidTableauDestination } from '../utils/rules';
import { playCardDraw, playCardPlace, playCardShuffle, playSuccess, playWinFanfare, initAudio } from '../utils/sounds';

const DEFAULT_SETTINGS: GameSettings = {
    drawMode: 1,
    soundEnabled: true,
    hapticEnabled: true,
    autoComplete: true,
    cardSize: 'normal',
};

const GAME_STATE_KEY = 'solitaire-game-state';
const SETTINGS_KEY = 'solitaire-settings';

// Scoring constants
const POINTS = {
    WASTE_TO_TABLEAU: 5,
    WASTE_TO_FOUNDATION: 10,
    TABLEAU_TO_FOUNDATION: 10,
    FLIP_CARD: 5,
    RECYCLE_WASTE: -20, // Penalty for recycling in draw-3
    TIME_BONUS_MULTIPLIER: 700000, // For calculating time bonus
};

function createInitialState(drawMode: 1 | 3): GameState {
    const deck = shuffleDeck(createDeck());

    // Deal tableau (7 piles, increasing cards)
    const tableau: GameState['tableau'] = [[], [], [], [], [], [], []];
    let cardIndex = 0;

    for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= col; row++) {
            const card = { ...deck[cardIndex++] };
            card.faceUp = row === col;
            tableau[col].push(card);
        }
    }

    const stock = deck.slice(cardIndex).map(c => ({ ...c, faceUp: false }));

    return {
        stock,
        waste: [],
        foundations: [[], [], [], []],
        tableau,
        drawMode,
        moves: 0,
        score: 0,
        startTime: null,
        isComplete: false,
        canAutoComplete: false,
        isAutoCompleting: false,
    };
}

function loadSavedState(): GameState | null {
    try {
        const saved = localStorage.getItem(GAME_STATE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.tableau && parsed.foundations && parsed.stock !== undefined) {
                // Ensure new fields have defaults
                if (parsed.score === undefined) parsed.score = 0;
                if (parsed.isAutoCompleting === undefined) parsed.isAutoCompleting = false;
                return parsed;
            }
        }
    } catch {
        // Invalid saved state
    }
    return null;
}

export function useGameState() {
    const [settings, setSettings] = useState<GameSettings>(() => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    const [state, setState] = useState<GameState>(() => {
        const savedState = loadSavedState();
        if (savedState && !savedState.isComplete) {
            return savedState;
        }
        return createInitialState(settings.drawMode);
    });

    const [hintCard, setHintCard] = useState<{ cardId: string; destination: string } | null>(null);
    const autoCompleteRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Save settings
    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }, [settings]);

    // Save game state
    useEffect(() => {
        if (!state.isComplete && !state.isAutoCompleting) {
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
        } else if (state.isComplete) {
            localStorage.removeItem(GAME_STATE_KEY);
        }
    }, [state]);

    // Cleanup auto-complete on unmount
    useEffect(() => {
        return () => {
            if (autoCompleteRef.current) {
                clearTimeout(autoCompleteRef.current);
            }
        };
    }, []);

    const startTimer = useCallback(() => {
        setState(prev => {
            if (prev.startTime === null) {
                return { ...prev, startTime: Date.now() };
            }
            return prev;
        });
    }, []);

    // Draw from stock
    const drawFromStock = useCallback(() => {
        initAudio(); // Ensure audio is ready
        startTimer();
        setHintCard(null);

        setState(prev => {
            if (prev.stock.length === 0) {
                if (prev.waste.length === 0) return prev;

                const newStock = [...prev.waste].reverse().map(c => ({ ...c, faceUp: false }));
                const scorePenalty = prev.drawMode === 3 ? POINTS.RECYCLE_WASTE : 0;

                if (settings.soundEnabled) playCardShuffle(); // Shuffle sound when recycling
                return {
                    ...prev,
                    stock: newStock,
                    waste: [],
                    moves: prev.moves + 1,
                    score: Math.max(0, prev.score + scorePenalty),
                };
            }

            const drawCount = Math.min(prev.drawMode, prev.stock.length);
            const drawnCards = prev.stock.slice(-drawCount).map(c => ({ ...c, faceUp: true }));
            const newStock = prev.stock.slice(0, -drawCount);

            if (settings.soundEnabled) playCardDraw(); // Draw card sound
            return {
                ...prev,
                stock: newStock,
                waste: [...prev.waste, ...drawnCards],
                moves: prev.moves + 1,
            };
        });
    }, [startTimer]);

    // Smart move with scoring
    const smartMove = useCallback((card: Card, fromType: PileType, fromIndex: number, cardsToMove?: Card[]) => {
        setHintCard(null);

        setState(prev => {
            // Try foundation first (single cards only)
            if (!cardsToMove || cardsToMove.length === 1) {
                const foundationIndex = findAutoMove(card, prev);
                if (foundationIndex !== -1) {
                    startTimer();
                    const newState = { ...prev };
                    let pointsEarned = 0;

                    // Remove from source
                    if (fromType === 'waste') {
                        newState.waste = prev.waste.slice(0, -1);
                        pointsEarned = POINTS.WASTE_TO_FOUNDATION;
                    } else if (fromType === 'tableau') {
                        const pile = [...prev.tableau[fromIndex]];
                        pile.pop();
                        newState.tableau = [...prev.tableau];
                        newState.tableau[fromIndex] = pile;
                        pointsEarned = POINTS.TABLEAU_TO_FOUNDATION;

                        // Flip top card - bonus points
                        if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
                            pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true };
                            pointsEarned += POINTS.FLIP_CARD;
                        }
                    }

                    newState.foundations = [...prev.foundations];
                    newState.foundations[foundationIndex] = [...prev.foundations[foundationIndex], { ...card }];
                    newState.moves = prev.moves + 1;
                    newState.score = prev.score + pointsEarned;
                    newState.isComplete = isGameWon(newState);
                    newState.canAutoComplete = canAutoComplete(newState);

                    // Play success sound for foundation
                    if (settings.soundEnabled) {
                        if (newState.isComplete) {
                            playWinFanfare();
                        } else {
                            playSuccess();
                        }
                    }

                    return newState;
                }
            }

            // Try tableau
            const tableauIndex = findValidTableauDestination(card, prev);
            if (tableauIndex !== -1 && tableauIndex !== fromIndex) {
                startTimer();
                const cards = cardsToMove || [card];
                const newState = { ...prev };
                let pointsEarned = 0;

                if (fromType === 'waste') {
                    newState.waste = prev.waste.slice(0, -1);
                    pointsEarned = POINTS.WASTE_TO_TABLEAU;
                } else if (fromType === 'tableau') {
                    const pile = [...prev.tableau[fromIndex]];
                    const cardIdx = pile.findIndex(c => c.id === card.id);
                    newState.tableau = [...prev.tableau];
                    newState.tableau[fromIndex] = pile.slice(0, cardIdx);

                    const newPile = newState.tableau[fromIndex];
                    if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
                        newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true };
                        pointsEarned = POINTS.FLIP_CARD;
                    }
                }

                newState.tableau = [...(newState.tableau || prev.tableau)];
                newState.tableau[tableauIndex] = [...(newState.tableau[tableauIndex] || prev.tableau[tableauIndex]), ...cards];
                newState.moves = prev.moves + 1;
                newState.score = prev.score + pointsEarned;
                newState.canAutoComplete = canAutoComplete(newState);

                if (settings.soundEnabled) playCardPlace(); // Place sound for tableau move

                return newState;
            }

            return prev;
        });
    }, [startTimer]);

    // Find hint - suggests best move
    const findHint = useCallback(() => {
        // Check waste card first
        if (state.waste.length > 0) {
            const wasteCard = state.waste[state.waste.length - 1];
            const foundationIdx = findAutoMove(wasteCard, state);
            if (foundationIdx !== -1) {
                setHintCard({ cardId: wasteCard.id, destination: `foundation-${foundationIdx}` });
                return;
            }
            const tableauIdx = findValidTableauDestination(wasteCard, state);
            if (tableauIdx !== -1) {
                setHintCard({ cardId: wasteCard.id, destination: `tableau-${tableauIdx}` });
                return;
            }
        }

        // Check tableau cards
        for (let pileIdx = 0; pileIdx < 7; pileIdx++) {
            const pile = state.tableau[pileIdx];
            for (let cardIdx = 0; cardIdx < pile.length; cardIdx++) {
                const card = pile[cardIdx];
                if (!card.faceUp) continue;

                // Foundation move?
                if (cardIdx === pile.length - 1) {
                    const foundationIdx = findAutoMove(card, state);
                    if (foundationIdx !== -1) {
                        setHintCard({ cardId: card.id, destination: `foundation-${foundationIdx}` });
                        return;
                    }
                }

                // Tableau move? (only suggest if it exposes a card or moves to empty with King)
                const tableauIdx = findValidTableauDestination(card, state);
                if (tableauIdx !== -1 && tableauIdx !== pileIdx) {
                    // Only suggest if it would expose a face-down card or empty the pile
                    if (cardIdx > 0 && !pile[cardIdx - 1].faceUp) {
                        setHintCard({ cardId: card.id, destination: `tableau-${tableauIdx}` });
                        return;
                    }
                    // Or if moving a King to empty pile from non-empty pile
                    if (card.rank === 13 && state.tableau[tableauIdx].length === 0 && cardIdx > 0) {
                        setHintCard({ cardId: card.id, destination: `tableau-${tableauIdx}` });
                        return;
                    }
                }
            }
        }

        // No hint found - suggest drawing
        if (state.stock.length > 0 || state.waste.length > 0) {
            setHintCard({ cardId: 'stock', destination: 'draw' });
        }
    }, [state]);

    // Auto-complete animation
    const startAutoComplete = useCallback(() => {
        setState(prev => ({ ...prev, isAutoCompleting: true }));

        const autoCompleteStep = () => {
            setState(prev => {
                if (isGameWon(prev)) {
                    return { ...prev, isComplete: true, isAutoCompleting: false };
                }

                // Find a card to move to foundation
                // Check waste first
                if (prev.waste.length > 0) {
                    const card = prev.waste[prev.waste.length - 1];
                    const foundationIdx = findAutoMove(card, prev);
                    if (foundationIdx !== -1) {
                        const newState = { ...prev };
                        newState.waste = prev.waste.slice(0, -1);
                        newState.foundations = [...prev.foundations];
                        newState.foundations[foundationIdx] = [...prev.foundations[foundationIdx], card];
                        newState.moves = prev.moves + 1;
                        newState.score = prev.score + POINTS.WASTE_TO_FOUNDATION;

                        autoCompleteRef.current = setTimeout(autoCompleteStep, 100);
                        return newState;
                    }
                }

                // Check tableau
                for (let pileIdx = 0; pileIdx < 7; pileIdx++) {
                    const pile = prev.tableau[pileIdx];
                    if (pile.length === 0) continue;

                    const card = pile[pile.length - 1];
                    const foundationIdx = findAutoMove(card, prev);
                    if (foundationIdx !== -1) {
                        const newState = { ...prev };
                        newState.tableau = [...prev.tableau];
                        newState.tableau[pileIdx] = pile.slice(0, -1);
                        newState.foundations = [...prev.foundations];
                        newState.foundations[foundationIdx] = [...prev.foundations[foundationIdx], card];
                        newState.moves = prev.moves + 1;
                        newState.score = prev.score + POINTS.TABLEAU_TO_FOUNDATION;

                        autoCompleteRef.current = setTimeout(autoCompleteStep, 100);
                        return newState;
                    }
                }

                return { ...prev, isAutoCompleting: false };
            });
        };

        autoCompleteStep();
    }, []);

    // New game
    const newGame = useCallback(() => {
        if (autoCompleteRef.current) {
            clearTimeout(autoCompleteRef.current);
        }
        const newState = createInitialState(settings.drawMode);
        setState(newState);
        setHintCard(null);
        localStorage.removeItem(GAME_STATE_KEY);
    }, [settings.drawMode]);

    const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    // Clear hint after a delay
    useEffect(() => {
        if (hintCard) {
            const timer = setTimeout(() => setHintCard(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [hintCard]);

    return {
        state,
        settings,
        hintCard,
        drawFromStock,
        smartMove,
        findHint,
        startAutoComplete,
        newGame,
        updateSettings,
    };
}
