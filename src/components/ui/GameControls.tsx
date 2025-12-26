import { useState, useEffect } from 'react';

interface GameControlsProps {
    moves: number;
    score: number;
    startTime: number | null;
    drawMode: 1 | 3;
    onNewGame: () => void;
    onToggleDrawMode: () => void;
    onHint: () => void;
    onUndo: () => void;
    canUndo: boolean;
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
    onUndo,
    canUndo,
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
        <header className="glass border-b border-white/[0.06] px-2 sm:px-4 py-2.5">
            <div className="flex items-center justify-between max-w-4xl mx-auto gap-2">
                {/* Stats Row */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    {/* Score - premium gold styling */}
                    <div className="score-display flex items-center gap-1.5">
                        <span className="score-value text-base sm:text-lg tabular-nums">{score}</span>
                        <span className="text-[#d4a533]/50 text-[10px] hidden sm:inline uppercase tracking-wider">pts</span>
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono text-white/70 tabular-nums">{formatTime(elapsed)}</span>
                    </div>

                    {/* Moves */}
                    <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="font-mono text-white/70 tabular-nums">{moves}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Undo Button */}
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={`btn-premium btn-subtle p-2 rounded-lg ${!canUndo ? 'opacity-40 cursor-not-allowed' : ''}`}
                        title="Undo"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>

                    {/* Hint Button */}
                    <button
                        onClick={onHint}
                        className="btn-premium p-2 rounded-lg bg-[#d4a533]/10 border border-[#d4a533]/20 text-[#d4a533]/80 hover:bg-[#d4a533]/15"
                        title="Get Hint"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </button>

                    {/* Auto-complete Button */}
                    {canAutoComplete && !isComplete && (
                        <button
                            onClick={onAutoComplete}
                            className="btn-premium px-2 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-[#d4a533] bg-[#d4a533]/15 rounded-lg border border-[#d4a533]/25 hover:bg-[#d4a533]/20"
                        >
                            <span className="hidden sm:inline">Auto </span>Finish
                        </button>
                    )}

                    {/* Draw mode toggle */}
                    <button
                        onClick={onToggleDrawMode}
                        className="btn-premium btn-subtle px-2 py-1.5 sm:px-2.5 text-xs font-medium rounded-lg"
                    >
                        Draw {drawMode}
                    </button>

                    {/* New Game */}
                    <button
                        onClick={onNewGame}
                        className="btn-premium btn-gold px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-semibold rounded-lg"
                    >
                        New
                    </button>
                </div>
            </div>
        </header>
    );
}

