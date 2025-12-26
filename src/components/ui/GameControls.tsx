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
        <header className="glass border-b border-white/5 px-3 sm:px-6 py-2 sm:py-3 relative z-40">
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
                {/* Visual Stats Cluster */}
                <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm">
                    {/* Imperial Score Pod */}
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-[#d4a533]/50 font-bold mb-0.5">Imperial Score</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl sm:text-2xl font-serif font-bold text-imperial-gold leading-none tabular-nums text-imperial-gold">{score}</span>
                        </div>
                    </div>

                    {/* Metadata Items */}
                    <div className="hidden sm:flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Duration</span>
                            <span className="font-mono text-sm text-white/70 leading-none">{formatTime(elapsed)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Actions</span>
                            <span className="font-mono text-sm text-white/70 leading-none">{moves}</span>
                        </div>
                    </div>

                    {/* Mobile Metadata Item */}
                    <div className="flex sm:hidden items-center gap-3">
                        <span className="font-mono text-xs text-white/60">{formatTime(elapsed)}</span>
                        <div className="w-[1px] h-3 bg-white/10" />
                        <span className="font-mono text-xs text-white/60">{moves}m</span>
                    </div>
                </div>

                {/* Command actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Undo - Tactical */}
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={`btn-squish p-2 sm:p-2.5 rounded-xl border transition-all ${canUndo
                            ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                            : 'opacity-20 border-transparent text-white/30 grayscale'
                            }`}
                        aria-label="Undo Move"
                    >
                        <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>

                    {/* Hint - Guidance */}
                    <button
                        onClick={onHint}
                        className="btn-squish p-2 sm:p-2.5 rounded-xl bg-[#d4a533]/5 border border-[#d4a533]/20 text-[#d4a533]/70 hover:bg-[#d4a533]/15 hover:text-[#d4a533]"
                        aria-label="Consult Hint"
                    >
                        <svg className="w-5 h-5 animate-float-subtle text-[#d4a533]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </button>

                    {/* Auto-resolution - Finishing */}
                    {canAutoComplete && !isComplete && (
                        <button
                            onClick={onAutoComplete}
                            className="btn-squish px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#d4a533] to-[#b8860b] text-black font-bold text-xs sm:text-sm rounded-xl shadow-[0_4px_12px_rgba(212,165,51,0.3)] hover:shadow-[0_6px_20px_rgba(212,165,51,0.4)] transition-all uppercase tracking-widest"
                        >
                            Finish
                        </button>
                    )}

                    <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />

                    {/* Game Lifecycle Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggleDrawMode}
                            className="hidden lg:block btn-squish px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80"
                        >
                            {drawMode === 1 ? 'Single' : 'Triple'} Draw
                        </button>

                        <button
                            onClick={onNewGame}
                            className="btn-squish px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-black font-bold text-xs sm:text-sm rounded-xl hover:bg-[#f0f0f0] transition-colors uppercase tracking-widest"
                        >
                            New Game
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

