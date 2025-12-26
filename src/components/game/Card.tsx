import { useState } from 'react';
import type { Card as CardType, Suit } from '../../types/game';
import { getRankDisplay, getCardColor } from '../../utils/deck';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    onDoubleClick?: () => void;
    isTopCard?: boolean;
    isHint?: boolean;
    className?: string;
}

const SuitIcon = ({ suit, className = "" }: { suit: Suit, className?: string }) => {
    switch (suit) {
        case 'hearts':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            );
        case 'diamonds':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                    <path d="M12 2L4.5 12 12 22l7.5-10L12 2z" />
                </svg>
            );
        case 'clubs':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                    <path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2.1 3.5 1.7.3 3.1 1.6 3.1 3.5 0 2.2-1.8 4-4 4-1.1 0-2.1-.4-2.8-1.2L9 19.5v-2c0-.3.1-.5.3-.7l.7-.7c.3-.3.3-.8 0-1.1s-.8-.3-1.1 0l-.7.7c-.2.2-.4.3-.7.3h-2c-.5 0-1-.4-1-1s.4-1 1-1h2c.3 0 .5-.1.7-.3l.7-.7c.3-.3.3-.8 0-1.1s-.8-.3-1.1 0l-.7.7c-.2.2-.4.3-.7.3h-2C4.1 16 3 14.9 3 13.5c0-1.9 1.4-3.2 3.1-3.5-1.3-.7-2.1-2.1-2.1-3.5 0-2.2 1.8-4 4-4s4 1.8 4 4c0 .3 0 .7-.1 1H12V2zm0 15v3h1v-3h-1z" />
                </svg>
            );
        case 'spades':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                    <path d="M12 2C9 2 4 10 4 13c0 2.2 1.8 4 4 4s4-1.8 4-4v-1h.1c0 2.2 1.8 4 4 4s4-1.8 4-4c0-3-5-11-8-11zm0 15v3h1v-3h-1z" />
                </svg>
            );
        default:
            return null;
    }
};

export function Card({
    card,
    onClick,
    onDoubleClick,
    isTopCard = true,
    isHint = false,
    className = '',
}: CardProps) {
    const color = getCardColor(card);
    const rank = getRankDisplay(card.rank);
    const isRed = color === 'red';

    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isTopCard) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xRotation = ((y - rect.height / 2) / rect.height) * 12;
        const yRotation = ((x - rect.width / 2) / rect.width) * -12;
        setTilt({ x: xRotation, y: yRotation });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    if (!card.faceUp) {
        return (
            <div className="perspective-1000">
                <div
                    className={`
                        card-base card-transition card-container relative cursor-pointer overflow-hidden
                        bg-gradient-to-br from-[#0c1231] via-[#05081a] to-[#0c1231]
                        ${isTopCard ? 'card-hoverable' : ''}
                        ${className}
                    `}
                    onClick={onClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: isTopCard ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined
                    }}
                >
                    {/* Silver Precision Border */}
                    <div className="absolute inset-0 border border-white/10 rounded-[var(--card-radius)] pointer-events-none" />

                    {/* Inner Decorative Silk Frame */}
                    <div className="absolute inset-[4px] rounded-[6px] border border-[#d4a533]/20 pointer-events-none" />
                    <div className="absolute inset-[5px] rounded-[5px] border border-[#d4a533]/10 pointer-events-none" />

                    {/* Premium Geometric Center Emblem */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                            {/* Outer Diamond */}
                            <div className="absolute inset-0 rotate-45 border border-[#d4a533]/40 rounded-sm" />
                            {/* Inner Diamond */}
                            <div className="absolute inset-2 rotate-45 bg-[#d4a533]/10 border border-[#d4a533]/20" />
                            {/* Center Star/Dot */}
                            <div className="w-2.5 h-2.5 bg-[#d4a533]/60 rounded-full shadow-[0_0_8px_rgba(212,165,51,0.4)]" />
                        </div>
                    </div>

                    {/* Corner Guilloché Accents */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#d4a533]/40" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#d4a533]/40" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#d4a533]/40" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#d4a533]/40" />

                    {/* Silk Shimmer Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-40 mix-blend-overlay" />
                </div>
            </div>
        );
    }

    return (
        <div className="perspective-1000">
            <div
                className={`
                    card-base card-transition card-face-material card-container relative cursor-pointer
                    bg-gradient-to-br from-[#ffffff] via-[#fdfcf9] to-[#f5f2e8]
                    overflow-hidden touch-manipulation
                    ${isTopCard ? 'card-hoverable' : ''}
                    ${isHint ? 'ring-[2.5px] ring-[#d4a533] ring-offset-2 ring-offset-transparent animate-pulse shadow-[0_0_25px_rgba(212,165,51,0.5)]' : ''}
                    ${className}
                `}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    transform: isTopCard ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined
                } as React.CSSProperties}
            >
                {/* Invisible interaction layer */}
                <div className="absolute inset-0 z-10" />

                {/* Inner Beveled Highlight (Structural depth) */}
                <div className="absolute inset-0 border-[0.5px] border-black/5 rounded-[var(--card-radius)] pointer-events-none" />
                <div className="absolute inset-[0.5px] border-[0.5px] border-white/60 rounded-[var(--card-radius)] pointer-events-none" />

                <div className="absolute inset-0 p-1 sm:p-1.5 pointer-events-none select-none">
                    {/* Top left metadata */}
                    <div className={`absolute top-1 left-1.5 sm:top-1.5 sm:left-2 leading-none ${isRed ? 'text-[#c4151c]' : 'text-[#111111]'}`}>
                        <div className="text-xs sm:text-sm lg:text-[1.1rem] font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>{rank}</div>
                        <SuitIcon suit={card.suit} className="w-3 h-3 sm:w-4.5 sm:h-4.5 mt-0.5" />
                    </div>

                    {/* Center focus suit - physical etching style */}
                    <div className={`absolute inset-0 flex items-center justify-center ${isRed ? 'text-[#c4151c]' : 'text-[#111111]'}`}>
                        <SuitIcon suit={card.suit} className="w-7 h-7 sm:w-11 sm:h-11 lg:w-14 lg:h-14 opacity-[0.88] drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]" />
                    </div>

                    {/* Bottom right metadata */}
                    <div className={`absolute bottom-1 right-1.5 sm:bottom-1.5 sm:right-2 leading-none rotate-180 ${isRed ? 'text-[#c4151c]' : 'text-[#111111]'}`}>
                        <div className="text-xs sm:text-sm lg:text-[1.1rem] font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>{rank}</div>
                        <SuitIcon suit={card.suit} className="w-3 h-3 sm:w-4.5 sm:h-4.5 mt-0.5" />
                    </div>
                </div>

                {/* Premium Gold/Silver inner frame (Very subtle) */}
                <div className="absolute inset-[3px] rounded-[7px] border border-black/5 pointer-events-none opacity-40" />

                {/* Hint aura */}
                {isHint && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4a533]/5 to-transparent pointer-events-none" />
                )}
            </div>
        </div>
    );
}

export function EmptyPile({
    type,
    onClick,
    isValidTarget = false,
    isHint = false,
    suitHint,
    className = ''
}: {
    type: 'foundation' | 'tableau' | 'stock';
    onClick?: () => void;
    isValidTarget?: boolean;
    isHint?: boolean;
    suitHint?: Suit;
    className?: string;
}) {
    return (
        <div
            className={`
                card-base relative
                border-2 border-dashed
                flex items-center justify-center
                transition-all duration-300
                ${type === 'foundation'
                    ? 'border-[#d4a533]/30 bg-[#d4a533]/5'
                    : type === 'stock'
                        ? 'border-white/15 bg-white/5 cursor-pointer hover:bg-white/10 active:scale-95'
                        : 'border-white/10 bg-white/[0.02]'}
                ${isValidTarget ? 'border-[#d4a533]/60 bg-[#d4a533]/10 shadow-lg shadow-[#d4a533]/20' : ''}
                ${isHint ? 'ring-2 ring-[#d4a533] animate-pulse' : ''}
                ${className}
            `}
            onClick={onClick}
        >
            {type === 'foundation' && (
                <div className="text-[#d4a533]/30 flex flex-col items-center">
                    {suitHint ? (
                        <SuitIcon suit={suitHint} className="w-6 h-6 sm:w-8 sm:h-8 opacity-40" />
                    ) : (
                        <span className="text-lg sm:text-2xl font-serif">A</span>
                    )}
                </div>
            )}
            {type === 'stock' && (
                <div className="flex flex-col items-center text-white/30">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            )}
        </div>
    );
}
