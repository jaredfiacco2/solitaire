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
    isDealing?: boolean;
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
    isDealing = false,
}: StockWasteProps) {
    const visibleWaste = drawMode === 3 ? waste.slice(-3) : waste.slice(-1);

    return (
        <div className="flex gap-4 sm:gap-8">
            {/* Standard Stock Pile */}
            <div className="relative group">
                {stock.length === 0 ? (
                    <EmptyPile type="stock" onClick={onStockClick} isHint={isStockHint} />
                ) : (
                    <div
                        onClick={onStockClick}
                        className={`cursor-pointer relative transition-transform duration-200 active:translate-y-[1px] ${isStockHint ? 'animate-pulse' : ''} ${isDealing ? 'animate-fly-in' : ''}`}
                    >
                        {/* Stack Materiality - Simple Borders */}
                        {stock.length > 2 && (
                            <div className="absolute left-[2px] top-[2px] w-full h-full rounded-[6px] bg-white border border-black/10" />
                        )}
                        {stock.length > 1 && (
                            <div className="absolute left-[1px] top-[1px] w-full h-full rounded-[6px] bg-white border border-black/10" />
                        )}
                        <Card card={stock[stock.length - 1]} isTopCard isHint={isStockHint} />

                        {/* Standard Count Badge */}
                        <div className="absolute -bottom-2 -right-2 min-w-[20px] h-5 px-1 bg-black/80 text-white text-[10px] font-bold rounded flex items-center justify-center border border-white/20 select-none">
                            {stock.length}
                        </div>
                    </div>
                )}
            </div>

            {/* Imperial Waste Trail */}
            <div className="relative" style={{ minWidth: 'var(--card-width)' }}>
                {visibleWaste.length === 0 ? (
                    <div className="w-[var(--card-width)] h-[var(--card-height)] rounded-[var(--card-radius)] border border-white/5 bg-white/2 opacity-20" />
                ) : (
                    <div className="relative">
                        {visibleWaste.map((card, idx) => {
                            const isLast = idx === visibleWaste.length - 1;
                            const offset = drawMode === 3 ? idx : 0;

                            return (
                                <div
                                    key={card.id}
                                    className="absolute top-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                    style={{
                                        left: `calc(${offset} * var(--waste-offset))`,
                                        zIndex: idx,
                                        willChange: 'transform, left'
                                    }}
                                >
                                    <div className={isLast ? 'relative' : 'opacity-80 scale-95 origin-left'}>
                                        <Card
                                            card={card}
                                            isTopCard={isLast}
                                            isHint={isLast && isHintCard?.(card.id)}
                                            onClick={isLast ? () => onWasteCardClick?.(card) : undefined}
                                            onDoubleClick={isLast ? () => onWasteCardDoubleClick?.(card) : undefined}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
