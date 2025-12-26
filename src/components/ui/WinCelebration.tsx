import { useEffect, useState, useMemo } from 'react';

interface WinCelebrationProps {
    onNewGame: () => void;
    time: number;
    moves: number;
    score: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
    size: number;
    type: 'confetti' | 'sparkle' | 'star' | 'firework';
    rotation: number;
}

const COLORS = [
    '#d4a533', '#ffd700', // Imperial Gold
    '#ffffff', // Silver
    '#c4151c', // Royal Red
];

export function WinCelebration({ onNewGame, time, moves, score }: WinCelebrationProps) {
    const [showModal, setShowModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    const particles = useMemo(() => {
        const result: Particle[] = [];

        // Luxury Confetti
        for (let i = 0; i < 60; i++) {
            result.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 3,
                size: 5 + Math.random() * 7,
                type: 'confetti',
                rotation: Math.random() * 360,
            });
        }

        // Firework "Royal Bursts"
        for (let i = 60; i < 75; i++) {
            result.push({
                id: i,
                x: 10 + Math.random() * 80,
                y: 10 + Math.random() * 40,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 2.5,
                size: 40 + Math.random() * 60,
                type: 'firework',
                rotation: 0,
            });
        }

        return result;
    }, []);

    useEffect(() => {
        const modalTimer = setTimeout(() => setShowModal(true), 400);
        const confettiTimer = setTimeout(() => setShowConfetti(false), 8000);

        return () => {
            clearTimeout(modalTimer);
            clearTimeout(confettiTimer);
        };
    }, []);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getBespokeRating = () => {
        if (score >= 700 && time < 150) return { title: 'Grandmaster', subtitle: 'The Ultimate Achievement' };
        if (score >= 500 && time < 240) return { title: 'Artisan', subtitle: 'Exceptional Technique' };
        if (score >= 300) return { title: 'Adept', subtitle: 'A Refined Performance' };
        return { title: 'Victor', subtitle: 'The Table is Cleared' };
    };

    const rating = getBespokeRating();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* Imperial Backdrop */}
            <div
                className={`absolute inset-0 bg-black/85 backdrop-blur-xl transition-opacity duration-700 ${showModal ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Celebration Particles */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className={`${p.type === 'confetti' ? 'confetti-particle' : 'firework-burst'} absolute`}
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.type === 'confetti' ? p.size * 0.4 : p.size,
                                backgroundColor: p.type === 'confetti' ? p.color : 'transparent',
                                border: p.type === 'firework' ? `1.5px solid ${p.color}` : 'none',
                                animationDelay: `${p.delay}s`,
                                transform: `rotate(${p.rotation}deg)`,
                                opacity: 0.8,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Imperial Victory Plinth */}
            <div
                className={`
                    relative z-10 w-full max-w-sm mx-6
                    glass rounded-[32px] p-8 sm:p-10
                    shadow-[0_40px_100px_rgba(0,0,0,0.8)]
                    transform transition-all duration-700 var(--ease-imperial)
                    ${showModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'}
                `}
            >
                {/* Silver Border Frame */}
                <div className="absolute inset-2 border border-white/5 rounded-[26px] pointer-events-none" />

                <div className="flex flex-col items-center">
                    {/* Emblems of Victory */}
                    <div className="relative mb-8 group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#d4a533] via-[#ffd700] to-[#b8860b] flex items-center justify-center shadow-[0_15px_35px_rgba(212,165,51,0.4)] animate-float-subtle relative overflow-hidden">
                            {/* Persistent Gold Shimmer */}
                            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                            <svg className="w-12 h-12 text-black relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                            </svg>
                        </div>
                        <div className="absolute -inset-4 border border-[#d4a533]/20 rounded-full animate-pulse" />
                    </div>

                    {/* Bespoke Rating Display */}
                    <div className="text-center mb-10">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4a533] font-bold mb-3 opacity-60">Attained Rank</div>
                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-imperial-gold mb-2 drop-shadow-sm select-none animate-shimmer" style={{ backgroundClip: 'text' }}>
                            {rating.title}
                        </h2>
                        <p className="text-white/40 text-sm italic font-serif opacity-80">{rating.subtitle}</p>
                    </div>

                    {/* Imperial Metrics Grid */}
                    <div className="w-full grid grid-cols-2 gap-4 mb-10">
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">Duration</span>
                            <span className="text-xl font-mono text-white/90">{formatTime(time)}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">Strategy</span>
                            <span className="text-xl font-mono text-white/90">{moves} moves</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mb-10">
                        <span className="text-[10px] uppercase tracking-widest text-[#d4a533]/60 font-bold mb-1">Final Standing</span>
                        <span className="text-5xl font-serif font-bold text-imperial-gold tabular-nums">{score}</span>
                    </div>

                    {/* Affirmation Command */}
                    <button
                        onClick={onNewGame}
                        className="btn-squish w-full py-5 bg-white text-black font-bold text-sm rounded-2xl shadow-xl hover:bg-[#f0f0f0] transition-all uppercase tracking-[0.2em] relative overflow-hidden group"
                    >
                        <span className="relative z-10">Initiate New Round</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors font-bold"
                    >
                        Exit to Gallery
                    </button>
                </div>
            </div>
        </div>
    );
}
