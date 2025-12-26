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
    type: 'confetti' | 'sparkle' | 'star' | 'firework' | 'card';
    rotation: number;
    suit?: string;
}

const COLORS = [
    '#10b981', '#34d399',
    '#fbbf24', '#f59e0b',
    '#ec4899', '#f472b6',
    '#8b5cf6', '#a78bfa',
    '#3b82f6', '#60a5fa',
    '#ef4444',
];

const SUITS = ['♠', '♥', '♦', '♣'];

export function WinCelebration({ onNewGame, time, moves, score }: WinCelebrationProps) {
    const [showModal, setShowModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    const particles = useMemo(() => {
        const result: Particle[] = [];

        // Confetti
        for (let i = 0; i < 100; i++) {
            result.push({
                id: i,
                x: Math.random() * 100,
                y: -15 - Math.random() * 10,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 2.5,
                size: 8 + Math.random() * 10,
                type: 'confetti',
                rotation: Math.random() * 360,
            });
        }

        // Sparkles
        for (let i = 100; i < 140; i++) {
            result.push({
                id: i,
                x: 5 + Math.random() * 90,
                y: 5 + Math.random() * 90,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 4,
                size: 4 + Math.random() * 8,
                type: 'sparkle',
                rotation: 0,
            });
        }

        // Rising stars
        for (let i = 140; i < 170; i++) {
            result.push({
                id: i,
                x: Math.random() * 100,
                y: 100,
                color: '#fbbf24',
                delay: Math.random() * 3,
                size: 8 + Math.random() * 8,
                type: 'star',
                rotation: 0,
            });
        }

        // Fireworks
        for (let i = 170; i < 190; i++) {
            result.push({
                id: i,
                x: 15 + Math.random() * 70,
                y: 15 + Math.random() * 50,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 2,
                size: 40 + Math.random() * 50,
                type: 'firework',
                rotation: 0,
            });
        }

        // Falling card suits
        for (let i = 190; i < 210; i++) {
            result.push({
                id: i,
                x: Math.random() * 100,
                y: -10,
                color: i % 2 === 0 ? '#ef4444' : '#1e293b',
                delay: Math.random() * 3,
                size: 20 + Math.random() * 16,
                type: 'card',
                rotation: Math.random() * 360,
                suit: SUITS[Math.floor(Math.random() * SUITS.length)],
            });
        }

        return result;
    }, []);

    useEffect(() => {
        const modalTimer = setTimeout(() => setShowModal(true), 300);
        const confettiTimer = setTimeout(() => setShowConfetti(false), 6000);

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

    const getRating = () => {
        if (score >= 700 && time < 180) return { text: 'Legendary!', emoji: '👑', color: 'text-yellow-400' };
        if (score >= 500 && time < 300) return { text: 'Excellent!', emoji: '🌟', color: 'text-emerald-400' };
        if (score >= 300) return { text: 'Great!', emoji: '🎉', color: 'text-blue-400' };
        return { text: 'Good Game!', emoji: '✨', color: 'text-white/80' };
    };

    const rating = getRating();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <div
                className={`absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500 ${showModal ? 'opacity-100' : 'opacity-0'}`}
            />

            {showConfetti && (
                <>
                    {particles.filter(p => p.type === 'confetti').map((p) => (
                        <div
                            key={p.id}
                            className="confetti-particle absolute pointer-events-none"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.size * 0.6,
                                backgroundColor: p.color,
                                borderRadius: '2px',
                                animationDelay: `${p.delay}s`,
                                transform: `rotate(${p.rotation}deg)`,
                            }}
                        />
                    ))}

                    {particles.filter(p => p.type === 'card').map((p) => (
                        <div
                            key={p.id}
                            className="confetti-particle absolute pointer-events-none font-serif"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                fontSize: p.size,
                                color: p.color,
                                animationDelay: `${p.delay}s`,
                                transform: `rotate(${p.rotation}deg)`,
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            }}
                        >
                            {p.suit}
                        </div>
                    ))}

                    {particles.filter(p => p.type === 'sparkle').map((p) => (
                        <div
                            key={p.id}
                            className="sparkle absolute pointer-events-none"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                borderRadius: '50%',
                                animationDelay: `${p.delay}s`,
                                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                            }}
                        />
                    ))}

                    {particles.filter(p => p.type === 'star').map((p) => (
                        <div
                            key={p.id}
                            className="star-rise absolute pointer-events-none"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                fontSize: p.size,
                                color: p.color,
                                animationDelay: `${p.delay}s`,
                                textShadow: `0 0 ${p.size}px ${p.color}`,
                            }}
                        >
                            ★
                        </div>
                    ))}

                    {particles.filter(p => p.type === 'firework').map((p) => (
                        <div
                            key={p.id}
                            className="firework-burst absolute pointer-events-none rounded-full"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.size,
                                border: `3px solid ${p.color}`,
                                animationDelay: `${p.delay}s`,
                                marginLeft: -p.size / 2,
                                marginTop: -p.size / 2,
                            }}
                        />
                    ))}
                </>
            )}

            {/* Victory Modal */}
            <div
                className={`
                    relative z-10 w-full max-w-sm mx-4
                    bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900
                    border border-emerald-500/40 rounded-2xl
                    shadow-2xl shadow-emerald-500/30
                    transform transition-all duration-600 ease-out
                    ${showModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-12'}
                `}
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-yellow-500/30 to-emerald-500/30 rounded-2xl blur-xl opacity-60" />

                <div className="relative p-6 sm:p-8">
                    {/* Trophy */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-xl">
                                <span className="text-5xl sm:text-6xl">🏆</span>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping" />
                        </div>
                    </div>

                    {/* Rating */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-1">
                        <span className={rating.color}>{rating.emoji} {rating.text}</span>
                    </h2>
                    <p className="text-white/50 text-center text-sm mb-6">You conquered the deck!</p>

                    {/* Score highlight */}
                    <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 rounded-xl p-4 mb-4 border border-amber-500/30">
                        <div className="text-center">
                            <div className="text-amber-400/70 text-xs uppercase tracking-wider mb-1">Final Score</div>
                            <div className="text-4xl font-bold text-amber-400">{score}</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Time</div>
                            <div className="text-xl font-mono font-bold text-white">{formatTime(time)}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Moves</div>
                            <div className="text-xl font-mono font-bold text-white">{moves}</div>
                        </div>
                    </div>

                    {/* Play Again */}
                    <button
                        onClick={onNewGame}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 active:scale-[0.98] transition-all text-lg"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
}
