import type { GameStats } from '../../types/game';

interface StatsPanelProps {
    stats: GameStats;
    onClose: () => void;
}

export function StatsPanel({ stats, onClose }: StatsPanelProps) {
    const winRate = stats.gamesPlayed > 0
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
        : 0;

    const formatTime = (seconds: number): string => {
        if (seconds === 0) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Statistics</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="p-5 space-y-4">
                    {/* Win Rate Circle */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-28 h-28">
                            {/* Background circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="48"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-white/10"
                                />
                                <circle
                                    cx="56"
                                    cy="56"
                                    r="48"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${winRate * 3.02} 302`}
                                    strokeLinecap="round"
                                    className="text-emerald-500 transition-all duration-1000"
                                />
                            </svg>
                            {/* Center text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-white">{winRate}%</span>
                                <span className="text-xs text-white/50">Win Rate</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Games Played" value={stats.gamesPlayed.toString()} />
                        <StatCard label="Games Won" value={stats.gamesWon.toString()} />
                        <StatCard label="Best Time" value={formatTime(stats.bestTime)} />
                        <StatCard label="Current Streak" value={stats.currentStreak.toString()} />
                        <StatCard label="Best Streak" value={stats.bestStreak.toString()} />
                        <StatCard label="Total Moves" value={stats.totalMoves.toString()} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">{label}</div>
            <div className="text-lg font-mono font-semibold text-white">{value}</div>
        </div>
    );
}
