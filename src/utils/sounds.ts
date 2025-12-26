// Card game sound effects using real audio files
// Much better sound quality than Web Audio API synthesis

// Audio element cache for reuse
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Preload and cache an audio file
function loadAudio(src: string): HTMLAudioElement {
    const cached = audioCache.get(src);
    if (cached) return cached;

    const audio = new Audio(src);
    audio.preload = 'auto';
    audioCache.set(src, audio);
    return audio;
}

// Play audio with optional volume
function playAudio(src: string, volume = 0.5): void {
    try {
        const audio = loadAudio(src);
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(() => {
            // Auto-play blocked, ignore
        });
    } catch {
        // Audio not available
    }
}

// Resume audio context on user interaction (for Safari/mobile)
export function initAudio(): void {
    // Pre-load all sound files
    loadAudio('/sounds/card-shuffle.mp3');
    loadAudio('/sounds/card-place.mp3');
    loadAudio('/sounds/success.mp3');
}

// Card flip sound - use place sound at lower volume
export function playCardFlip(): void {
    playAudio('/sounds/card-place.mp3', 0.3);
}

// Card place/drop sound
export function playCardPlace(): void {
    playAudio('/sounds/card-place.mp3', 0.5);
}

// Draw card from deck - quick snap
export function playCardDraw(): void {
    playAudio('/sounds/card-place.mp3', 0.4);
}

// Shuffle sound - realistic card shuffle
export function playCardShuffle(): void {
    playAudio('/sounds/card-shuffle.mp3', 0.6);
}

// Success sound - pleasant chime for foundation placement
export function playSuccess(): void {
    playAudio('/sounds/success.mp3', 0.4);
}

// Win fanfare - use success sound louder
export function playWinFanfare(): void {
    playAudio('/sounds/success.mp3', 0.7);
}

// Error/invalid move sound - keeping Web Audio for this simple one
export function playError(): void {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    } catch {
        // Audio not available
    }
}

// Undo sound - reverse woosh
export function playUndo(): void {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch {
        // Audio not available
    }
}
