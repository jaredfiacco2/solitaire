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
    '#d4a533', '#ffd700', // Gold tones
    '#1a237e', '#3949ab', // Navy tones
    '#c41e3a', // Card red
    '#ffffff', // White
    '#b8860b', // Dark gold
];

export function WinCelebration({ onNewGame, time, moves, score }: WinCelebrationProps) {
    const [showModal, setShowModal] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    const particles = useMemo(() => {
        const result: Particle[] = [];

        // Confetti particles
        for (let i = 0; i < 80; i++) {
            result.push({
                id: i,
                x: Math.random() * 100,
                y: -15 - Math.random() * 10,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 2.5,
                size: 6 + Math.random() * 8,
                type: 'confetti',
                rotation: Math.random() * 360,
            });
        }

        // Sparkle particles
        for (let i = 80; i < 110; i++) {
            result.push({
                id: i,
                x: 5 + Math.random() * 90,
                y: 5 + Math.random() * 90,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 4,
                size: 3 + Math.random() * 6,
                type: 'sparkle',
                rotation: 0,
            });
        }

        // Firework bursts
        for (let i = 110; i < 125; i++) {
            result.push({
                id: i,
                x: 15 + Math.random() * 70,
                y: 15 + Math.random() * 50,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                delay: Math.random() * 2,
                size: 30 + Math.random() * 40,
                type: 'firework',
                rotation: 0,
            });
        }

        return result;
    }, []);

    useEffect(() => {
        const modalTimer = setTimeout(() => setShowModal(true), 300);
        const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

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
        if (score >= 700 && time < 180) return { text: 'Legendary', color: 'text-[#ffd700]', subtext: 'Masterful play' };
        if (score >= 500 && time < 300) return { text: 'Excellent', color: 'text-[#d4a533]', subtext: 'Impressive victory' };
        if (score >= 300) return { text: 'Great', color: 'text-white', subtext: 'Well played' };
        return { text: 'Victory', color: 'text-white/80', subtext: 'Game complete' };
    };

    const rating = getRating();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500 ${showModal ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Particles */}
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
                                height: p.size * 0.5,
                                backgroundColor: p.color,
                                borderRadius: '1px',
                                animationDelay: `${p.delay}s`,
                                transform: `rotate(${p.rotation}deg)`,
                            }}
                        />
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
                                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                            }}
                        />
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
                                border: `2px solid ${p.color}`,
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
                    bg-gradient-to-b from-[#18181f] via-[#12121a] to-[#0a0a0f]
                    border border-[#d4a533]/30 rounded-2xl
                    shadow-2xl shadow-[#d4a533]/20
                    transform transition-all duration-500 ease-out
                    ${showModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'}
                `}
            >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4a533]/20 via-[#ffd700]/10 to-[#d4a533]/20 rounded-2xl blur-xl opacity-50" />

                <div className="relative p-6 sm:p-8">
                    {/* Trophy/Crown Icon - SVG, not emoji */}
                    <div className="flex justify-center mb-5">
                        <div className="relative">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#d4a533] via-[#ffd700] to-[#b8860b] flex items-center justify-center shadow-xl shadow-[#d4a533]/30">
                                {/* Crown SVG Icon */}
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-[#ffd700]/30 animate-ping" style={{ animationDuration: '2s' }} />
                        </div>
                    </div>

                    {/* Rating */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        <span className={rating.color}>{rating.text}</span>
                    </h2>
                    <p className="text-white/40 text-center text-sm mb-6">{rating.subtext}</p>

                    {/* Score highlight */}
                    <div className="bg-gradient-to-r from-[#d4a533]/15 via-[#ffd700]/20 to-[#d4a533]/15 rounded-xl p-4 mb-4 border border-[#d4a533]/25">
                        <div className="text-center">
                            <div className="text-[#d4a533]/60 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Final Score</div>
                            <div className="text-4xl font-bold text-[#ffd700]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{score}</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Time</div>
                            <div className="text-xl font-mono font-semibold text-white">{formatTime(time)}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Moves</div>
                            <div className="text-xl font-mono font-semibold text-white">{moves}</div>
                        </div>
                    </div>

                    {/* Play Again Button */}
                    <button
                        onClick={onNewGame}
                        className="w-full py-4 bg-gradient-to-r from-[#8b6914] via-[#b8860b] to-[#8b6914] hover:from-[#b8860b] hover:via-[#d4a533] hover:to-[#b8860b] text-white font-semibold rounded-xl shadow-lg shadow-[#d4a533]/30 active:scale-[0.98] transition-all text-lg border border-[#d4a533]/50"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
}
