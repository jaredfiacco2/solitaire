import { useState, useEffect } from 'react';

interface GameControlsProps {
    moves: number;
    score: number;
    startTime: number | null;
    drawMode: 1 | 3;
    onNewGame: () => void;
    onToggleDrawMode: () => void;
    onHint: () => void;
    isComplete: boolean;
    canAutoComplete: boolean;
    onAutoComplete: () => void;
    onOpenSettings: () => void;
}

export function GameControls({
    moves,
    score,
    startTime,
    drawMode,
    onNewGame,
    onToggleDrawMode,
    onHint,
    isComplete,
    canAutoComplete,
    onAutoComplete,
    onOpenSettings: _onOpenSettings,
}: GameControlsProps) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startTime || isComplete) return;

        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isComplete]);

    useEffect(() => {
        if (!startTime) setElapsed(0);
    }, [startTime]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <header className="glass border-b border-white/10 px-2 sm:px-4 py-2">
            <div className="flex items-center justify-between max-w-4xl mx-auto gap-2">
                {/* Stats Row */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    {/* Score - prominent */}
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        <span className="text-amber-400 font-bold tabular-nums">{score}</span>
                        <span className="text-amber-400/60 text-[10px] hidden sm:inline">pts</span>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono text-white/80 tabular-nums">{formatTime(elapsed)}</span>
                    </div>

                    {/* Moves */}
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="font-mono text-white/80 tabular-nums">{moves}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Hint Button */}
                    <button
                        onClick={onHint}
                        className="p-2 text-yellow-400/80 bg-yellow-500/10 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 active:scale-95 transition-all"
                        title="Get Hint"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </button>

                    {/* Auto-complete Button - shows when available */}
                    {canAutoComplete && !isComplete && (
                        <button
                            onClick={onAutoComplete}
                            className="px-2 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-500/20 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 active:scale-95 transition-all animate-pulse"
                        >
                            <span className="hidden sm:inline">Auto</span> Finish
                        </button>
                    )}

                    {/* Draw mode toggle */}
                    <button
                        onClick={onToggleDrawMode}
                        className="px-2 py-1.5 sm:px-2.5 text-xs font-medium text-white/70 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
                    >
                        Draw {drawMode}
                    </button>

                    {/* New Game */}
                    <button
                        onClick={onNewGame}
                        className="px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg hover:from-emerald-500 hover:to-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-900/30"
                    >
                        New
                    </button>
                </div>
            </div>
        </header>
    );
}
