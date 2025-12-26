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
                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
            );
        case 'diamonds':
            return (
                <svg viewBox="0 0 16 16" className={className} fill="currentColor">
                    <path d="M8 0L2 8l6 8 6-8-6-8z" />
                </svg>
            );
        case 'clubs':
            return (
                <svg viewBox="0 0 16 16" className={className} fill="currentColor">
                    <path d="M11.5 12.5a3.5 3.5 0 1 1-2.658-3.393c.27-.11.597-.19.894-.325a3.5 3.5 0 1 0-4.472 0c.297.135.624.215.894.325A3.5 3.5 0 1 1 4.5 12.5H6.1l-1.6 2.5h7l-1.6-2.5h1.6zM8 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
                </svg>
            );
        case 'spades':
            return (
                <svg viewBox="0 0 16 16" className={className} fill="currentColor">
                    <path d="M11 5a3 3 0 1 1-6 0c0-1.875 1.5-3.125 3-3.125s3 1.25 3 3.125c0 .807-.302 1.648-.841 2.43.537.782 1.184 1.489 1.83 2.116.653.637 1.285 1.114 1.708 1.42.051.037.091.066.121.088zm-3 10c.03-.022.07-.051.121-.088.423-.306 1.055-.783 1.708-1.42.646-.627 1.293-1.334 1.83-2.115.539-.783.841-1.624.841-2.431 0-1.875-1.562-3.125-3-3.125s-3 1.25-3 3.125c0 .807.302 1.648.841 2.43.537.782 1.184 1.489 1.83 2.116.653.637 1.285 1.114 1.708 1.42.051.037.091.066.121.088A.153.153 0 0 1 8 15zm0-15s3.5 4 3.5 7h-7c0-3 3.5-7 3.5-7z" />
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
                        <SuitIcon suit={card.suit} className="w-10 h-10 sm:w-16 sm:h-16 opacity-90" />
                    </div>

                    {/* Bottom right metadata */}
                    <div className={`absolute bottom-1 right-1.5 leading-none rotate-180 ${isRed ? 'text-[#e11d48]' : 'text-[#111111]'} flex flex-col items-center`}>
                        <div className="text-base sm:text-xl font-bold tracking-tight">{rank}</div>
                        <SuitIcon suit={card.suit} className="w-3.5 h-3.5 mt-0.5" />
                    </div>
                </div>

                {/* Premium Gold/Silver inner frame (Very subtle) */}
                <div className="absolute inset-[3px] rounded-[6px] border border-black/5 pointer-events-none opacity-40" />

                {/* Enhanced Hint aura - Maximum visibility */}
                {isHint && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[#d4a533]/30 animate-pulse rounded-[var(--card-radius)]" />
                        <div className="absolute inset-[-4px] border-2 border-[#d4a533] rounded-[12px] animate-bounce shadow-[0_0_15px_rgba(212,165,51,0.6)]" />
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
