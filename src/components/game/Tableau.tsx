import type { Card as CardType } from '../../types/game';
import { Card, EmptyPile } from './Card';

interface TableauProps {
    piles: [CardType[], CardType[], CardType[], CardType[], CardType[], CardType[], CardType[]];
    onCardClick?: (card: CardType, pileIndex: number, cardIndex: number) => void;
    onCardDoubleClick?: (card: CardType, pileIndex: number, cardIndex: number) => void;
    validDropTargets?: number[];
    isHintCard?: (cardId: string) => boolean;
    isDealing?: boolean;
}

export function Tableau({
    piles,
    onCardClick,
    onCardDoubleClick,
    validDropTargets = [],
    isHintCard,
    isDealing,
}: TableauProps) {
    return (
        <div className="flex gap-1 sm:gap-2 lg:gap-3 justify-center w-full px-1">
            {piles.map((pile, pileIndex) => (
                <div
                    key={pileIndex}
                    className="flex flex-col min-w-0 flex-1 max-w-[75px] lg:max-w-[85px]"
                >
                    {pile.length === 0 ? (
                        <EmptyPile
                            type="tableau"
                            isValidTarget={validDropTargets.includes(pileIndex)}
                        />
                    ) : (
                        <div className="relative">
                            {pile.map((card, cardIndex) => {
                                const isTopCard = cardIndex === pile.length - 1;
                                const canInteract = card.faceUp;

                                const faceDownOffset = 6;
                                const faceUpOffset = 18;
                                const offset = cardIndex === 0 ? 0 :
                                    (card.faceUp ? faceUpOffset : faceDownOffset);

                                return (
                                    <div
                                        key={card.id}
                                        className={`relative ${isDealing ? 'animate-fly-in' : ''}`}
                                        style={{
                                            marginTop: cardIndex === 0 ? 0 : `-${66 - offset}px`,
                                            zIndex: cardIndex,
                                            animationDelay: isDealing ? `${(pileIndex * 0.1) + (cardIndex * 0.05)}s` : undefined,
                                        }}
                                    >
                                        <Card
                                            card={card}
                                            isTopCard={isTopCard}
                                            isHint={isHintCard?.(card.id) ?? false}
                                            onClick={canInteract ? () => onCardClick?.(card, pileIndex, cardIndex) : undefined}
                                            onDoubleClick={canInteract && isTopCard ? () => onCardDoubleClick?.(card, pileIndex, cardIndex) : undefined}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
