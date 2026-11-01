import React from 'react';

/**
 * Royal Monogram Crest Seal with Imperial Mughal Crown
 */
export const RoyalCrest: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 84 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#D4AF67] drop-shadow-[0_4px_12px_rgba(212,175,103,0.35)]"
      >
        {/* Outer Circular Floral Garland */}
        <circle cx="60" cy="60" r="56" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <circle cx="60" cy="60" r="52" stroke="url(#goldGrad)" strokeWidth="1.8" />
        <circle cx="60" cy="60" r="47" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.5" />

        {/* 12-petaled Mughal Lotus Rosette */}
        <path
          d="M60 10 L63 25 L75 18 L73 32 L87 31 L80 44 L94 49 L83 59 L94 69 L80 74 L87 87 L73 86 L75 100 L63 93 L60 108 L57 93 L45 100 L47 86 L33 87 L40 74 L26 69 L37 59 L26 49 L40 44 L33 31 L47 32 L45 18 L57 25 Z"
          fill="rgba(212, 175, 103, 0.08)"
          stroke="url(#goldGrad)"
          strokeWidth="0.85"
        />

        {/* Imperial Kalgi / Royal Sarpech Ornament */}
        <path
          d="M52 28 C56 20, 64 20, 68 28 C64 25, 56 25, 52 28 Z"
          fill="url(#goldGrad)"
        />
        <circle cx="60" cy="18" r="2.2" fill="url(#goldGrad)" />
        <circle cx="54" cy="22" r="1.5" fill="url(#goldGrad)" />
        <circle cx="66" cy="22" r="1.5" fill="url(#goldGrad)" />

        {/* Couple Initials Monogram M & T */}
        <text
          x="60"
          y="67"
          textAnchor="middle"
          fontFamily="'Cinzel Decorative', 'Cinzel', serif"
          fontWeight="700"
          fontSize="22"
          fill="url(#goldGrad)"
          letterSpacing="1.5"
        >
          M&amp;T
        </text>

        {/* Year & Union */}
        <text
          x="60"
          y="81"
          textAnchor="middle"
          fontFamily="'Cinzel', serif"
          fontWeight="600"
          fontSize="7.5"
          fill="#F7E7C4"
          letterSpacing="3"
        >
          2026
        </text>

        {/* Gradients */}
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3DB" />
            <stop offset="35%" stopColor="#D4AF67" />
            <stop offset="70%" stopColor="#EAC875" />
            <stop offset="100%" stopColor="#A97A24" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/**
 * Authentic Mughal Arch (Mehrab Cusped Arch) Frame
 */
export const MughalMehrabArch: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top Cusped Arch Silhouette */}
      <svg
        viewBox="0 0 400 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full text-[#D4AF67] mb-2 drop-shadow-sm"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 L0 25 C60 25, 120 45, 160 25 C175 18, 185 10, 200 0 C215 10, 225 18, 240 25 C280 45, 340 25, 400 25 L400 60 Z"
          fill="rgba(212, 175, 103, 0.08)"
          stroke="url(#archGold)"
          strokeWidth="1.5"
        />
        <path
          d="M20 60 L20 35 C70 35, 125 50, 165 33 C180 25, 188 18, 200 8 C212 18, 220 25, 235 33 C275 50, 330 35, 380 35 L380 60"
          stroke="url(#archGold)"
          strokeWidth="0.8"
          strokeDasharray="4 2"
          opacity="0.65"
        />
        <defs>
          <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF67" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFF3DB" stopOpacity="1" />
            <stop offset="100%" stopColor="#D4AF67" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
      {children}
    </div>
  );
};

/**
 * Mughal Corner Floral Filigree
 */
export const MughalCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
}> = ({ position, className = '', size = 56 }) => {
  const rotation =
    position === 'top-left'
      ? 'rotate-0'
      : position === 'top-right'
      ? 'rotate-90'
      : position === 'bottom-right'
      ? 'rotate-180'
      : '-rotate-90';

  return (
    <div className={`pointer-events-none transform ${rotation} ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#D4AF67]">
        {/* Outer Corner Frame */}
        <path d="M2 2 L56 2 C44 2 36 8 36 22 C36 34 24 38 2 38 L2 2 Z" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.65" />
        <path d="M6 6 L44 6 C35 6 28 11 28 22 C28 30 19 32 6 32 Z" stroke="currentColor" strokeWidth="0.8" fill="rgba(212,175,103,0.06)" />
        {/* Floral Rosette */}
        <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2" />
        <path d="M2 2 L2 56" stroke="currentColor" strokeWidth="2" />
        <path d="M2 2 L56 2" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
};

/**
 * Royal Gold Divider with 8-Pointed Star & Floral Accents
 */
export const GoldDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 w-full max-w-lg mx-auto my-6 select-none ${className}`}>
      <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF67]/50 to-[#D4AF67]" />
      <div className="flex items-center gap-1.5 text-[#D4AF67]">
        <span className="w-1.5 h-1.5 rotate-45 border border-[#D4AF67] bg-[#D4AF67]/40" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D4AF67] drop-shadow-sm">
          {/* Mughal Star Floret */}
          <path
            d="M12 1L14.5 8.5L22 12L14.5 15.5L12 23L9.5 15.5L2 12L9.5 8.5L12 1Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          <circle cx="12" cy="12" r="2.5" fill="#F8F5EF" stroke="#D4AF67" strokeWidth="0.8" />
        </svg>
        <span className="w-1.5 h-1.5 rotate-45 border border-[#D4AF67] bg-[#D4AF67]/40" />
      </div>
      <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF67]/50 to-[#D4AF67]" />
    </div>
  );
};

/**
 * Sacred Bismillah Calligraphy
 */
export const BismillahCalligraphy: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`text-center select-none ${className}`}>
      <p
        className="font-serif-elegant text-3xl sm:text-4xl text-[#D4AF67] tracking-wider mb-1 font-medium drop-shadow-sm"
        style={{ fontFamily: "'Cormorant Garamond', 'Amiri', serif" }}
      >
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
      </p>
      <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#D4AF67]/80 tracking-[0.25em] uppercase font-serif-royal">
        <span>In the name of Allah</span>
        <span>·</span>
        <span>The Most Beneficent</span>
        <span>·</span>
        <span>The Most Merciful</span>
      </div>
    </div>
  );
};
