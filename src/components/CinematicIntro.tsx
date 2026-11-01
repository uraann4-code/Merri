import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Sparkles, ArrowRight, Music2, ListMusic } from 'lucide-react';
import { RoyalCrest } from './MughalMotif';
import { royalAmbiance, WeddingTrack } from '../lib/audioAmbiance';

interface CinematicIntroProps {
  onComplete: () => void;
  guestName?: string;
  onOpenMusicSelector?: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  guestName,
  onOpenMusicSelector,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCardSlidOut, setIsCardSlidOut] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(royalAmbiance.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<WeddingTrack>(royalAmbiance.getCurrentTrack());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const unsubState = royalAmbiance.subscribe(setIsPlayingMusic);
    const unsubTrack = royalAmbiance.subscribeTrack(setCurrentTrack);
    return () => {
      unsubState();
      unsubTrack();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
  }, []);

  // Golden stardust floating particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      vx: number;
      vy: number;
      pulse: number;
    }> = [];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.25,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.55 - 0.2,
        pulse: Math.random() * 0.02 + 0.008,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.pulse;

        if (p.alpha <= 0.15 || p.alpha >= 0.85) {
          p.pulse = -p.pulse;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 103, ${Math.max(0, p.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#F7E7C4';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleOpenEnvelope = () => {
    // Play selected wedding background music
    royalAmbiance.play();
    setIsPlayingMusic(true);

    // Celebratory royal gold & ivory confetti
    try {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#D4AF67', '#E8D5A5', '#FAF7F2', '#EDE4D5', '#B88B38'],
        disableForReducedMotion: prefersReducedMotion,
      });
    } catch {}

    setIsOpen(true);

    setTimeout(() => {
      setIsCardSlidOut(true);
    }, prefersReducedMotion ? 200 : 700);

    setTimeout(() => {
      onComplete();
    }, prefersReducedMotion ? 600 : 3200);
  };

  const toggleMusic = () => {
    royalAmbiance.toggle();
    setIsPlayingMusic(royalAmbiance.getIsPlaying());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#F8F5EF] select-none text-[#2C2621]">
      {/* Golden Floating Stardust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Cinematic Elegant Ivory Vignette with subtle golden lighting */}
      <div className="absolute inset-0 bg-radial-at-c from-white/90 via-[#FAF7F2]/95 to-[#EDE4D5] pointer-events-none" />

      {/* Subtle Mughal Damask Watermark */}
      <div className="absolute inset-0 mughal-damask-pattern opacity-45 pointer-events-none" />

      {/* Top Header Bar: Track Indicator, Sound & Skip */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-40 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-full border border-[#D4AF67]/60 bg-white/90 shadow-md backdrop-blur-md">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-serif-royal uppercase tracking-wider text-[#845E1B] hover:text-[#2C2621] transition-all cursor-pointer"
            title={isPlayingMusic ? 'Mute Background Music' : 'Play Background Music'}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 size={14} className="text-[#845E1B] animate-pulse" />
                <span className="hidden sm:inline text-[11px] text-[#845E1B] font-semibold">
                  {currentTrack.title}
                </span>
              </>
            ) : (
              <>
                <Music2 size={14} className="text-[#845E1B]" />
                <span className="hidden sm:inline text-[11px] font-semibold">Play Music</span>
              </>
            )}
          </button>

          {onOpenMusicSelector && (
            <button
              onClick={onOpenMusicSelector}
              className="px-2.5 py-1 rounded-full gold-foil-bg text-[#2C2621] text-[10px] font-serif-royal font-bold uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer shadow-xs"
              title="Change wedding song"
            >
              <ListMusic size={12} className="inline mr-1" />
              <span className="hidden md:inline">Change</span>
            </button>
          )}
        </div>

        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-serif-royal uppercase tracking-wider rounded-full border border-[#D4AF67]/50 bg-white/90 text-[#2C2621] backdrop-blur-md hover:text-[#845E1B] hover:border-[#D4AF67] transition-all duration-300 shadow-sm cursor-pointer"
        >
          <span>Skip Intro</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Main Centerpiece: The Award-Winning Royal Ivory & Gold Envelope */}
      <div className="relative z-20 w-full max-w-lg px-4 flex flex-col items-center text-center">
        {/* Intro Kicker */}
        <div className={`transition-all duration-700 ${isOpen ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          <div className="flex items-center justify-center gap-2 text-xs font-serif-royal tracking-[0.3em] uppercase text-[#845E1B] mb-2 font-bold">
            <Sparkles size={12} className="text-[#D4AF67]" />
            <span>The Grand Walima</span>
            <Sparkles size={12} className="text-[#D4AF67]" />
          </div>

          <h2 className="font-serif-royal text-lg sm:text-2xl tracking-[0.15em] text-[#2C2621] uppercase font-bold drop-shadow-sm">
            A Celebration of Love &amp; Togetherness
          </h2>

          {guestName && (
            <p className="mt-2 text-sm text-[#845E1B] font-serif-elegant italic tracking-wide">
              Specially honoured for: <span className="font-bold text-[#2C2621] not-italic underline decoration-[#D4AF67]/60 underline-offset-4">{guestName}</span>
            </p>
          )}
        </div>

        {/* 3D Envelope Showcase */}
        <div className="relative my-7 sm:my-9 w-72 sm:w-92 h-52 sm:h-64 perspective-1200 flex items-center justify-center">
          {/* Envelope Main Pocket Body */}
          <div
            className={`relative w-full h-full rounded-xl transition-all duration-1000 transform-style-3d border-2 border-[#D4AF67] shadow-2xl ${
              isOpen ? 'scale-105' : 'hover:scale-[1.02]'
            }`}
            style={{
              background: 'linear-gradient(155deg, #FFFFFF 0%, #FAF7F2 50%, #EDE4D5 100%)',
              boxShadow: '0 30px 60px -15px rgba(184, 139, 56, 0.25), 0 0 35px rgba(212, 175, 103, 0.3)',
            }}
          >
            {/* Outer Gold Foil Filigree Edge */}
            <div className="absolute inset-2 border border-[#D4AF67]/50 rounded-lg pointer-events-none" />
            <div className="absolute inset-3 border border-[#D4AF67]/30 rounded pointer-events-none" />

            {/* Gold Damask Interior Liner */}
            <div
              className={`absolute inset-0 rounded-xl transition-opacity duration-700 pointer-events-none ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'radial-gradient(circle, #D4AF67 1.2px, transparent 1.2px), #FAF7F2',
                backgroundSize: '16px 16px',
              }}
            />

            {/* 3D Envelope Flap */}
            <div
              className={`absolute top-0 left-0 right-0 h-32 sm:h-36 origin-top transition-transform duration-1000 z-30 ${
                isOpen ? 'rotate-x-180 opacity-60' : 'rotate-x-0'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 60%, #EDE4D5 100%)',
                borderBottom: '2px solid rgba(212, 175, 103, 0.85)',
                filter: 'drop-shadow(0 6px 8px rgba(184, 139, 56, 0.2))',
              }}
            />

            {/* Wax Seal Medallion in Champagne Gold */}
            {!isOpen && (
              <div className="absolute top-28 sm:top-32 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 animate-candle-glow cursor-pointer" onClick={handleOpenEnvelope}>
                {/* Golden Silk Ribbons */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-16 pointer-events-none flex justify-center gap-1.5 opacity-90">
                  <div className="w-2 h-14 bg-gradient-to-b from-[#D4AF67] to-[#A67C2E] shadow-sm transform -rotate-6 rounded-b" />
                  <div className="w-2 h-14 bg-gradient-to-b from-[#ECC880] to-[#8F6317] shadow-sm transform rotate-6 rounded-b" />
                </div>

                <div className="relative flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFF3DB] via-[#D4AF67] to-[#B88B38] shadow-2xl border-2 border-[#D4AF67]">
                  <div className="w-14 h-14 rounded-full border border-[#D4AF67]/70 flex items-center justify-center bg-gradient-to-b from-[#FAF7F2] to-[#E8D5A5] shadow-inner">
                    <span className="font-serif-decorative font-bold text-sm sm:text-base text-[#2C2621] tracking-wider drop-shadow-sm">
                      M&amp;T
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Parchment Invitation Card Inside */}
            <div
              className={`absolute inset-x-2 sm:inset-x-3 inset-y-2 rounded-lg bg-[#FFFFFF] text-[#2C2621] p-4 sm:p-5 flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
                isCardSlidOut
                  ? 'translate-y-[-52%] opacity-100 z-20 shadow-[0_20px_50px_rgba(184,139,56,0.3)]'
                  : 'translate-y-0 opacity-0 z-10'
              }`}
              style={{
                border: '1.5px solid #D4AF67',
                backgroundImage: 'radial-gradient(rgba(212, 175, 103, 0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              <RoyalCrest size={32} className="mb-0.5" />
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#845E1B] font-serif-royal font-bold">
                Royal Walima Invitation
              </p>
              
              {/* Staggered Names inside envelope card */}
              <div className="flex flex-col items-center my-1 text-center">
                <div className="transform -translate-y-1 font-serif-royal text-sm sm:text-base font-bold gold-foil-text">
                  Mubasshir Qayyum
                </div>
                <div className="text-[10px] text-[#845E1B] font-serif-decorative my-0.5">&amp;</div>
                <div className="transform translate-y-1 font-serif-royal text-sm sm:text-base font-bold gold-foil-text">
                  Tasmia Mehfooz
                </div>
              </div>

              <div className="w-12 h-[1px] bg-[#D4AF67] my-0.5" />
              <p className="font-serif-elegant italic text-[10px] text-[#845E1B] font-bold">
                Sunday, 8 November 2026 • 1:00 PM PKT
              </p>
              <p className="text-[8px] uppercase tracking-wider text-[#3D332A] font-sans mt-0.5">
                Bukhara Royale Marquee • Islamabad
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Open Your Invitation */}
        {!isOpen && (
          <div className="mt-1 flex flex-col items-center">
            <button
              onClick={handleOpenEnvelope}
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-serif-royal text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#2C2621] gold-foil-bg shadow-xl shadow-[#D4AF67]/35 hover:shadow-[#D4AF67]/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-[#D4AF67]/60"
            >
              <Sparkles size={16} className="text-[#845E1B]" />
              <span>Open Your Royal Invitation</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </button>
            <p className="mt-3 text-xs text-[#5C4D3C] font-serif-elegant italic tracking-wider">
              Tap to enter with celebratory Guzarish instrumental romance
            </p>
          </div>
        )}

        {isCardSlidOut && (
          <div className="mt-4 animate-fade-in text-center">
            <p className="font-serif-royal text-xs sm:text-sm tracking-[0.3em] text-[#845E1B] uppercase animate-pulse font-bold">
              Entering Royal Walima Celebration...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
