/**
 * Guzarish Instrumental Audio Ambiance Engine
 *
 * Implements a rich, multi-layered acoustic & bansuri synthesizer evoking
 * the iconic romantic melody of "Guzarish" (A.R. Rahman / Javed Ali).
 *
 * Features:
 * 1. Warm nylon acoustic guitar arpeggiator in D Minor / F Major
 * 2. Soulful Indian Bansuri (bamboo flute) lead melody with gentle portamento & vibrato
 * 3. Deep cello & tanpura acoustic drone with rich harmonic overtones
 * 4. User-activated playback, smooth gain crossfades, and mute state sync
 */

class GuzarishAmbianceEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private fluteGain: GainNode | null = null;
  private arpeggioGain: GainNode | null = null;
  private arpeggioTimer: number | null = null;
  private melodyTimer: number | null = null;
  private droneOscs: OscillatorNode[] = [];
  private listeners: Set<(playing: boolean) => void> = new Set();
  public trackTitle: string = 'Guzarish • Poetic Romance (Acoustic Flute & Strings)';

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Sub-busses
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.droneGain.connect(this.masterGain);

      this.fluteGain = this.ctx.createGain();
      this.fluteGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.fluteGain.connect(this.masterGain);

      this.arpeggioGain = this.ctx.createGain();
      this.arpeggioGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.arpeggioGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    cb(this.isPlaying);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public play() {
    try {
      this.initAudio();
      if (!this.ctx || !this.masterGain) return;
      if (this.isPlaying) return;

      this.isPlaying = true;
      this.notify();

      // Fade in smoothly
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.26, this.ctx.currentTime + 2.5);

      this.startDrone();
      this.startGuitarArpeggios();
      this.startGuzarishMelody();
    } catch (err) {
      console.warn('Audio play prevented or context blocked:', err);
      this.isPlaying = false;
      this.notify();
    }
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.notify();

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      setTimeout(() => {
        this.stopAllVoices();
      }, 1250);
    } else {
      this.stopAllVoices();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private stopAllVoices() {
    this.droneOscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.droneOscs = [];

    if (this.arpeggioTimer) {
      window.clearInterval(this.arpeggioTimer);
      this.arpeggioTimer = null;
    }
    if (this.melodyTimer) {
      window.clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  /**
   * Warm Tanpura & Cello Pad Foundation
   * Root: D2 (73.42Hz), A2 (110Hz), D3 (146.83Hz), F3 (174.61Hz)
   */
  private startDrone() {
    if (!this.ctx || !this.droneGain) return;
    this.droneOscs.forEach((o) => {
      try { o.stop(); } catch {}
    });
    this.droneOscs = [];

    const droneFreqs = [73.42, 110.0, 146.83, 220.0];

    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.droneGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Lowpass filter for warm acoustic cello body
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260 + idx * 80, this.ctx.currentTime);

      // Subtle slow chorus detuning
      osc.detune.setValueAtTime((idx - 1.5) * 4, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);

      osc.start();
      this.droneOscs.push(osc);
    });
  }

  /**
   * Flowing Acoustic Guitar / Harp Arpeggios
   * Dm -> Bb -> C -> Gm -> A7 -> Dm
   */
  private startGuitarArpeggios() {
    if (!this.ctx || !this.arpeggioGain) return;

    // Chords defined by frequency notes in D Minor
    const chords = [
      // D Minor: D3, F3, A3, D4, F4, A4
      [146.83, 174.61, 220.0, 293.66, 349.23, 440.0],
      // Bb Major: Bb2, D3, F3, Bb3, D4, F4
      [116.54, 146.83, 174.61, 233.08, 293.66, 349.23],
      // C Major: C3, E3, G3, C4, E4, G4
      [130.81, 164.81, 196.0, 261.63, 329.63, 392.0],
      // Gm: G2, D3, G3, Bb3, D4, G4
      [98.0, 146.83, 196.0, 233.08, 293.66, 392.0],
      // A7: A2, E3, G3, A3, C#4, E4
      [110.0, 164.81, 196.0, 220.0, 277.18, 329.63],
    ];

    let chordIdx = 0;
    let noteStep = 0;

    const stepIntervalMs = 280; // Gentle romantic tempo (~70 BPM)

    this.arpeggioTimer = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.arpeggioGain) return;

      const currentChord = chords[chordIdx];
      // Pick arpeggio pattern: 0, 1, 2, 4, 3, 2, 1, 2
      const pattern = [0, 1, 2, 4, 3, 2, 1, 3];
      const noteFreq = currentChord[pattern[noteStep % pattern.length]];

      this.playNylonPluck(noteFreq);

      noteStep++;
      if (noteStep % pattern.length === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, stepIntervalMs);
  }

  private playNylonPluck(freq: number) {
    if (!this.ctx || !this.arpeggioGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm pluck filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.8);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.arpeggioGain);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  /**
   * Soulful Indian Bansuri (Flute) Lead
   * Plays the poetic motif of Guzarish:
   * "Tu meri adhoori pyaas pyaas... tu aagayi mann ko raas raas..."
   */
  private startGuzarishMelody() {
    // Note frequencies in Hz:
    // D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, Bb4: 466.16, C5: 523.25, D5: 587.33, C#4: 277.18
    const melodyPhrases: Array<Array<{ note: number; duration: number }>> = [
      // Phrase 1: "Tu meri adhoori pyaas pyaas..."
      [
        { note: 293.66, duration: 0.6 }, // D4
        { note: 329.63, duration: 0.5 }, // E4
        { note: 349.23, duration: 0.9 }, // F4
        { note: 329.63, duration: 0.6 }, // E4
        { note: 293.66, duration: 1.1 }, // D4
        { note: 277.18, duration: 0.5 }, // C#4
        { note: 293.66, duration: 1.6 }, // D4
      ],
      // Phrase 2: "Tu aagayi mann ko raas raas..."
      [
        { note: 349.23, duration: 0.5 }, // F4
        { note: 392.0, duration: 0.5 },  // G4
        { note: 440.0, duration: 0.9 },  // A4
        { note: 466.16, duration: 0.6 }, // Bb4
        { note: 440.0, duration: 0.8 },  // A4
        { note: 392.0, duration: 0.6 },  // G4
        { note: 349.23, duration: 1.6 }, // F4
      ],
      // Phrase 3: "Aas paas hai khuda... Guzarish..."
      [
        { note: 440.0, duration: 0.6 },  // A4
        { note: 466.16, duration: 0.5 }, // Bb4
        { note: 523.25, duration: 1.0 }, // C5
        { note: 466.16, duration: 0.6 }, // Bb4
        { note: 440.0, duration: 0.8 },  // A4
        { note: 392.0, duration: 0.5 },  // G4
        { note: 349.23, duration: 0.6 }, // F4
        { note: 329.63, duration: 0.6 }, // E4
        { note: 293.66, duration: 2.2 }, // D4 (sustained resolving note)
      ],
    ];

    let phraseIdx = 0;

    const playNextPhrase = () => {
      if (!this.isPlaying || !this.ctx || !this.fluteGain) return;

      const phrase = melodyPhrases[phraseIdx];
      let offset = 0;

      phrase.forEach((item) => {
        const startTime = this.ctx!.currentTime + offset;
        this.playFluteNote(item.note, startTime, item.duration);
        offset += item.duration + 0.08;
      });

      phraseIdx = (phraseIdx + 1) % melodyPhrases.length;

      // Rest interval between poetic verses
      const restDelay = (offset + 1.8) * 1000;
      this.melodyTimer = window.setTimeout(playNextPhrase, restDelay);
    };

    // Begin flute after 1.2 seconds of gentle harp introduction
    this.melodyTimer = window.setTimeout(playNextPhrase, 1200);
  }

  private playFluteNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.fluteGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Bansuri has soft sine with warm harmonics
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm vibrato LFO (5.2 Hz)
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.2, startTime);
    vibratoGain.gain.setValueAtTime(4.5, startTime); // subtle 4.5Hz pitch variation
    vibrato.connect(osc.frequency);
    vibrato.start(startTime + 0.15);
    vibrato.stop(startTime + duration);

    // Breathy Flute Attack & Swell Envelope
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.14, startTime + 0.12);
    gain.gain.setValueAtTime(0.12, startTime + duration - 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.fluteGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }
}

export const guzarishAmbiance = new GuzarishAmbianceEngine();
export const royalAmbiance = guzarishAmbiance; // backwards-compatible alias
