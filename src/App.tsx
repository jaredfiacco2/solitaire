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
import { startAmbient, stopAmbient } from './utils/sounds';
import type { Card as CardType } from './types/game';

function App() {
  const {
    state,
    settings,
    hintCard,
    canUndo,
    lastAutoCompleteCardId,
    drawFromStock,
    smartMove,
    moveFromFoundation,
    findHint,
    startAutoComplete,
    newGame,
    updateSettings,
    undo,
  } = useGameState();

  const { isMobile, isLandscape } = useResponsive();
  const { stats, recordWin, recordGamePlayed, resetStats } = useStats();
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lastMoveSuccess, setLastMoveSuccess] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastMovedCardId, setLastMovedCardId] = useState<string | null>(null);

  // Handle card tap
  const handleCardTap = (card: CardType, fromType: 'waste' | 'tableau', fromIndex: number, cardsToMove?: CardType[]) => {
    const prevScore = state.score;
    smartMove(card, fromType, fromIndex, cardsToMove);

    // Track the moved card for animation
    setLastMovedCardId(card.id);
    setTimeout(() => setLastMovedCardId(null), 350);

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
      recordWin(time, state.moves, state.score);
    }
  }, [state.isComplete, state.startTime, state.moves, state.score, recordWin]);

  // Elapsed time timer
  useEffect(() => {
    if (!state.startTime || state.isComplete) return;

    // Initial set happens in the interval immediately
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - state.startTime!) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.startTime, state.isComplete]);


  // Toggle draw mode
  const handleToggleDrawMode = () => {
    updateSettings({ drawMode: settings.drawMode === 1 ? 3 : 1 });
  };



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

  // Check if a card was just moved (for placement animation)
  const isJustMoved = (cardId: string) => lastMovedCardId === cardId || lastAutoCompleteCardId === cardId;

  // Handle Interactive Lighting
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const xPercent = (x / window.innerWidth) * 100;
      const yPercent = (y / window.innerHeight) * 100;

      document.documentElement.style.setProperty('--light-x', `${xPercent}%`);
      document.documentElement.style.setProperty('--light-y', `${yPercent}%`);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchstart', handleMove);
    window.addEventListener('touchmove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  // Ambient Vitality Lifecycle
  useEffect(() => {
    if (settings.soundEnabled) {
      // Small delay to ensure audio context can be resumed after interaction
      const timer = setTimeout(startAmbient, 500);
      return () => {
        clearTimeout(timer);
        stopAmbient();
      };
    } else {
      stopAmbient();
    }
  }, [settings.soundEnabled]);

  return (
    <div className={`
      h-full flex flex-col premium-surface safe-area-padding overflow-hidden 
      ${getCardSizeClass()} 
      theme-${settings.tableTheme}
      ${lastMoveSuccess ? 'success-flash flash-interactive' : ''}
      ${isLandscape ? 'landscape-compact' : 'portrait-mobile'}
      ${isMobile ? 'is-mobile' : 'is-desktop'}
    `}>
      {/* 3D Lighting Projection Layer */}
      <div className="lighting-projection" />
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

      {/* Premium Score Feedback */}
      {lastMoveSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="flex flex-col items-center animate-gold-glow">
            <div className="text-3xl font-serif font-bold text-[#d4a533] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">+10</div>
            <div className="text-[10px] text-[#d4a533]/60 uppercase tracking-widest font-semibold mt-1">Foundation move</div>
          </div>
        </div>
      )}

      {/* Game Area */}
      <main className={`flex-1 flex flex-col p-2 sm:p-4 lg:p-6 overflow-hidden relative z-10 ${isMobile ? 'pt-2' : ''}`}>
        {/* Top Row: Strategic Workspace */}
        <div className={`flex justify-between items-start mb-4 sm:mb-6 lg:mb-8 px-1 sm:px-4 ${isMobile ? 'mobile-compact-piles' : ''}`}>
          <StockWaste
            stock={state.stock}
            waste={state.waste}
            drawMode={state.drawMode}
            onStockClick={drawFromStock}
            onWasteCardClick={(card) => handleCardTap(card, 'waste', 0)}
            isHintCard={isHintCard}
            isStockHint={hintCard?.cardId === 'stock'}
            isDealing={state.isDealing}
          />

          <Foundation
            piles={state.foundations}
            onCardClick={(card, pileIndex) => {
              moveFromFoundation(card, pileIndex);
              setLastMovedCardId(card.id);
              setTimeout(() => setLastMovedCardId(null), 350);
            }}
            isJustMoved={isJustMoved}
          />
        </div>

        {/* Tableau: The Grand Table */}
        <div className={`flex-1 flex items-start justify-center overflow-y-auto smooth-scroll pb-8 ${isMobile ? 'mobile-compact-tableau' : ''}`}>
          <Tableau
            piles={state.tableau}
            onCardClick={(card, pileIndex, cardIndex) => {
              const cardsToMove = state.tableau[pileIndex].slice(cardIndex);
              handleCardTap(card, 'tableau', pileIndex, cardsToMove);
            }}
            isHintCard={isHintCard}
            isJustMoved={isJustMoved}
            isDealing={state.isDealing}
          />
        </div>
      </main>

      {/* Precision Hud Controls (Bottom) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <button
          onClick={() => setShowSettings(true)}
          className="w-12 h-12 glass rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shadow-2xl border border-white/10 active:scale-95 group"
          aria-label="Settings"
        >
          <svg className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={() => setShowStats(true)}
          className="w-12 h-12 glass rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all shadow-2xl border border-white/10 active:scale-95 group"
          aria-label="View Statistics"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* Imperial Status Indicator */}
      {state.isAutoCompleting && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 glass text-[#d4a533] rounded-2xl text-xs font-semibold tracking-widest uppercase shadow-2xl border border-[#d4a533]/20 animate-pulse z-50">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-[2.5px] border-[#d4a533] border-t-transparent rounded-full animate-spin" />
            Auto-resolution in progress
          </div>
        </div>
      )}

      {/* No Moves Available Notification */}
      {state.isStuck && !state.isComplete && !state.isAutoCompleting && (
        <div className="fixed inset-x-0 bottom-24 flex justify-center z-40 animate-fly-in">
          <div className="flex flex-col items-center gap-4 px-8 py-5 glass rounded-[20px] border border-red-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em]">Game Over</span>
              <span className="text-lg font-serif text-white/90">No moves available</span>
            </div>
            <button
              onClick={handleNewGame}
              className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-[#f0f0f0] transition-colors uppercase tracking-widest"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Auto-Finish Prompt - Premium UX */}
      {state.canAutoComplete && !state.isAutoCompleting && !state.isComplete && (
        <div className="fixed inset-x-0 bottom-24 flex justify-center z-40 animate-fly-in">
          <button
            onClick={startAutoComplete}
            className="group relative flex items-center gap-4 px-8 py-4 glass rounded-[20px] border border-[#d4a533]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 transition-all hover:border-[#d4a533]/60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4a533]/5 via-transparent to-[#d4a533]/5 rounded-inherit group-hover:opacity-100 opacity-0 transition-opacity" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-[#d4a533] font-bold uppercase tracking-[0.2em]">Victory paths visible</span>
              <span className="text-lg font-serif text-white/90">Auto-finish game?</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#d4a533] flex items-center justify-center text-black shadow-lg shadow-[#d4a533]/20 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
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
          onResetStats={resetStats}
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
