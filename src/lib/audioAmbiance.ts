/**
 * Guzarish by Satinder Sartaaj Audio Engine
 * Video ID: CEbB9kdu8ng (https://www.youtube.com/watch?v=CEbB9kdu8ng)
 *
 * Integrates:
 * 1. Official YouTube Player for "Guzarish" by Satinder Sartaaj (CEbB9kdu8ng)
 * 2. Web Audio acoustic synth fallback if YouTube iframe API is blocked or offline
 * 3. Unified play/pause/mute and state synchronization across components
 */

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

class GuzarishAmbianceEngine {
  private ytPlayer: any = null;
  private isYTReady: boolean = false;
  private isPlaying: boolean = false;
  private ytContainerId: string = 'youtube-music-player';
  private ytVideoId: string = 'CEbB9kdu8ng'; // Satinder Sartaaj - Guzarish

  // Web Audio Fallback Synthesizer
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private fluteGain: GainNode | null = null;
  private arpeggioGain: GainNode | null = null;
  private arpeggioTimer: number | null = null;
  private melodyTimer: number | null = null;
  private droneOscs: OscillatorNode[] = [];
  private isUsingSynthFallback: boolean = false;

  private listeners: Set<(playing: boolean) => void> = new Set();
  public trackTitle: string = 'Guzarish · Satinder Sartaaj';

  constructor() {
    this.initYouTubeAPI();
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

  /**
   * Load and mount YouTube IFrame API for CEbB9kdu8ng
   */
  private initYouTubeAPI() {
    if (typeof window === 'undefined') return;

    // Ensure hidden container exists in DOM
    const ensureContainer = () => {
      let container = document.getElementById(this.ytContainerId);
      if (!container) {
        container = document.createElement('div');
        container.id = this.ytContainerId;
        // Position offscreen so audio plays seamlessly without blocking UI
        container.style.position = 'fixed';
        container.style.bottom = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '200px';
        container.style.height = '200px';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '-999';
        document.body.appendChild(container);
      }
      return container;
    };

    const loadPlayer = () => {
      ensureContainer();
      try {
        this.ytPlayer = new window.YT.Player(this.ytContainerId, {
          height: '200',
          width: '200',
          videoId: this.ytVideoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            playlist: this.ytVideoId,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              this.isYTReady = true;
              if (this.isPlaying) {
                this.ytPlayer.playVideo();
                // Stop synth fallback if YT started
                this.stopSynth();
              }
            },
            onStateChange: (event: any) => {
              // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
              if (event.data === 1) {
                this.isPlaying = true;
                this.stopSynth();
                this.notify();
              } else if (event.data === 2 || event.data === 0) {
                if (!this.isUsingSynthFallback) {
                  this.isPlaying = false;
                  this.notify();
                }
              }
            },
            onError: (err: any) => {
              console.warn('YouTube IFrame restricted or blocked, falling back to acoustic synth', err);
              this.fallbackToSynth();
            },
          },
        });
      } catch (err) {
        console.warn('Could not initialize YouTube player instance:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        loadPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }
  }

  public play() {
    this.isPlaying = true;
    this.notify();

    // 1. Try YouTube Player first
    if (this.ytPlayer && this.isYTReady && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
        // Set volume to comfortable romantic level
        if (typeof this.ytPlayer.setVolume === 'function') {
          this.ytPlayer.setVolume(75);
        }
        return;
      } catch (err) {
        console.warn('YouTube playVideo failed, starting acoustic synth:', err);
      }
    }

    // 2. If YouTube is not yet ready or failed, trigger acoustic synth immediately
    this.startSynth();

    // Check again in 1.5s if YouTube initialized and can take over
    setTimeout(() => {
      if (this.ytPlayer && this.isYTReady && this.isPlaying) {
        try {
          this.ytPlayer.playVideo();
        } catch {}
      }
    }, 1500);
  }

  public pause() {
    this.isPlaying = false;
    this.notify();

    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch {}
    }

    this.stopSynth();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private fallbackToSynth() {
    this.isUsingSynthFallback = true;
    if (this.isPlaying) {
      this.startSynth();
    }
  }

  // --- Web Audio Synthesizer Fallback ---
  private initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.24, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

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

  private startSynth() {
    try {
      this.initAudioContext();
      if (!this.ctx || !this.masterGain) return;

      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 2);

      this.startDrone();
      this.startGuitarArpeggios();
      this.startGuzarishMelody();
    } catch (err) {
      console.warn('AudioContext failed:', err);
    }
  }

  private stopSynth() {
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
    }

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

  private startDrone() {
    if (!this.ctx || !this.droneGain) return;
    this.droneOscs.forEach((o) => {
      try { o.stop(); } catch {}
    });
    this.droneOscs = [];

    const freqs = [73.42, 110.0, 146.83, 220.0];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.droneGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260 + idx * 80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);

      osc.start();
      this.droneOscs.push(osc);
    });
  }

  private startGuitarArpeggios() {
    if (!this.ctx || !this.arpeggioGain) return;

    const chords = [
      [146.83, 174.61, 220.0, 293.66, 349.23, 440.0],
      [116.54, 146.83, 174.61, 233.08, 293.66, 349.23],
      [130.81, 164.81, 196.0, 261.63, 329.63, 392.0],
      [98.0, 146.83, 196.0, 233.08, 293.66, 392.0],
      [110.0, 164.81, 196.0, 220.0, 277.18, 329.63],
    ];

    let chordIdx = 0;
    let noteStep = 0;

    this.arpeggioTimer = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.arpeggioGain) return;

      const currentChord = chords[chordIdx];
      const pattern = [0, 1, 2, 4, 3, 2, 1, 3];
      const noteFreq = currentChord[pattern[noteStep % pattern.length]];

      this.playNylonPluck(noteFreq);

      noteStep++;
      if (noteStep % pattern.length === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, 280);
  }

  private playNylonPluck(freq: number) {
    if (!this.ctx || !this.arpeggioGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.8);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.arpeggioGain);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  private startGuzarishMelody() {
    const melodyPhrases = [
      [
        { note: 293.66, duration: 0.6 },
        { note: 329.63, duration: 0.5 },
        { note: 349.23, duration: 0.9 },
        { note: 329.63, duration: 0.6 },
        { note: 293.66, duration: 1.1 },
        { note: 277.18, duration: 0.5 },
        { note: 293.66, duration: 1.6 },
      ],
      [
        { note: 349.23, duration: 0.5 },
        { note: 392.0, duration: 0.5 },
        { note: 440.0, duration: 0.9 },
        { note: 466.16, duration: 0.6 },
        { note: 440.0, duration: 0.8 },
        { note: 392.0, duration: 0.6 },
        { note: 349.23, duration: 1.6 },
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
      const restDelay = (offset + 1.8) * 1000;
      this.melodyTimer = window.setTimeout(playNextPhrase, restDelay);
    };

    this.melodyTimer = window.setTimeout(playNextPhrase, 1000);
  }

  private playFluteNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.fluteGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.2, startTime);
    vibratoGain.gain.setValueAtTime(4.5, startTime);
    vibrato.connect(osc.frequency);
    vibrato.start(startTime + 0.15);
    vibrato.stop(startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.13, startTime + 0.12);
    gain.gain.setValueAtTime(0.11, startTime + duration - 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.fluteGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }
}

export const guzarishAmbiance = new GuzarishAmbianceEngine();
export const royalAmbiance = guzarishAmbiance;
