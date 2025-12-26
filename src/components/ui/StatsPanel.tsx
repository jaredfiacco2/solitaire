import { useState } from 'react';
import type { GameStats } from '../../types/game';

interface StatsPanelProps {
    stats: GameStats;
    onResetStats?: () => void;
    onClose: () => void;
}

export function StatsPanel({ stats, onResetStats, onClose }: StatsPanelProps) {
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const winRate = stats.gamesPlayed > 0
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
        : 0;

    const formatTime = (seconds: number): string => {
        if (seconds === 0) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Panel: The Grandmasters Register */}
            <div className="relative z-10 w-full max-w-sm glass rounded-[32px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)] border-white/10">
                {/* Imperial Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-serif text-imperial-gold animate-shimmer">Register</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-medium mt-1">Player Accomplishments</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Registry Content */}
                <div className="px-8 pb-8 space-y-8">
                    {/* Win Rate Showcase */}
                    <div className="flex justify-center -mt-2">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="64"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="text-white/5"
                                />
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="64"
                                    fill="none"
                                    stroke="url(#goldGradient)"
                                    strokeWidth="3.5"
                                    strokeDasharray={`${winRate * 4} 402`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#d4a533" />
                                        <stop offset="50%" stopColor="#ffd700" />
                                        <stop offset="100%" stopColor="#b8860b" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                <span className="text-4xl font-serif font-bold text-white drop-shadow-2xl">{winRate}%</span>
                                <span className="text-[9px] text-white/30 uppercase tracking-widest font-semibold mt-1">Consistency</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Boutique Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatEntry label="Victories" value={stats.gamesWon.toString()} />
                        <StatEntry label="Attempts" value={stats.gamesPlayed.toString()} />
                        <StatEntry label="Top Record" value={stats.bestScore.toString()} accent />
                        <StatEntry label="Fastest Win" value={formatTime(stats.bestTime)} />
                        <StatEntry label="Current Streak" value={stats.currentStreak.toString()} />
                        <StatEntry label="Peak Streak" value={stats.bestStreak.toString()} />
                    </div>

                    {/* Footer Utility */}
                    <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                        {!showResetConfirm ? (
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="text-[10px] text-white/20 uppercase tracking-widest hover:text-red-400 transition-colors py-2 text-center"
                            >
                                Purge Registry History
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { onResetStats?.(); setShowResetConfirm(false); }}
                                    className="flex-1 glass bg-red-500/10 text-red-500 text-[10px] uppercase tracking-widest font-bold py-2.5 rounded-xl border-red-500/20 active:scale-95"
                                >
                                    Confirm Purge
                                </button>
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="flex-1 glass text-white/40 text-[10px] uppercase tracking-widest py-2.5 rounded-xl active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatEntry({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.05] group">
            <div className={`text-[9px] uppercase tracking-widest font-bold mb-1.5 ${accent ? 'text-imperial-gold' : 'text-white/30'}`}>
                {label}
            </div>
            <div className={`text-xl font-serif leading-none ${accent ? 'text-imperial-gold animate-float-subtle' : 'text-white/90'}`}>
                {value}
            </div>
        </div>
    );
}
