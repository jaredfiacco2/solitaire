import type { Card as CardType } from '../../types/game';
import { getRankDisplay, getSuitSymbol, getCardColor } from '../../utils/deck';

interface CardProps {
    card: CardType;
    onClick?: () => void;
    onDoubleClick?: () => void;
    isTopCard?: boolean;
    isHint?: boolean;
    className?: string;
}

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
    const suit = getSuitSymbol(card.suit);
    const isRed = color === 'red';

    if (!card.faceUp) {
        return (
            <div
                className={`
                    card-base card-transition relative cursor-pointer select-none no-select
                    bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900
                    border border-blue-500/50
                    overflow-hidden
                    ${isTopCard ? 'card-hoverable' : ''}
                    ${className}
                `}
                onClick={onClick}
            >
                {/* Ornate pattern */}
                <div className="absolute inset-[3px] rounded-[4px] border border-blue-400/30" />
                <div className="absolute inset-[6px] rounded-[3px] border border-blue-400/20" />

                {/* Center diamond */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rotate-45 bg-gradient-to-br from-blue-400/30 to-blue-600/30 border border-blue-400/40" />
                </div>

                {/* Corner dots */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-blue-400/40" />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-400/40" />
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-blue-400/40" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-400/40" />

                <div className="absolute inset-0 opacity-10 shimmer" />
            </div>
        );
    }

    return (
        <div
            className={`
                card-base card-transition relative cursor-pointer select-none no-select
                bg-gradient-to-br from-amber-50 via-white to-amber-100
                border border-amber-200/80
                overflow-hidden
                ${isTopCard ? 'card-hoverable' : ''}
                ${isHint ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent animate-pulse shadow-lg shadow-yellow-400/50' : ''}
                ${className}
            `}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <div className="absolute inset-0 p-0.5 sm:p-1">
                {/* Top left */}
                <div className={`absolute top-0.5 left-1 sm:top-1 sm:left-1.5 leading-none ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
                    <div className="text-[10px] sm:text-xs lg:text-sm font-bold font-serif">{rank}</div>
                    <div className="text-[10px] sm:text-sm lg:text-base -mt-0.5">{suit}</div>
                </div>

                {/* Center suit */}
                <div className={`absolute inset-0 flex items-center justify-center ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
                    <span className="text-xl sm:text-3xl lg:text-4xl opacity-90 drop-shadow-sm">{suit}</span>
                </div>

                {/* Bottom right */}
                <div className={`absolute bottom-0.5 right-1 sm:bottom-1 sm:right-1.5 leading-none rotate-180 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
                    <div className="text-[10px] sm:text-xs lg:text-sm font-bold font-serif">{rank}</div>
                    <div className="text-[10px] sm:text-sm lg:text-base -mt-0.5">{suit}</div>
                </div>
            </div>

            <div className="absolute inset-[2px] rounded-[4px] border border-amber-300/30 pointer-events-none" />

            {/* Hint glow overlay */}
            {isHint && (
                <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none" />
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
    suitHint?: string;
    className?: string;
}) {
    return (
        <div
            className={`
                card-base relative
                border-2 border-dashed
                flex items-center justify-center
                transition-all duration-200
                ${type === 'foundation'
                    ? 'border-emerald-500/40 bg-emerald-900/20'
                    : type === 'stock'
                        ? 'border-white/20 bg-white/5 cursor-pointer hover:bg-white/10 active:scale-95'
                        : 'border-white/15 bg-white/5'}
                ${isValidTarget ? 'foundation-highlight border-emerald-400' : ''}
                ${isHint ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
                ${className}
            `}
            onClick={onClick}
        >
            {type === 'foundation' && (
                <span className="text-emerald-400/50 text-lg sm:text-2xl font-serif">
                    {suitHint || 'A'}
                </span>
            )}
            {type === 'stock' && (
                <div className="flex flex-col items-center text-white/40">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            )}
        </div>
    );
}
