import type { Card as CardType } from '../../types/game';
import { Card, EmptyPile } from './Card';

interface StockWasteProps {
    stock: CardType[];
    waste: CardType[];
    drawMode: 1 | 3;
    onStockClick: () => void;
    onWasteCardClick?: (card: CardType) => void;
    onWasteCardDoubleClick?: (card: CardType) => void;
    isHintCard?: (cardId: string) => boolean;
    isStockHint?: boolean;
}

export function StockWaste({
    stock,
    waste,
    drawMode,
    onStockClick,
    onWasteCardClick,
    onWasteCardDoubleClick,
    isHintCard,
    isStockHint = false,
}: StockWasteProps) {
    const visibleWaste = drawMode === 3 ? waste.slice(-3) : waste.slice(-1);

    return (
        <div className="flex gap-2 sm:gap-3">
            {/* Stock pile */}
            <div className="relative">
                {stock.length === 0 ? (
                    <EmptyPile type="stock" onClick={onStockClick} isHint={isStockHint} />
                ) : (
                    <div
                        onClick={onStockClick}
                        className={`cursor-pointer relative ${isStockHint ? 'animate-pulse' : ''}`}
                    >
                        {stock.length > 2 && (
                            <div className="absolute left-[2px] top-[2px] card-base bg-blue-800 border border-blue-600/30 opacity-60" />
                        )}
                        {stock.length > 1 && (
                            <div className="absolute left-[1px] top-[1px] card-base bg-blue-700 border border-blue-500/30 opacity-80" />
                        )}
                        <Card card={stock[stock.length - 1]} isTopCard isHint={isStockHint} />

                        <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg border border-blue-400/50">
                            {stock.length}
                        </div>
                    </div>
                )}
            </div>

            {/* Waste pile */}
            <div className="relative" style={{ minWidth: 'var(--card-width-mobile)' }}>
                {visibleWaste.length === 0 ? (
                    <div className="card-base" />
                ) : (
                    <div className="relative">
                        {visibleWaste.map((card, idx) => {
                            const isLast = idx === visibleWaste.length - 1;
                            const offset = drawMode === 3 ? idx * 14 : 0;

                            return (
                                <div
                                    key={card.id}
                                    className="absolute top-0"
                                    style={{
                                        left: offset,
                                        zIndex: idx,
                                    }}
                                >
                                    <Card
                                        card={card}
                                        isTopCard={isLast}
                                        isHint={isLast && isHintCard?.(card.id)}
                                        onClick={isLast ? () => onWasteCardClick?.(card) : undefined}
                                        onDoubleClick={isLast ? () => onWasteCardDoubleClick?.(card) : undefined}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
