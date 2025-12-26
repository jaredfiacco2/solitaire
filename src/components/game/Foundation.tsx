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
        <div className="flex gap-1 sm:gap-2">
            {piles.map((pile, index) => (
                <div key={index} className="relative">
                    {pile.length === 0 ? (
                        <EmptyPile
                            type="foundation"
                            isValidTarget={validDropTargets.includes(index)}
                            suitHint={SUIT_HINTS[index]}
                        />
                    ) : (
                        <div className="relative">
                            <Card
                                card={pile[pile.length - 1]}
                                onClick={() => onCardClick?.(pile[pile.length - 1], index)}
                                isTopCard
                            />
                            {/* Card count badge - Premium gold style */}
                            {pile.length > 1 && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d4a533] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                    {pile.length}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
