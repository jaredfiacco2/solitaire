// Card game sound effects using real audio files
// Much better sound quality than Web Audio API synthesis

// Organic Audio Engine - Web Audio API with Pitch/Volume Jitter
let audioCtx: AudioContext | null = null;
const bufferCache: Map<string, AudioBuffer> = new Map();

// Initialize or resume the AudioContext
async function getAudioCtx(): Promise<AudioContext> {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
    return audioCtx;
}

// Load and decode an audio file into a buffer
async function loadToBuffer(src: string): Promise<AudioBuffer> {
    const cached = bufferCache.get(src);
    if (cached) return cached;

    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const ctx = await getAudioCtx();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    bufferCache.set(src, audioBuffer);
    return audioBuffer;
}

// Play a buffer with organic variation (pitch and volume jitter)
async function playOrganic(src: string, baseVolume = 0.5): Promise<void> {
    try {
        const ctx = await getAudioCtx();
        const buffer = await loadToBuffer(src);

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Organic Pitch Shift (Variation in physical impact)
        // A 0.95 to 1.05 range provides a subtle, realistic variety
        const pitchVariation = 0.96 + Math.random() * 0.08;
        source.playbackRate.setValueAtTime(pitchVariation, ctx.currentTime);

        const gainNode = ctx.createGain();
        // Organic Volume Jitter
        const volumeVariation = baseVolume * (0.9 + Math.random() * 0.2);
        gainNode.gain.setValueAtTime(volumeVariation, ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);
    } catch (error) {
        console.warn('Audio playback failed:', error);
    }
}

// Tactile Feedback - Physical vibration for mobile
export function triggerHaptic(type: 'light' | 'medium' | 'success' = 'light'): void {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        switch (type) {
            case 'light': navigator.vibrate(10); break;
            case 'medium': navigator.vibrate(20); break;
            case 'success': navigator.vibrate([15, 30, 15]); break;
        }
    }
}

export function initAudio(): void {
    // Pre-seed the buffers for zero-latency first play
    ['/sounds/card-place.mp3', '/sounds/card-shuffle.mp3', '/sounds/success.mp3'].forEach(loadToBuffer);
}

export function playCardFlip(): void {
    playOrganic('/sounds/card-place.mp3', 0.25);
}

export function playCardPlace(): void {
    playOrganic('/sounds/card-place.mp3', 0.45);
}

export function playCardDraw(): void {
    playOrganic('/sounds/card-place.mp3', 0.35);
}

export function playCardShuffle(): void {
    playOrganic('/sounds/card-shuffle.mp3', 0.55);
}

export function playSuccess(): void {
    playOrganic('/sounds/success.mp3', 0.35);
}

export function playWinFanfare(): void {
    playOrganic('/sounds/success.mp3', 0.65);
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
// Ambient Room Tone - Persistent low-frequency atmosphere
let ambientContext: AudioContext | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
let ambientGain: GainNode | null = null;

export function startAmbient(): void {
    if (ambientContext || ambientSource) return;

    try {
        ambientContext = new AudioContext();

        // Create brown noise for "felt" texture
        const bufferSize = ambientContext.sampleRate * 2;
        const buffer = ambientContext.createBuffer(1, bufferSize, ambientContext.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            data[i] = lastOut * 3.5; // Brown noise approximation
        }

        ambientSource = ambientContext.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        const filter = ambientContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ambientContext.currentTime);
        filter.Q.setValueAtTime(1, ambientContext.currentTime);

        ambientGain = ambientContext.createGain();
        ambientGain.gain.setValueAtTime(0, ambientContext.currentTime);
        // Fade in gracefully
        ambientGain.gain.linearRampToValueAtTime(0.04, ambientContext.currentTime + 1.5);

        ambientSource.connect(filter);
        filter.connect(ambientGain);
        ambientGain.connect(ambientContext.destination);

        ambientSource.start();
    } catch {
        // Audio not available
    }
}

export function stopAmbient(): void {
    if (ambientGain && ambientContext) {
        ambientGain.gain.linearRampToValueAtTime(0, ambientContext.currentTime + 0.5);
        setTimeout(() => {
            ambientSource?.stop();
            ambientSource = null;
            ambientContext?.close();
            ambientContext = null;
        }, 600);
    }
}
