/**
 * Royal Wedding YouTube Audio Engine
 * 
 * Configured to play the user's requested YouTube track (azclzLU313E)
 * with robust YouTube IFrame API integration.
 */

export interface WeddingTrack {
  id: string;
  title: string;
  artist: string;
  tag: string;
  youtubeId: string;
}

export const CURATED_TRACKS: WeddingTrack[] = [
  {
    id: 'user_requested_track',
    title: 'Walima Cinematic Background Theme',
    artist: 'Custom YouTube Selection',
    tag: 'User Choice',
    youtubeId: 'azclzLU313E',
  },
  {
    id: 'guzarish',
    title: 'Guzarish (Walima Anthem)',
    artist: 'Satinder Sartaaj',
    tag: 'Cinematic Wedding Romance',
    youtubeId: 'CEbB9kdu8ng',
  },
  {
    id: 'din_shagna',
    title: 'Din Shagna Da',
    artist: 'Jasleen Royal',
    tag: 'Bridal & Walima Entrance',
    youtubeId: '147kJWzJk5g',
  },
  {
    id: 'afreen',
    title: 'Afreen Afreen',
    artist: 'Rahat Fateh Ali Khan & Momina Mustehsan',
    tag: 'Coke Studio Classic',
    youtubeId: 'kw4tT7SCmaY',
  },
];

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

class RoyalWeddingAudioEngine {
  private ytPlayer: any = null;
  private isYTReady: boolean = false;
  private isPlaying: boolean = false;
  private ytContainerId: string = 'youtube-music-player';
  private currentTrack: WeddingTrack = CURATED_TRACKS[0];
  private volume: number = 75;

  private stateListeners: Set<(playing: boolean) => void> = new Set();
  private trackListeners: Set<(track: WeddingTrack) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedTrackId = localStorage.getItem('walima_selected_track');
        if (savedTrackId) {
          const found = CURATED_TRACKS.find((t) => t.id === savedTrackId);
          if (found) this.currentTrack = found;
        }
      } catch {}
      this.initYouTubeAPI();
    }
  }

  public getTrackTitle(): string {
    return `${this.currentTrack.title} · ${this.currentTrack.artist}`;
  }

  public getCurrentTrack(): WeddingTrack {
    return this.currentTrack;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(this.volume);
      } catch {}
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.stateListeners.add(cb);
    cb(this.isPlaying);
    return () => {
      this.stateListeners.delete(cb);
    };
  }

  public subscribeTrack(cb: (track: WeddingTrack) => void) {
    this.trackListeners.add(cb);
    cb(this.currentTrack);
    return () => {
      this.trackListeners.delete(cb);
    };
  }

  private notify() {
    this.stateListeners.forEach((cb) => cb(this.isPlaying));
  }

  private notifyTrack() {
    this.trackListeners.forEach((cb) => cb(this.currentTrack));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public selectTrack(trackOrId: string | WeddingTrack) {
    let targetTrack: WeddingTrack;

    if (typeof trackOrId === 'string') {
      const found = CURATED_TRACKS.find((t) => t.id === trackOrId);
      if (found) {
        targetTrack = found;
      } else {
        const parsedId = this.extractYouTubeId(trackOrId) || trackOrId;
        targetTrack = {
          id: `custom_${Date.now()}`,
          title: 'Selected Wedding Song',
          artist: 'Custom YouTube Audio',
          tag: 'Guest Choice',
          youtubeId: parsedId,
        };
      }
    } else {
      targetTrack = trackOrId;
    }

    this.currentTrack = targetTrack;
    try {
      localStorage.setItem('walima_selected_track', targetTrack.id);
    } catch {}

    this.notifyTrack();

    if (this.ytPlayer && this.isYTReady && typeof this.ytPlayer.loadVideoById === 'function') {
      try {
        if (this.isPlaying) {
          this.ytPlayer.loadVideoById(targetTrack.youtubeId);
          this.ytPlayer.setVolume(this.volume);
        } else {
          this.ytPlayer.cueVideoById(targetTrack.youtubeId);
        }
      } catch (err) {
        console.warn('Could not switch YouTube video:', err);
      }
    }
  }

  public setCustomYouTubeTrack(urlOrId: string, title?: string, artist?: string) {
    const videoId = this.extractYouTubeId(urlOrId) || urlOrId.trim();
    if (!videoId) return;

    const customTrack: WeddingTrack = {
      id: `custom_${Date.now()}`,
      title: title || 'Custom Wedding Song',
      artist: artist || 'YouTube Selection',
      tag: 'Custom Song',
      youtubeId: videoId,
    };

    this.selectTrack(customTrack);
    if (!this.isPlaying) {
      this.play();
    }
  }

  private extractYouTubeId(url: string): string | null {
    if (!url) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return url.trim();
    }
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  private initYouTubeAPI() {
    if (typeof window === 'undefined') return;

    const ensureContainer = () => {
      let container = document.getElementById(this.ytContainerId);
      if (!container) {
        container = document.createElement('div');
        container.id = this.ytContainerId;
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
          videoId: this.currentTrack.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: this.currentTrack.youtubeId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              this.isYTReady = true;
              if (this.isPlaying) {
                try {
                  this.ytPlayer.setVolume(this.volume);
                  this.ytPlayer.playVideo();
                } catch {}
              }
            },
            onStateChange: (event: any) => {
              if (event.data === 1) {
                this.isPlaying = true;
                this.notify();
              } else if (event.data === 2 || event.data === 0) {
                this.isPlaying = false;
                this.notify();
              }
            },
            onError: (err: any) => {
              console.warn('YouTube player error:', err);
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

    if (this.ytPlayer && this.isYTReady && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.setVolume(this.volume);
        this.ytPlayer.playVideo();
      } catch (err) {
        console.warn('YouTube playVideo failed:', err);
      }
    } else {
      setTimeout(() => {
        if (this.ytPlayer && this.isYTReady && this.isPlaying) {
          try {
            this.ytPlayer.setVolume(this.volume);
            this.ytPlayer.playVideo();
          } catch {}
        }
      }, 1000);
    }
  }

  public pause() {
    this.isPlaying = false;
    this.notify();

    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch {}
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}

export const royalAmbiance = new RoyalWeddingAudioEngine();
export const guzarishAmbiance = royalAmbiance;
