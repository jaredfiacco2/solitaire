import type { Card as CardType } from '../../types/game';
import { Card, EmptyPile } from './Card';

interface TableauProps {
    piles: [CardType[], CardType[], CardType[], CardType[], CardType[], CardType[], CardType[]];
    onCardClick?: (card: CardType, pileIndex: number, cardIndex: number) => void;
    onCardDoubleClick?: (card: CardType, pileIndex: number, cardIndex: number) => void;
    validDropTargets?: number[];
    isHintCard?: (cardId: string) => boolean;
    isJustMoved?: (cardId: string) => boolean;
    isDealing?: boolean;
}

export function Tableau({
    piles,
    onCardClick,
    onCardDoubleClick,
    validDropTargets = [],
    isHintCard,
    isJustMoved,
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

                                const offsetVar = card.faceUp ? 'var(--tableau-offset-up)' : 'var(--tableau-offset-down)';

                                return (
                                    <div
                                        key={card.id}
                                        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isDealing ? 'animate-fly-in' : ''}`}
                                        style={{
                                            marginTop: cardIndex === 0 ? 0 : `calc(-1 * (var(--card-height) - ${offsetVar}))`,
                                            zIndex: cardIndex,
                                            animationDelay: isDealing ? `${(pileIndex * 0.08) + (cardIndex * 0.04)}s` : undefined,
                                            willChange: 'transform, margin-top'
                                        }}
                                    >
                                        <Card
                                            card={card}
                                            isTopCard={isTopCard}
                                            isHint={isHintCard?.(card.id) ?? false}
                                            isJustMoved={isJustMoved?.(card.id) ?? false}
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
