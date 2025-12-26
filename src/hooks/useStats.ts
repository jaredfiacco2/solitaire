import { useState, useEffect, useCallback } from 'react';
import type { GameStats } from '../types/game';

const STATS_KEY = 'solitaire-stats';

const DEFAULT_STATS: GameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    bestTime: 0,
    bestScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalMoves: 0,
};

export function useStats() {
    const [stats, setStats] = useState<GameStats>(() => {
        try {
            const saved = localStorage.getItem(STATS_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Handle migration from null bestTime to 0
                if (parsed.bestTime === null) {
                    parsed.bestTime = 0;
                }
                // Handle missing bestScore
                if (parsed.bestScore === undefined) {
                    parsed.bestScore = 0;
                }
                return { ...DEFAULT_STATS, ...parsed };
            }
        } catch {
            // Invalid data, use defaults
        }
        return DEFAULT_STATS;
    });

    // Save to localStorage whenever stats change
    useEffect(() => {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }, [stats]);

    const recordGamePlayed = useCallback(() => {
        setStats(prev => ({
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
        }));
    }, []);

    const recordWin = useCallback((time: number, moves: number, score: number) => {
        setStats(prev => {
            const newStreak = prev.currentStreak + 1;
            return {
                ...prev,
                gamesWon: prev.gamesWon + 1,
                bestTime: prev.bestTime === 0 ? time : Math.min(prev.bestTime, time),
                bestScore: Math.max(prev.bestScore, score),
                currentStreak: newStreak,
                bestStreak: Math.max(prev.bestStreak, newStreak),
                totalMoves: prev.totalMoves + moves,
            };
        });
    }, []);

    const recordLoss = useCallback((moves: number) => {
        setStats(prev => ({
            ...prev,
            currentStreak: 0,
            totalMoves: prev.totalMoves + moves,
        }));
    }, []);

    const resetStats = useCallback(() => {
        setStats(DEFAULT_STATS);
    }, []);

    return {
        stats,
        recordGamePlayed,
        recordWin,
        recordLoss,
        resetStats,
    };
}
