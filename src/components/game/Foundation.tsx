import type { Card as CardType, Suit } from '../../types/game';
import { Card, EmptyPile } from './Card';

interface FoundationProps {
    piles: [CardType[], CardType[], CardType[], CardType[]];
    onCardClick?: (card: CardType, pileIndex: number) => void;
    validDropTargets?: number[];
}

const SUIT_HINTS: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

export function Foundation({
    piles,
    onCardClick,
    validDropTargets = [],
}: FoundationProps) {
    return (
        <div className="flex gap-2 sm:gap-3">
            {piles.map((pile, index) => (
                <div key={index} className="relative group">
                    {pile.length === 0 ? (
                        <EmptyPile
                            type="foundation"
                            isValidTarget={validDropTargets.includes(index)}
                            suitHint={SUIT_HINTS[index]}
                        />
                    ) : (
                        <div className="relative transition-transform duration-300 hover:translate-y-[-2px] active:translate-y-[1px]">
                            <Card
                                card={pile[pile.length - 1]}
                                onClick={() => onCardClick?.(pile[pile.length - 1], index)}
                                isTopCard
                            />
                            {/* Imperial Progression Badge */}
                            <div className="absolute -bottom-2 -right-2 min-w-[20px] h-5 px-1 bg-gradient-to-br from-[#d4a533] to-[#b8860b] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_4px_8px_rgba(212,165,51,0.3)] border border-white/20 select-none">
                                {pile.length}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
