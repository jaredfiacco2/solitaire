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
                <svg viewBox="0 0 16 16" className={className} fill="currentColor">
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
                </svg>
            );
        case 'diamonds':
            return (
                <svg viewBox="0 0 16 16" className={className} fill="currentColor">
                    <path d="M2.45 7.4 7.2 1.067a1 1 0 0 1 1.6 0L13.55 7.4a1 1 0 0 1 0 1.2L8.8 14.933a1 1 0 0 1-1.6 0L2.45 8.6a1 1 0 0 1 0-1.2" />
                </svg>
            );
        case 'clubs':
            return (
                <svg viewBox="0 0 16 16" className={className} fill="currentColor">
                    <path d="M11.5 12.5a3.5 3.5 0 0 1-2.684-1.254 20 20 0 0 0 1.582 2.907c.231.35-.02.847-.438.847H6.04c-.419 0-.67-.497-.438-.847a20 20 0 0 0 1.582-2.907 3.5 3.5 0 1 1-2.538-5.743 3.5 3.5 0 1 1 6.708 0A3.5 3.5 0 1 1 11.5 12.5" />
                </svg>
            );
        case 'spades':
            return (
                <svg viewBox="0 0 16 16" className={className} fill="currentColor">
                    <path d="M7.184 11.246A3.5 3.5 0 0 1 1 9c0-1.602 1.14-2.633 2.66-4.008C4.986 3.792 6.602 2.33 8 0c1.398 2.33 3.014 3.792 4.34 4.992C13.86 6.367 15 7.398 15 9a3.5 3.5 0 0 1-6.184 2.246 20 20 0 0 0 1.582 2.907c.231.35-.02.847-.438.847H6.04c-.419 0-.67-.497-.438-.847a20 20 0 0 0 1.582-2.907" />
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
                    ${isHint ? 'ring-4 ring-[#d4a533] ring-offset-4 ring-offset-transparent shadow-[0_0_40px_rgba(212,165,51,0.7)] scale-105 z-50' : ''}
                    ${className}
                `}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    transform: isTopCard ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                } as React.CSSProperties}
            >
                {/* Invisible interaction layer */}
                <div className="absolute inset-0 z-10" />

                {/* Inner Beveled Highlight (Structural depth) */}
                <div className="absolute inset-0 border-[0.5px] border-black/5 rounded-[var(--card-radius)] pointer-events-none" />
                <div className="absolute inset-[0.5px] border-[0.5px] border-white/60 rounded-[var(--card-radius)] pointer-events-none" />

                <div className="absolute inset-0 p-1 sm:p-1.5 pointer-events-none select-none">
                    {/* Top left metadata */}
                    <div className={`absolute top-1 left-1.5 leading-none ${isRed ? 'text-[#e11d48]' : 'text-[#111111]'} flex flex-col items-center`}>
                        <div className="text-base sm:text-xl font-bold tracking-tight">{rank}</div>
                        <SuitIcon suit={card.suit} className="w-3.5 h-3.5 mt-0.5" />
                    </div>

                    {/* Center focus - Simple Regular Card Pip */}
                    <div className={`absolute inset-0 flex items-center justify-center ${isRed ? 'text-[#e11d48]' : 'text-[#111111]'}`}>
                        <SuitIcon suit={card.suit} className="w-7 h-7 sm:w-10 sm:h-10 opacity-90" />
                    </div>

                    {/* Bottom right metadata */}
                    <div className={`absolute bottom-1 right-1.5 leading-none rotate-180 ${isRed ? 'text-[#e11d48]' : 'text-[#111111]'} flex flex-col items-center`}>
                        <div className="text-base sm:text-xl font-bold tracking-tight">{rank}</div>
                        <SuitIcon suit={card.suit} className="w-3.5 h-3.5 mt-0.5" />
                    </div>
                </div>

                {/* Premium Gold/Silver inner frame (Very subtle) */}
                <div className="absolute inset-[3px] rounded-[6px] border border-black/5 pointer-events-none opacity-40" />

                {/* Enhanced Hint aura - MAXIMUM visibility */}
                {isHint && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[#d4a533]/40 animate-pulse rounded-[var(--card-radius)]" />
                        <div className="absolute inset-[-6px] border-4 border-[#d4a533] rounded-[14px] animate-pulse shadow-[0_0_30px_rgba(212,165,51,0.8),0_0_60px_rgba(212,165,51,0.4)]" />
                        <div className="absolute inset-0 rounded-[var(--card-radius)] ring-4 ring-[#d4a533] ring-offset-4 ring-offset-transparent" />
                    </div>
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
                !bg-transparent !bg-none
                ${type === 'foundation'
                    ? 'border-[#d4a533]/40'
                    : type === 'stock'
                        ? 'border-white/20 cursor-pointer hover:bg-white/5 active:scale-95'
                        : 'border-white/20'}
                ${isValidTarget ? 'border-[#d4a533]/80 !bg-[#d4a533]/10 shadow-lg shadow-[#d4a533]/30 scale-105' : ''}
                ${isHint ? 'ring-4 ring-[#d4a533] ring-offset-2 ring-offset-black animate-pulse shadow-[0_0_30px_rgba(212,165,51,0.6)]' : ''}
                ${className}
            `}
            onClick={onClick}
            style={{ backgroundColor: 'transparent', backgroundImage: 'none' }}
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
            {type === 'stock' && null /* Empty stock shows just the outline, no icon */}
        </div>
    );
}
