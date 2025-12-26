import type { GameSettings } from '../../types/game';

interface SettingsPanelProps {
    settings: GameSettings;
    onUpdateSettings: (settings: Partial<GameSettings>) => void;
    onClose: () => void;
}

export function SettingsPanel({ settings, onUpdateSettings, onClose }: SettingsPanelProps) {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Settings</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Card Size - For Accessibility */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-white font-medium">Card Size</label>
                            <span className="text-white/50 text-xs">For easier viewing</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(['normal', 'large', 'xlarge'] as const).map((size) => (
                                <button
                                    key={size}
                                    onClick={() => onUpdateSettings({ cardSize: size })}
                                    className={`
                                        py-2.5 px-3 rounded-lg text-sm font-medium transition-all
                                        ${settings.cardSize === size
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'Extra Large'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Draw Mode */}
                    <div>
                        <label className="text-white font-medium block mb-3">Draw Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                            {([1, 3] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => onUpdateSettings({ drawMode: mode })}
                                    className={`
                                        py-2.5 px-4 rounded-lg text-sm font-medium transition-all
                                        ${settings.drawMode === mode
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    Draw {mode}
                                </button>
                            ))}
                        </div>
                        <p className="text-white/40 text-xs mt-2">
                            {settings.drawMode === 1
                                ? 'Easier: Draw 1 card at a time'
                                : 'Classic: Draw 3 cards at a time'}
                        </p>
                    </div>

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-white font-medium">Sound Effects</label>
                            <p className="text-white/40 text-xs mt-0.5">Card sounds and audio feedback</p>
                        </div>
                        <button
                            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                            className={`
                                w-12 h-7 rounded-full transition-all duration-200 relative
                                ${settings.soundEnabled
                                    ? 'bg-emerald-600'
                                    : 'bg-white/20'}
                            `}
                        >
                            <div
                                className={`
                                    absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200
                                    ${settings.soundEnabled ? 'left-6' : 'left-1'}
                                `}
                            />
                        </button>
                    </div>

                    {/* Tip for older users */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex gap-3">
                            <span className="text-2xl">💡</span>
                            <div>
                                <p className="text-amber-200 text-sm font-medium">Tip for visibility</p>
                                <p className="text-amber-200/70 text-xs mt-1">
                                    Rotate your device to landscape mode for larger cards, or select "Extra Large" above.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
