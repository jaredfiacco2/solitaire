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
            {/* Imperial Stock Pillar */}
            <div className="relative group">
                {stock.length === 0 ? (
                    <EmptyPile type="stock" onClick={onStockClick} isHint={isStockHint} />
                ) : (
                    <div
                        onClick={onStockClick}
                        className={`cursor-pointer relative transition-transform duration-300 hover:translate-y-[-2px] active:translate-y-[1px] ${isStockHint ? 'animate-pulse' : ''} ${isDealing ? 'animate-fly-in' : ''}`}
                        style={{ animationDelay: isDealing ? '0s' : undefined }}
                    >
                        {/* Stack Materiality */}
                        {stock.length > 2 && (
                            <div className="absolute left-[3px] top-[3px] w-full h-full rounded-[8px] bg-[#121218] border border-white/5 opacity-40 shadow-sm" />
                        )}
                        {stock.length > 1 && (
                            <div className="absolute left-[1.5px] top-[1.5px] w-full h-full rounded-[8px] bg-[#1a1a24] border border-white/5 opacity-60 shadow-sm" />
                        )}
                        <Card card={stock[stock.length - 1]} isTopCard isHint={isStockHint} />

                        {/* Imperial Count Badge */}
                        <div className="absolute -bottom-2 -right-2 min-w-[24px] h-6 px-1.5 bg-gradient-to-br from-[#d4a533] via-[#ffd700] to-[#b8860b] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(212,165,51,0.3)] border border-white/20 select-none">
                            {stock.length}
                        </div>
                    </div>
                )}
            </div>

            {/* Imperial Waste Trail */}
            <div className="relative" style={{ minWidth: 'var(--card-width-mobile)' }}>
                {visibleWaste.length === 0 ? (
                    <div className="w-[var(--card-width-mobile)] h-[calc(var(--card-width-mobile)*1.4)] rounded-[8px] border border-white/5 bg-white/2 opacity-20" />
                ) : (
                    <div className="relative">
                        {visibleWaste.map((card, idx) => {
                            const isLast = idx === visibleWaste.length - 1;
                            const offset = drawMode === 3 ? idx * 22 : 0;

                            return (
                                <div
                                    key={card.id}
                                    className="absolute top-0 transition-all duration-300"
                                    style={{
                                        left: offset,
                                        zIndex: idx,
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
