import React from 'react';
import { Shield } from 'lucide-react';
import { RoyalCrest, GoldDivider } from './MughalMotif';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#12040A] text-[#F8F5EF] pt-20 pb-14 border-t-2 border-[#D4AF67]/40 relative select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <RoyalCrest size={76} className="mx-auto mb-4 animate-float" />

        <h3 className="font-serif-royal text-2xl sm:text-4xl font-bold tracking-[0.15em] gold-foil-text">
          MUBASSHIR &amp; TASMIA MEHFOOZ
        </h3>

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF67] mt-2 font-serif-royal font-bold">
          The Grand Baraat · 8 November 2026
        </p>

        <p className="text-xs text-[#F7E7C4]/80 mt-1 font-sans">
          Bukhara Royale Marquee · Main Expressway, Islamabad, Pakistan
        </p>

        <GoldDivider className="my-8" />

        <p className="font-serif-elegant italic text-base sm:text-xl text-[#F8F5EF]/85 max-w-xl mx-auto leading-relaxed">
          "O Allah, unite their hearts in righteousness, bless their home with peace, and grant them a lifetime of gratitude, love, and joy."
        </p>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p className="font-sans">
            Curated exclusively for the wedding celebration of Mubasshir &amp; Tasmia Mehfooz.
          </p>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 text-xs text-[#D4AF67] hover:text-[#F7E7C4] transition-colors py-1.5 px-4 rounded-full border border-[#D4AF67]/40 hover:border-[#D4AF67] bg-white/5 font-serif-royal"
          >
            <Shield size={13} />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
