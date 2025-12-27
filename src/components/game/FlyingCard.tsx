import { memo } from 'react';
import type { Card as CardType, Suit } from '../../types/game';
import { getRankDisplay, getCardColor } from '../../utils/deck';

interface FlyingCardProps {
    card: CardType;
    fromRect: DOMRect;
    toRect: DOMRect;
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

export const FlyingCard = memo(function FlyingCard({ card, fromRect, toRect }: FlyingCardProps) {
    const color = getCardColor(card);
    const rank = getRankDisplay(card.rank);
    const isRed = color === 'red';

    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;

    return (
        <div
            className="fixed z-[1000] pointer-events-none"
            style={{
                left: fromRect.left,
                top: fromRect.top,
                width: fromRect.width,
                height: fromRect.height,
                animation: 'fly-card 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                '--fly-x': `${deltaX}px`,
                '--fly-y': `${deltaY}px`,
            } as React.CSSProperties}
        >
            <div
                className={`
          w-full h-full rounded-[var(--card-radius)] relative cursor-pointer
          bg-gradient-to-br from-[#ffffff] via-[#fdfcf9] to-[#f5f2e8]
          overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]
          border border-black/10
        `}
            >
                <div className="absolute inset-0 p-1 sm:p-1.5 pointer-events-none select-none">
                    {/* Top left metadata */}
                    <div className={`absolute top-1 left-1.5 leading-none ${isRed ? 'text-[#e11d48]' : 'text-[#111111]'} flex flex-col items-center`}>
                        <div className="text-base sm:text-xl font-bold tracking-tight">{rank}</div>
                        <SuitIcon suit={card.suit} className="w-3.5 h-3.5 mt-0.5" />
                    </div>

                    {/* Center suit icon */}
                    <div className={`absolute inset-0 flex items-center justify-center ${isRed ? 'text-[#e11d48]' : 'text-[#111111]'}`}>
                        <SuitIcon suit={card.suit} className="w-7 h-7 sm:w-10 sm:h-10 opacity-90" />
                    </div>

                    {/* Bottom right metadata */}
                    <div className={`absolute bottom-1 right-1.5 leading-none rotate-180 ${isRed ? 'text-[#e11d48]' : 'text-[#111111]'} flex flex-col items-center`}>
                        <div className="text-base sm:text-xl font-bold tracking-tight">{rank}</div>
                        <SuitIcon suit={card.suit} className="w-3.5 h-3.5 mt-0.5" />
                    </div>
                </div>
            </div>
        </div>
    );
});
