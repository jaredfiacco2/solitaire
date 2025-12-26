import { useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { useStats } from './hooks/useStats';
import { useResponsive } from './hooks/useResponsive';
import { StockWaste } from './components/game/StockWaste';
import { Foundation } from './components/game/Foundation';
import { Tableau } from './components/game/Tableau';
import { GameControls } from './components/ui/GameControls';
import { WinCelebration } from './components/ui/WinCelebration';
import { StatsPanel } from './components/ui/StatsPanel';
import { SettingsPanel } from './components/ui/SettingsPanel';
import type { Card as CardType } from './types/game';

function App() {
  const {
    state,
    settings,
    hintCard,
    canUndo,
    drawFromStock,
    smartMove,
    findHint,
    startAutoComplete,
    newGame,
    updateSettings,
    undo,
  } = useGameState();

  const { isMobile, isLandscape } = useResponsive();
  const { stats, recordWin, recordGamePlayed } = useStats();
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastMoveSuccess, setLastMoveSuccess] = useState(false);

  // Handle card tap
  const handleCardTap = (card: CardType, fromType: 'waste' | 'tableau', fromIndex: number, cardsToMove?: CardType[]) => {
    const prevScore = state.score;
    smartMove(card, fromType, fromIndex, cardsToMove);
    setTimeout(() => {
      if (state.score > prevScore) {
        setLastMoveSuccess(true);
        setTimeout(() => setLastMoveSuccess(false), 300);
      }
    }, 50);
  };

  // Handle new game
  const handleNewGame = () => {
    recordGamePlayed();
    newGame();
  };

  // Handle win
  useEffect(() => {
    if (state.isComplete && state.startTime) {
      const time = Math.floor((Date.now() - state.startTime) / 1000);
      recordWin(time, state.moves);
    }
  }, [state.isComplete, state.startTime, state.moves, recordWin]);

  // Toggle draw mode
  const handleToggleDrawMode = () => {
    updateSettings({ drawMode: settings.drawMode === 1 ? 3 : 1 });
  };

  // Calculate elapsed time
  const elapsedTime = state.startTime
    ? Math.floor((Date.now() - state.startTime) / 1000)
    : 0;

  // Calculate card size class with mobile awareness
  const getCardSizeClass = () => {
    if (settings.cardSize === 'normal' && isMobile) return 'cards-mobile';
    switch (settings.cardSize) {
      case 'large': return 'cards-large';
      case 'xlarge': return 'cards-xlarge';
      default: return '';
    }
  };

  // Check if a card is the hint card
  const isHintCard = (cardId: string) => hintCard?.cardId === cardId;

  return (
    <div className={`
      h-full flex flex-col premium-surface safe-area-padding overflow-hidden 
      ${getCardSizeClass()} 
      ${lastMoveSuccess ? 'success-flash' : ''}
      ${isLandscape ? 'landscape-compact' : 'portrait-mobile'}
    `}>
      {/* Header Controls */}
      <GameControls
        moves={state.moves}
        score={state.score}
        startTime={state.startTime}
        drawMode={state.drawMode}
        onNewGame={handleNewGame}
        onToggleDrawMode={handleToggleDrawMode}
        onHint={findHint}
        onUndo={undo}
        canUndo={canUndo}
        isComplete={state.isComplete}
        canAutoComplete={state.canAutoComplete && !state.isAutoCompleting}
        onAutoComplete={startAutoComplete}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Score popup */}
      {lastMoveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="text-2xl font-bold text-amber-400 animate-bounce">+10</div>
        </div>
      )}

      {/* Game Area */}
      <main className={`flex-1 flex flex-col p-2 sm:p-3 lg:p-4 overflow-hidden ${isMobile ? 'pt-1' : ''}`}>
        {/* Top Row */}
        <div className={`flex justify-between items-start mb-3 sm:mb-4 lg:mb-6 px-1 ${isMobile ? 'mobile-compact-piles' : ''}`}>
          <StockWaste
            stock={state.stock}
            waste={state.waste}
            drawMode={state.drawMode}
            onStockClick={drawFromStock}
            onWasteCardClick={(card) => handleCardTap(card, 'waste', 0)}
            onWasteCardDoubleClick={(card) => handleCardTap(card, 'waste', 0)}
            isHintCard={isHintCard}
            isStockHint={hintCard?.cardId === 'stock'}
          />

          <Foundation
            piles={state.foundations}
            onCardClick={() => { }}
          />
        </div>

        {/* Tableau */}
        <div className={`flex-1 flex items-start justify-center overflow-y-auto smooth-scroll pb-4 ${isMobile ? 'mobile-compact-tableau' : ''}`}>
          <Tableau
            piles={state.tableau}
            onCardClick={(card, pileIndex, cardIndex) => {
              const cardsToMove = state.tableau[pileIndex].slice(cardIndex);
              handleCardTap(card, 'tableau', pileIndex, cardsToMove);
            }}
            onCardDoubleClick={(card, pileIndex, cardIndex) => {
              const cardsToMove = state.tableau[pileIndex].slice(cardIndex);
              handleCardTap(card, 'tableau', pileIndex, cardsToMove);
            }}
            isHintCard={isHintCard}
          />
        </div>
      </main>

      {/* Bottom buttons */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        {/* Settings button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-full flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-all shadow-lg"
          aria-label="Settings"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Stats button */}
        <button
          onClick={() => setShowStats(true)}
          className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-full flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-all shadow-lg"
          aria-label="View Statistics"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* Auto-completing indicator */}
      {state.isAutoCompleting && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 glass text-[#d4a533] rounded-full text-sm font-medium shadow-lg border border-[#d4a533]/25">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#d4a533] border-t-transparent rounded-full animate-spin" />
            Auto-completing...
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Stats Panel */}
      {showStats && (
        <StatsPanel
          stats={stats}
          onClose={() => setShowStats(false)}
        />
      )}

      {/* Win Celebration */}
      {state.isComplete && (
        <WinCelebration
          onNewGame={handleNewGame}
          time={elapsedTime}
          moves={state.moves}
          score={state.score}
        />
      )}
    </div>
  );
}

export default App;
