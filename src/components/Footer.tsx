import React from 'react';
import { Shield } from 'lucide-react';
import { RoyalCrest, GoldDivider } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface FooterProps {
  onOpenAdmin: () => void;
  lang?: Language;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, lang = 'en' }) => {
  const t = translations[lang];

  return (
    <footer className="bg-[#12040A] text-[#F8F5EF] pt-20 pb-14 border-t-2 border-[#D4AF67]/40 relative select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <RoyalCrest size={76} className="mx-auto mb-4 animate-float" />

        <h3 className={`text-2xl sm:text-4xl font-bold tracking-[0.15em] gold-foil-text ${
          lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
        }`}>
          {lang === 'ur' ? 'مبشر اور تسمیہ محفوظ' : 'MUBASSHIR & TASMIA MEHFOOZ'}
        </h3>

        <p className={`text-xs uppercase tracking-[0.35em] text-[#D4AF67] mt-2 font-bold ${
          lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
        }`}>
          {lang === 'ur' ? 'پروقار تقریبِ دعوتِ ولیمہ · 8 نومبر 2026ء' : 'The Grand Walima · 8 November 2026'}
        </p>

        <p className={`text-xs text-[#F7E7C4]/80 mt-1 ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
          {t.venueAddress}
        </p>

        <GoldDivider className="my-8" />

        <p className={`text-base sm:text-xl text-[#F8F5EF]/85 max-w-xl mx-auto leading-relaxed ${
          lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
        }`}>
          {lang === 'ur'
            ? '«اللّٰهُمَّ بَارِكْ لَهُمَا وَبَارِكْ عَلَيْهِمَا وَاجْمَعْ بَيْنَهُمَا فِي خَيْرٍ» — الٰہی! ان کے دلوں کو نیکی اور محبت سے جوڑ دے، ان کے گھر کو سکون بخش اور انہیں دائمی شکر اور مسرت عطا فرما۔'
            : '"O Allah, unite their hearts in righteousness, bless their home with peace, and grant them a lifetime of gratitude, love, and joy."'}
        </p>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p className={lang === 'ur' ? 'font-urdu' : 'font-sans'}>
            {lang === 'ur'
              ? 'مبشر اور تسمیہ محفوظ کی تقریبِ ولیمہ کے لیے خصوصی طور پر تیار کردہ۔'
              : 'Curated exclusively for the wedding celebration of Mubasshir & Tasmia Mehfooz.'}
          </p>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 text-xs text-[#D4AF67] hover:text-[#F7E7C4] transition-colors py-1.5 px-4 rounded-full border border-[#D4AF67]/40 hover:border-[#D4AF67] bg-white/5 font-serif-royal cursor-pointer"
          >
            <Shield size={13} />
            <span>{lang === 'ur' ? 'ایڈمن پورٹل' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
