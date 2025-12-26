import type { GameSettings } from '../../types/game';

interface SettingsPanelProps {
    settings: GameSettings;
    onUpdateSettings: (settings: Partial<GameSettings>) => void;
    onClose: () => void;
}

export function SettingsPanel({ settings, onUpdateSettings, onClose }: SettingsPanelProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-sm bg-gradient-to-b from-[#1a1a24] to-[#0a0a0f] rounded-2xl border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <h2 className="text-xl font-semibold text-white font-serif tracking-wide">Settings</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Card Size */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-white font-medium text-sm tracking-wide opacity-90">Card Size</label>
                            <span className="text-white/30 text-[10px] uppercase tracking-widest font-semibold font-sans">Accessibility</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(['normal', 'large', 'xlarge'] as const).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => onUpdateSettings({ cardSize: size })}
                                    className={`
                                        py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all
                                        ${settings.cardSize === size
                                            ? 'bg-gradient-to-br from-[#d4a533] to-[#8b6914] text-black shadow-lg shadow-[#d4a533]/20'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                                        }
                                    `}
                                >
                                    {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'Extra'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Draw Mode */}
                    <div>
                        <label className="text-white font-medium text-sm tracking-wide opacity-90 block mb-4">Draw Mode</label>
                        <div className="grid grid-cols-2 gap-3">
                            {([1, 3] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => onUpdateSettings({ drawMode: mode })}
                                    className={`
                                        py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all
                                        ${settings.drawMode === mode
                                            ? 'bg-gradient-to-br from-[#d4a533] to-[#8b6914] text-black shadow-lg shadow-[#d4a533]/20'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                                        }
                                    `}
                                >
                                    Draw {mode}
                                </button>
                            ))}
                        </div>
                        <p className="text-white/30 text-[11px] mt-3 font-medium">
                            {settings.drawMode === 1
                                ? 'Casual experience: Draw 1 card'
                                : 'Patience classic: Draw 3 cards'}
                        </p>
                    </div>

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <label className="text-white font-medium text-sm tracking-wide opacity-90">Sound Effects</label>
                            <p className="text-white/30 text-[11px] mt-1 font-medium italic">Premium paper & felt audio</p>
                        </div>
                        <button
                            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                            className={`
                                w-14 h-8 rounded-full transition-all duration-300 relative p-1
                                ${settings.soundEnabled
                                    ? 'bg-[#d4a533]'
                                    : 'bg-white/10'}
                            `}
                        >
                            <div
                                className={`
                                    w-6 h-6 rounded-full bg-white shadow-xl transition-all duration-300 transform
                                    ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}
                                `}
                            />
                        </button>
                    </div>

                    {/* Guide */}
                    <div className="bg-[#d4a533]/5 border border-[#d4a533]/15 rounded-2xl p-4 mt-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#d4a533]/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#d4a533]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[#d4a533] text-sm font-semibold">Pro Visibility Tip</p>
                                <p className="text-[#d4a533]/60 text-xs mt-1 leading-relaxed">
                                    Switch to landscape mode for maximum card clarity on mobile devices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-[#08080c]/50">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/5"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
