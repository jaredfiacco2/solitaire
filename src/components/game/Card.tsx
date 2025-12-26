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

    if (!card.faceUp) {
        return (
            <div
                className={`
                    card-base card-transition relative cursor-pointer select-none no-select
                    bg-gradient-to-br from-[#1a237e] via-[#0d1442] to-[#1a237e]
                    border border-[#3949ab]/40
                    overflow-hidden
                    ${isTopCard ? 'card-hoverable' : ''}
                    ${className}
                `}
                onClick={onClick}
            >
                {/* Outer border - elegant double line effect */}
                <div className="absolute inset-[2px] rounded-[6px] border border-[#3949ab]/30" />

                {/* Inner decorative frame */}
                <div className="absolute inset-[5px] rounded-[4px] border border-[#3949ab]/20" />

                {/* Premium geometric center pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                        {/* Diamond shape */}
                        <div className="absolute inset-0 rotate-45 border-2 border-[#d4a533]/40 rounded-sm" />
                        {/* Inner diamond */}
                        <div className="absolute inset-2 rotate-45 border border-[#d4a533]/25 rounded-sm" />
                        {/* Center dot */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#d4a533]/30" />
                        </div>
                    </div>
                </div>

                {/* Corner accents - small gold dots */}
                <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[#d4a533]/40" />
                <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#d4a533]/40" />
                <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-[#d4a533]/40" />
                <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-[#d4a533]/40" />

                {/* Subtle shimmer overlay */}
                <div className="absolute inset-0 opacity-5 shimmer" />
            </div>
        );
    }

    return (
        <div
            className={`
                card-base card-transition relative cursor-pointer select-none
                bg-gradient-to-br from-[#faf8f5] via-[#fffefa] to-[#f5f0e8]
                border border-[#e8e0d0]
                overflow-hidden touch-manipulation
                ${isTopCard ? 'card-hoverable' : ''}
                ${isHint ? 'ring-2 ring-[#d4a533] ring-offset-2 ring-offset-transparent animate-pulse shadow-lg shadow-[#d4a533]/30' : ''}
                ${className}
            `}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
        >
            {/* Invisible click layer to prevent text selection */}
            <div className="absolute inset-0 z-10" />

            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] pointer-events-none" />

            <div className="absolute inset-0 p-0.5 sm:p-1 pointer-events-none">
                {/* Top left corner */}
                <div className={`absolute top-0.5 left-1 sm:top-1 sm:left-1.5 leading-none ${isRed ? 'text-[#c41e3a]' : 'text-[#1a1a1a]'}`}>
                    <div className="text-xs sm:text-sm lg:text-base font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{rank}</div>
                    <SuitIcon suit={card.suit} className="w-2.5 h-2.5 sm:w-4 sm:h-4 mt-0.5 opacity-90" />
                </div>

                {/* Center suit - premium styling */}
                <div className={`absolute inset-0 flex items-center justify-center ${isRed ? 'text-[#c41e3a]' : 'text-[#1a1a1a]'}`}>
                    <SuitIcon suit={card.suit} className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-80" />
                </div>

                {/* Bottom right corner */}
                <div className={`absolute bottom-0.5 right-1 sm:bottom-1 sm:right-1.5 leading-none rotate-180 ${isRed ? 'text-[#c41e3a]' : 'text-[#1a1a1a]'}`}>
                    <div className="text-xs sm:text-sm lg:text-base font-semibold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{rank}</div>
                    <SuitIcon suit={card.suit} className="w-2.5 h-2.5 sm:w-4 sm:h-4 mt-0.5 opacity-90" />
                </div>
            </div>

            {/* Premium inner border */}
            <div className="absolute inset-[2px] rounded-[6px] border border-[#d4c4a8]/40 pointer-events-none" />

            {/* Hint glow overlay */}
            {isHint && (
                <div className="absolute inset-0 bg-[#d4a533]/10 pointer-events-none" />
            )}
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
