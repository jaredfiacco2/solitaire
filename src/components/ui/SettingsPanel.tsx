import type { GameSettings } from '../../types/game';

interface SettingsPanelProps {
    settings: GameSettings;
    onUpdateSettings: (settings: Partial<GameSettings>) => void;
    onClose: () => void;
}

export function SettingsPanel({ settings, onUpdateSettings, onClose }: SettingsPanelProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-sm glass rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10">
                {/* Silver Accent Frame */}
                <div className="absolute inset-2 border border-white/5 rounded-[26px] pointer-events-none" />

                <div className="flex items-center justify-between px-8 py-7 border-b border-white/5 relative z-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4a533] font-bold mb-1 opacity-60">Personalization</span>
                        <h2 className="text-2xl font-serif font-bold text-imperial-gold">Preferences</h2>
                    </div>
                </div>

                <div className="p-8 space-y-10 relative z-10">
                    {/* Bespoke Silks (Table Theme) */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <label className="text-[11px] uppercase tracking-widest text-white/50 font-bold">Bespoke Silks</label>
                            <div className="h-[1px] flex-1 mx-4 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {(['midnight', 'emerald', 'amethyst'] as const).map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => onUpdateSettings({ tableTheme: theme })}
                                    className={`
                                        btn-squish py-3.5 rounded-2xl text-[9px] font-bold uppercase tracking-[0.15em] transition-all border
                                        ${settings.tableTheme === theme
                                            ? 'bg-white text-black border-white shadow-[0_8px_20px_rgba(255,255,255,0.2)]'
                                            : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    {theme === 'midnight' ? 'Midnight' : theme === 'emerald' ? 'Emerald' : 'Amethyst'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Perspective Scaling (Card Size) */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <label className="text-[11px] uppercase tracking-widest text-white/50 font-bold">Viewport Scaling</label>
                            <div className="h-[1px] flex-1 mx-4 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {(['normal', 'large', 'xlarge'] as const).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => onUpdateSettings({ cardSize: size })}
                                    className={`
                                        btn-squish py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all border
                                        ${settings.cardSize === size
                                            ? 'bg-white text-black border-white shadow-[0_8px_20px_rgba(255,255,255,0.2)]'
                                            : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    {size === 'normal' ? 'Classic' : size === 'large' ? 'Studio' : 'Grand'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mechanical Difficulty (Draw Mode) */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <label className="text-[11px] uppercase tracking-widest text-white/50 font-bold">Shuffling Rule</label>
                            <div className="h-[1px] flex-1 mx-4 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {([1, 3] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => onUpdateSettings({ drawMode: mode })}
                                    className={`
                                        btn-squish py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.1em] transition-all border
                                        ${settings.drawMode === mode
                                            ? 'bg-[#d4a533] text-black border-[#d4a533] shadow-[0_8px_20px_rgba(212,165,51,0.2)]'
                                            : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    Draw {mode === 1 ? 'Single' : 'Triple'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Atmospheric Presence (Sound) */}
                    <div className="flex items-center justify-between py-2 group cursor-pointer" onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}>
                        <div className="flex flex-col">
                            <label className="text-[11px] uppercase tracking-widest text-white/50 font-bold mb-1">Fidelity Audio</label>
                            <p className="text-white/20 text-[10px] italic">Authentic material resonance</p>
                        </div>
                        <div className={`
                            btn-squish w-14 h-8 rounded-full transition-all duration-500 relative p-1
                            ${settings.soundEnabled ? 'bg-[#d4a533]' : 'bg-white/10'}
                        `}>
                            <div className={`
                                w-6 h-6 rounded-full bg-white shadow-xl transition-transform duration-300
                                ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}
                            `} />
                        </div>
                    </div>

                    {/* Ergo Indicator */}
                    <div className="bg-white/3 p-5 rounded-[24px] border border-white/5">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#d4a533]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Ergonomic Tip</span>
                                <p className="text-white/30 text-[10px] leading-relaxed">
                                    Optimized for <span className="text-white/50">Landscape Orientation</span> for maximum tactile precision.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-black/20 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="btn-squish w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/10"
                    >
                        Commit Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
