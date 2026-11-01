import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Sparkles, ArrowRight, Music2 } from 'lucide-react';
import { RoyalCrest } from './MughalMotif';
import { guzarishAmbiance } from '../lib/audioAmbiance';

interface CinematicIntroProps {
  onComplete: () => void;
  guestName?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, guestName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCardSlidOut, setIsCardSlidOut] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    // Play Guzarish romance melody
    guzarishAmbiance.play();
    setIsPlayingMusic(true);

    // Celebratory royal gold & ruby confetti
    try {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#D4AF67', '#F7E7C4', '#641D32', '#FFF3DB', '#A97A24'],
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
    guzarishAmbiance.toggle();
    setIsPlayingMusic(guzarishAmbiance.getIsPlaying());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#1C0912] select-none text-[#F8F5EF]">
      {/* Golden Floating Stardust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Cinematic Deep Burgundy Vignette with warm golden radial glow */}
      <div className="absolute inset-0 bg-radial-at-c from-[#4D1828]/50 via-[#230C16]/85 to-[#120409] pointer-events-none" />

      {/* Subtle Mughal Damask Watermark */}
      <div className="absolute inset-0 dark-damask-pattern opacity-40 pointer-events-none" />

      {/* Top Header Bar: Track Indicator, Sound & Skip */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-40 flex items-center gap-3">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-serif-royal uppercase tracking-wider rounded-full border border-[#D4AF67]/50 bg-[#29101A]/80 text-[#D4AF67] backdrop-blur-md hover:bg-[#641D32]/60 transition-all duration-300 shadow-lg"
          title={isPlayingMusic ? 'Mute Guzarish Melodic Romance' : 'Play Guzarish Melodic Romance'}
        >
          {isPlayingMusic ? (
            <>
              <Volume2 size={14} className="text-[#F7E7C4] animate-pulse" />
              <span className="hidden sm:inline text-[11px] text-[#F7E7C4]">Guzarish · Satinder Sartaaj</span>
            </>
          ) : (
            <>
              <Music2 size={14} className="text-[#D4AF67]" />
              <span className="hidden sm:inline text-[11px]">Play Guzarish</span>
            </>
          )}
        </button>

        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-serif-royal uppercase tracking-wider rounded-full border border-white/20 bg-[#29101A]/80 text-[#F8F5EF]/80 backdrop-blur-md hover:text-[#D4AF67] hover:border-[#D4AF67] transition-all duration-300"
        >
          <span>Skip Intro</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Main Centerpiece: The Award-Winning Royal Envelope */}
      <div className="relative z-20 w-full max-w-lg px-4 flex flex-col items-center text-center">
        {/* Intro Kicker */}
        <div className={`transition-all duration-700 ${isOpen ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          <div className="flex items-center justify-center gap-2 text-xs font-serif-royal tracking-[0.3em] uppercase text-[#D4AF67] mb-2 font-medium">
            <Sparkles size={12} className="text-[#F7E7C4]" />
            <span>The Grand Walima</span>
            <Sparkles size={12} className="text-[#F7E7C4]" />
          </div>

          <h2 className="font-serif-royal text-lg sm:text-2xl tracking-[0.15em] text-white uppercase font-bold drop-shadow-md">
            A Celebration of Love &amp; Togetherness
          </h2>

          {guestName && (
            <p className="mt-2 text-sm text-[#F7E7C4] font-serif-elegant italic tracking-wide">
              Specially honoured for: <span className="font-bold text-white not-italic underline decoration-[#D4AF67]/60 underline-offset-4">{guestName}</span>
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
              background: 'linear-gradient(155deg, #421424 0%, #29101A 60%, #190910 100%)',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 103, 0.25)',
            }}
          >
            {/* Outer Gold Foil Filigree Edge */}
            <div className="absolute inset-2 border border-[#D4AF67]/40 rounded-lg pointer-events-none" />
            <div className="absolute inset-3 border border-[#D4AF67]/20 rounded pointer-events-none" />

            {/* Gold Paisley Damask Interior Liner */}
            <div
              className={`absolute inset-0 rounded-xl transition-opacity duration-700 pointer-events-none ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'radial-gradient(circle, #ECC880 1px, transparent 1px), #361220',
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
                background: 'linear-gradient(180deg, #4A1728 0%, #30111D 80%, #200B13 100%)',
                borderBottom: '2px solid rgba(212, 175, 103, 0.7)',
                filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.4))',
              }}
            />

            {/* Wax Seal Medallion */}
            {!isOpen && (
              <div className="absolute top-28 sm:top-32 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 animate-candle-glow cursor-pointer" onClick={handleOpenEnvelope}>
                {/* Golden Silk Ribbons */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-16 pointer-events-none flex justify-center gap-1.5 opacity-90">
                  <div className="w-2 h-14 bg-gradient-to-b from-[#D4AF67] to-[#A67C2E] shadow-sm transform -rotate-6 rounded-b" />
                  <div className="w-2 h-14 bg-gradient-to-b from-[#ECC880] to-[#8F6317] shadow-sm transform rotate-6 rounded-b" />
                </div>

                <div className="relative flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#7A1F38] via-[#641D32] to-[#3B0E1B] shadow-2xl border-2 border-[#D4AF67]">
                  <div className="w-14 h-14 rounded-full border border-[#D4AF67]/60 flex items-center justify-center bg-gradient-to-b from-[#641D32] to-[#451221] shadow-inner">
                    <span className="font-serif-decorative font-bold text-sm sm:text-base text-[#F7E7C4] tracking-wider drop-shadow">
                      M&amp;T
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Parchment Invitation Card */}
            <div
              className={`absolute inset-x-2 sm:inset-x-3 inset-y-2 rounded-lg bg-[#FAF7F2] text-[#29101A] p-5 sm:p-6 flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ${
                isCardSlidOut
                  ? 'translate-y-[-52%] opacity-100 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
                  : 'translate-y-0 opacity-0 z-10'
              }`}
              style={{
                border: '1.5px solid #D4AF67',
                backgroundImage: 'radial-gradient(rgba(212, 175, 103, 0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              <RoyalCrest size={44} className="mb-1" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#641D32] font-serif-royal font-bold">
                Royal Walima Invitation
              </p>
              <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#641D32] tracking-wide mt-1">
                Mubasshir &amp; Tasmia
              </h3>
              <div className="w-16 h-[1px] bg-[#D4AF67] my-1" />
              <p className="font-serif-elegant italic text-xs text-[#9E7422]">
                Sunday, 8 November 2026 • 1:00 PM PKT
              </p>
              <p className="text-[10px] uppercase tracking-wider text-[#29101A]/70 font-sans mt-0.5">
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
              className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-serif-royal text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#29101A] gold-foil-bg shadow-xl shadow-[#D4AF67]/25 hover:shadow-[#D4AF67]/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Sparkles size={16} className="text-[#641D32] animate-spin-slow" />
              <span>Open Your Royal Invitation</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </button>
            <p className="mt-3 text-xs text-[#F7E7C4]/80 font-serif-elegant italic tracking-wider">
              Tap to enter with celebratory Guzarish instrumental romance
            </p>
          </div>
        )}

        {isCardSlidOut && (
          <div className="mt-4 animate-fade-in text-center">
            <p className="font-serif-royal text-xs sm:text-sm tracking-[0.3em] text-[#F7E7C4] uppercase animate-pulse">
              Entering Royal Walima Celebration...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
