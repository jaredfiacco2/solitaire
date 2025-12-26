import { useState, useCallback, useRef, useEffect } from 'react';
import type { GameState, GameSettings, Card, PileType } from '../types/game';
import { isGameWon, canAutoComplete, findAutoMove, findValidTableauDestination, hasAnyValidMove } from '../utils/rules';
import { generateGuaranteedSolvableDeal } from '../utils/solver';
import { playCardDraw, playCardPlace, playCardShuffle, playSuccess, playWinFanfare, initAudio, triggerHaptic } from '../utils/sounds';

const DEFAULT_SETTINGS: GameSettings = {
    drawMode: 1,
    soundEnabled: true,
    hapticEnabled: true,
    autoComplete: true,
    cardSize: 'normal',
    tableTheme: 'midnight',
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
    return generateGuaranteedSolvableDeal(drawMode);
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
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration for tableTheme
            if (parsed.tableTheme === undefined) {
                parsed.tableTheme = 'midnight';
            }
            return { ...DEFAULT_SETTINGS, ...parsed };
        }
        return DEFAULT_SETTINGS;
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
    const [history, setHistory] = useState<GameState[]>([]);
    const MAX_UNDO = 20;

    // Save current state to history before making changes
    const saveToHistory = useCallback((currentState: GameState) => {
        setHistory(prev => [...prev.slice(-MAX_UNDO + 1), currentState]);
    }, []);

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
            // Save to history before making changes
            saveToHistory(prev);

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
                isStuck: false, // Drawing a card may reveal new moves
            };
        });
    }, [startTimer, saveToHistory, settings.soundEnabled]);

    // Smart move with scoring
    const smartMove = useCallback((card: Card, fromType: PileType, fromIndex: number, cardsToMove?: Card[]) => {
        setHintCard(null);

        setState(prev => {
            saveToHistory(prev);

            const now = Date.now();
            const timeSinceLast = prev.lastMoveTime ? (now - prev.lastMoveTime) / 1000 : 999;
            const newCombo = timeSinceLast < 2.5 ? Math.min(prev.comboMultiplier + 1, 8) : 1;

            // Try foundation first (single cards only)
            if (!cardsToMove || cardsToMove.length === 1) {
                const foundationIndex = findAutoMove(card, prev);
                if (foundationIndex !== -1) {
                    startTimer();
                    const newState = { ...prev };
                    let points = 0;

                    if (fromType === 'waste') {
                        newState.waste = prev.waste.slice(0, -1);
                        points = POINTS.WASTE_TO_FOUNDATION;
                    } else if (fromType === 'tableau') {
                        const pile = [...prev.tableau[fromIndex]];
                        pile.pop();
                        newState.tableau = [...prev.tableau];
                        newState.tableau[fromIndex] = pile;
                        points = POINTS.TABLEAU_TO_FOUNDATION;

                        if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
                            pile[pile.length - 1] = { ...pile[pile.length - 1], faceUp: true };
                            points += POINTS.FLIP_CARD;
                        }
                    }

                    newState.foundations = [...prev.foundations];
                    newState.foundations[foundationIndex] = [...prev.foundations[foundationIndex], { ...card }];
                    newState.moves = prev.moves + 1;
                    newState.score = prev.score + (points * newCombo);
                    newState.comboMultiplier = newCombo;
                    newState.lastMoveTime = now;
                    newState.isComplete = isGameWon(newState);
                    newState.canAutoComplete = canAutoComplete(newState);
                    newState.isStuck = !newState.isComplete && !hasAnyValidMove(newState);

                    if (settings.soundEnabled) {
                        if (newState.isComplete) playWinFanfare();
                        else playSuccess();
                        if (settings.hapticEnabled) triggerHaptic(newState.isComplete ? 'success' : 'medium');
                    }

                    return newState;
                }
            }

            // Try tableau
            const tableauIndex = findValidTableauDestination(card, prev);
            // Only skip if moving within same tableau pile (fromType === 'tableau' AND same index)
            const isSamePile = fromType === 'tableau' && tableauIndex === fromIndex;
            if (tableauIndex !== -1 && !isSamePile) {
                startTimer();
                const cards = cardsToMove || [card];
                const newState = { ...prev };
                let points = 0;

                if (fromType === 'waste') {
                    newState.waste = prev.waste.slice(0, -1);
                    points = POINTS.WASTE_TO_TABLEAU;
                } else if (fromType === 'tableau') {
                    const pile = [...prev.tableau[fromIndex]];
                    const cardIdx = pile.findIndex(c => c.id === card.id);
                    newState.tableau = [...prev.tableau];
                    newState.tableau[fromIndex] = pile.slice(0, cardIdx);

                    const newPile = newState.tableau[fromIndex];
                    if (newPile.length > 0 && !newPile[newPile.length - 1].faceUp) {
                        newPile[newPile.length - 1] = { ...newPile[newPile.length - 1], faceUp: true };
                        points = POINTS.FLIP_CARD;
                    }
                }

                newState.tableau = [...(newState.tableau || prev.tableau)];
                newState.tableau[tableauIndex] = [...(newState.tableau[tableauIndex] || prev.tableau[tableauIndex]), ...cards];
                newState.moves = prev.moves + 1;
                newState.score = prev.score + (points * newCombo);
                newState.comboMultiplier = newCombo;
                newState.lastMoveTime = now;
                newState.canAutoComplete = canAutoComplete(newState);
                newState.isStuck = !hasAnyValidMove(newState);

                if (settings.soundEnabled) {
                    playCardPlace();
                    if (settings.hapticEnabled) triggerHaptic('light');
                }

                return newState;
            }

            return { ...prev, comboMultiplier: 1, lastMoveTime: now };
        });
    }, [startTimer, settings, saveToHistory]);

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
            autoCompleteRef.current = null;
        }
        const newState = createInitialState(settings.drawMode);
        newState.isDealing = true;
        setState(newState);
        setHistory([]);
        setHintCard(null);
        localStorage.removeItem(GAME_STATE_KEY);

        // Transition out of dealing mode after animations
        setTimeout(() => {
            setState(prev => ({ ...prev, isDealing: false }));
        }, 1500);

        if (settings.soundEnabled) {
            playCardShuffle();
            if (settings.hapticEnabled) triggerHaptic('medium');
        }
    }, [settings.drawMode, settings.soundEnabled, settings.hapticEnabled]);

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

    // Undo last action
    const undo = useCallback(() => {
        if (history.length === 0 || state.isAutoCompleting) return;

        // Stop any active auto-complete
        if (autoCompleteRef.current) {
            clearTimeout(autoCompleteRef.current);
            autoCompleteRef.current = null;
        }

        const previousState = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setState({ ...previousState, isAutoCompleting: false });
    }, [history, state.isAutoCompleting]);

    return {
        state,
        settings,
        hintCard,
        canUndo: history.length > 0,
        drawFromStock,
        smartMove,
        undo,
        newGame,
        updateSettings,
        findHint,
        startAutoComplete
    };
}
