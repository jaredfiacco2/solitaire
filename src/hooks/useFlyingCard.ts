import { useState, useCallback, useRef } from 'react';
import type { Card as CardType } from '../types/game';

export interface FlyingCardState {
  card: CardType;
  fromRect: DOMRect;
  toRect: DOMRect;
}

export function useFlyingCard() {
  const [flyingCard, setFlyingCard] = useState<FlyingCardState | null>(null);
  const flyingCardRef = useRef<HTMLDivElement | null>(null);

  const startFlight = useCallback((
    card: CardType,
    fromElement: HTMLElement | null,
    toElement: HTMLElement | null
  ) => {
    if (!fromElement || !toElement) return;

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    setFlyingCard({ card, fromRect, toRect });

    // Remove the flying card after animation completes
    setTimeout(() => {
      setFlyingCard(null);
    }, 350); // Match animation duration
  }, []);

  const clearFlight = useCallback(() => {
    setFlyingCard(null);
  }, []);

  return { flyingCard, flyingCardRef, startFlight, clearFlight };
}
