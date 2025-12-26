// Card game sound effects using Web Audio API
// Creates authentic-sounding card noises without external files

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
}

// Resume audio context on user interaction (required by browsers)
export function initAudio(): void {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
}

// Create a noise buffer for card sounds
function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    return buffer;
}

// Card flip sound - quick swoosh with paper texture
export function playCardFlip(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        // Noise for paper texture
        const noiseBuffer = createNoiseBuffer(ctx, 0.08);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        // Bandpass filter for paper-like sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(1, now);

        // Quick envelope
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.08);
    } catch (e) {
        // Audio not available
    }
}

// Card place/drop sound - soft thud with paper rustle
export function playCardPlace(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        // Low thump
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.2, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        // Paper rustle
        const noiseBuffer = createNoiseBuffer(ctx, 0.06);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1500, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
        noise.start(now);
        noise.stop(now + 0.06);
    } catch (e) {
        // Audio not available
    }
}

// Draw card from deck - quick snap
export function playCardDraw(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        // Sharp attack noise
        const noiseBuffer = createNoiseBuffer(ctx, 0.05);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.Q.setValueAtTime(2, now);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.05);
    } catch (e) {
        // Audio not available
    }
}

// Shuffle sound - realistic riffle shuffle simulation
export function playCardShuffle(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        // Riffle shuffle: cards released in quick succession with acceleration
        // First half of deck
        const cardCount = 12;

        for (let i = 0; i < cardCount; i++) {
            // Cards release faster as the riffle progresses
            const progress = i / cardCount;
            const delay = progress * 0.25 * (1 - progress * 0.3); // Accelerating timing

            const noiseBuffer = createNoiseBuffer(ctx, 0.03 + Math.random() * 0.02);
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;

            // Varying frequency for each card - higher pitched paper sound
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(3000 + Math.random() * 2000 + progress * 500, now + delay);
            filter.Q.setValueAtTime(2 + Math.random(), now + delay);

            const gainNode = ctx.createGain();
            const volume = 0.06 + Math.random() * 0.04;
            gainNode.gain.setValueAtTime(0, now + delay);
            gainNode.gain.linearRampToValueAtTime(volume, now + delay + 0.003);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);

            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            noise.start(now + delay);
            noise.stop(now + delay + 0.05);
        }

        // Add a subtle "thwap" at the end when cards come together
        const thwapDelay = 0.28;
        const thwapNoise = createNoiseBuffer(ctx, 0.08);
        const thwap = ctx.createBufferSource();
        thwap.buffer = thwapNoise;

        const thwapFilter = ctx.createBiquadFilter();
        thwapFilter.type = 'lowpass';
        thwapFilter.frequency.setValueAtTime(800, now + thwapDelay);

        const thwapGain = ctx.createGain();
        thwapGain.gain.setValueAtTime(0, now + thwapDelay);
        thwapGain.gain.linearRampToValueAtTime(0.12, now + thwapDelay + 0.01);
        thwapGain.gain.exponentialRampToValueAtTime(0.001, now + thwapDelay + 0.08);

        thwap.connect(thwapFilter);
        thwapFilter.connect(thwapGain);
        thwapGain.connect(ctx.destination);

        thwap.start(now + thwapDelay);
        thwap.stop(now + thwapDelay + 0.08);

    } catch (e) {
        // Audio not available
    }
}

// Success sound - pleasant chime for foundation placement
export function playSuccess(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        // Pleasant two-note chime
        const frequencies = [523.25, 659.25]; // C5, E5

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0, now + i * 0.1);
            gainNode.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });
    } catch (e) {
        // Audio not available
    }
}

// Error/invalid move sound - soft buzz
export function playError(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    } catch (e) {
        // Audio not available
    }
}

// Win fanfare - celebratory melody
export function playWinFanfare(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        // Victory arpeggio: C5, E5, G5, C6
        const notes = [523.25, 659.25, 783.99, 1046.5];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Add slight vibrato
            const vibrato = ctx.createOscillator();
            vibrato.frequency.setValueAtTime(5, now);
            const vibratoGain = ctx.createGain();
            vibratoGain.gain.setValueAtTime(3, now);
            vibrato.connect(vibratoGain);
            vibratoGain.connect(osc.frequency);

            const gainNode = ctx.createGain();
            const noteStart = now + i * 0.12;
            gainNode.gain.setValueAtTime(0, noteStart);
            gainNode.gain.linearRampToValueAtTime(0.2, noteStart + 0.03);
            gainNode.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.5);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            vibrato.start(now);
            vibrato.stop(now + 1);
            osc.start(noteStart);
            osc.stop(noteStart + 0.5);
        });
    } catch (e) {
        // Audio not available
    }
}

// Undo sound - reverse woosh
export function playUndo(): void {
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') return;

        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    } catch (e) {
        // Audio not available
    }
}
