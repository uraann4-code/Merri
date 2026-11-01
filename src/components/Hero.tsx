import React from 'react';
import { Calendar, MapPin, Clock, Heart, ChevronDown } from 'lucide-react';
import { RoyalCrest, GoldDivider, BismillahCalligraphy, MughalCorner, MughalMehrabArch } from './MughalMotif';
import { Language, translations } from '../lib/translations';

interface HeroProps {
  guestName?: string;
  familyGroup?: string;
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ guestName, familyGroup, lang }) => {
  const t = translations[lang];

  return (
    <section
      id="invitation"
      className="relative min-h-screen pt-28 pb-20 flex flex-col items-center justify-center overflow-hidden ivory-palace-gradient text-[#2C2621] select-none"
    >
      {/* Ambient Lighting in Soft Champagne Gold & Warm Beige */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-radial from-[#D4AF67]/20 via-[#E8D5A5]/15 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-32 left-10 w-96 h-96 bg-[#D4AF67]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#EDE4D5]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Mughal Geometry Watermark Pattern */}
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="w-full max-w-4xl px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Royal Card Container with Mughal Mehrab Arch */}
        <div className="w-full luxury-card-gradient p-7 sm:p-12 md:p-16 rounded-3xl border-2 border-[#D4AF67]/60 shadow-[0_25px_60px_-15px_rgba(184,139,56,0.2)] relative text-[#2C2621]">
          <MughalCorner position="top-left" className="absolute top-3.5 left-3.5" size={48} />
          <MughalCorner position="top-right" className="absolute top-3.5 right-3.5" size={48} />
          <MughalCorner position="bottom-left" className="absolute bottom-3.5 left-3.5" size={48} />
          <MughalCorner position="bottom-right" className="absolute bottom-3.5 right-3.5" size={48} />

          {/* Architectural Mehrab Arch Silhouette */}
          <MughalMehrabArch className="mb-4">
            <div className="flex justify-center -mt-6">
              <RoyalCrest size={82} className="animate-float" />
            </div>
          </MughalMehrabArch>

          {/* Sacred Bismillah Calligraphy */}
          <BismillahCalligraphy className="mb-6" />

          {/* Personalized Guest Greeting */}
          {guestName && (
            <div className="mb-6 animate-fade-in">
              <p className={`text-[11px] uppercase tracking-[0.25em] text-[#845E1B] font-bold ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {lang === 'ur' ? 'مخصوص شاہی دعوت نامہ' : 'Personalized Royal Invitation'}
              </p>
              <h2 className={`text-lg sm:text-2xl font-bold text-[#2C2621] tracking-wide mt-1 ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-elegant'
              }`}>
                {lang === 'ur'
                  ? `مہمانِ گرامی قدر: ${guestName} ${familyGroup ? `· (${familyGroup})` : ''}`
                  : `Honoured Guest: ${guestName} ${familyGroup ? `· (${familyGroup})` : ''}`}
              </h2>
            </div>
          )}

          {/* Formal Family Invitation Wording */}
          <div className="space-y-1 mb-6 text-[#2C2621]">
            <p className={`text-lg sm:text-xl text-[#845E1B] tracking-wide font-bold ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
            }`}>
              {t.togetherFamilies}
            </p>
            <p className={`text-xs sm:text-sm tracking-[0.2em] text-[#D4AF67] font-bold ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-royal uppercase'
            }`}>
              {t.requestHonour}
            </p>
            <p className={`text-sm sm:text-base text-[#3D332A] ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
            }`}>
              {t.unionText}
            </p>
          </div>

          {/* Couple Names - Perfectly Centered & Balanced */}
          <div className="py-3 relative w-full flex items-center justify-center">
            {lang === 'ur' ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-urdu text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide">
                <span className="gold-foil-text drop-shadow-sm">مبشر</span>
                <span className="font-calligraphy text-4xl sm:text-5xl text-[#845E1B] px-2">و</span>
                <span className="gold-foil-text drop-shadow-sm">تسمیہ محفوظ</span>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-6">
                <h1 className="font-serif-royal text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] gold-foil-text drop-shadow-sm">
                  MUBASSHIR
                </h1>

                <div className="flex items-center justify-center my-0.5 md:my-0">
                  <span className="font-calligraphy text-4xl sm:text-5xl md:text-6xl text-[#845E1B] px-2 select-none">
                    &amp;
                  </span>
                </div>

                <h1 className="font-serif-royal text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] gold-foil-text drop-shadow-sm">
                  TASMIA <span className="text-[#2C2621]">MEHFOOZ</span>
                </h1>
              </div>
            )}
          </div>

          <GoldDivider className="my-6" />

          {/* Event Metadata Label */}
          <div className="mb-6">
            <span className={`text-xs sm:text-sm tracking-[0.3em] text-[#845E1B] font-bold ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-royal uppercase'
            }`}>
              {t.walimaReception}
            </span>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-3 pb-6 border-y border-[#D4AF67]/30 text-[#2C2621]">
            <div className="flex flex-col items-center p-3.5 bg-white/80 rounded-xl border border-[#D4AF67]/35 shadow-sm">
              <Calendar className="text-[#845E1B] mb-1.5" size={20} />
              <span className={`text-[10px] uppercase tracking-widest text-[#845E1B] font-bold ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {lang === 'ur' ? 'تاریخ' : 'Date'}
              </span>
              <span className={`text-sm sm:text-base font-bold mt-0.5 text-[#2C2621] ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {t.eventDate}
              </span>
            </div>

            <div className="flex flex-col items-center p-3.5 bg-white/80 rounded-xl border border-[#D4AF67]/35 shadow-sm">
              <Clock className="text-[#845E1B] mb-1.5" size={20} />
              <span className={`text-[10px] uppercase tracking-widest text-[#845E1B] font-bold ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {lang === 'ur' ? 'وقت' : 'Reception Time'}
              </span>
              <span className={`text-sm sm:text-base font-bold mt-0.5 text-[#2C2621] ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {t.eventTime}
              </span>
              <span className={`text-[10px] text-[#5C4D3C] ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                {t.eventTimezone}
              </span>
            </div>

            <div className="flex flex-col items-center p-3.5 bg-white/80 rounded-xl border border-[#D4AF67]/35 shadow-sm">
              <MapPin className="text-[#845E1B] mb-1.5" size={20} />
              <span className={`text-[10px] uppercase tracking-widest text-[#845E1B] font-bold ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {lang === 'ur' ? 'مقام' : 'Venue'}
              </span>
              <span className={`text-sm sm:text-base font-bold mt-0.5 text-[#2C2621] ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {t.venueName}
              </span>
              <span className={`text-[10px] text-[#5C4D3C] ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                {lang === 'ur' ? 'مین ایکسپریس وے، اسلام آباد' : 'Main Expressway, Islamabad'}
              </span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full gold-foil-bg text-[#2C2621] font-serif-royal text-xs sm:text-sm font-bold tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#D4AF67]/35 border border-[#D4AF67]/50"
            >
              <Heart size={16} className="fill-[#2C2621]" />
              <span>{t.rsvpButton}</span>
            </a>

            <a
              href="#event"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D4AF67] bg-white hover:bg-[#EDE4D5] text-[#2C2621] font-serif-royal text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-all shadow-sm"
            >
              <Calendar size={15} className="text-[#845E1B]" />
              <span>{t.eventDetailsButton}</span>
            </a>

            <a
              href="#venue"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D4AF67]/60 bg-white/80 hover:bg-[#EDE4D5] text-[#2C2621] font-serif-royal text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-all shadow-sm"
            >
              <MapPin size={15} className="text-[#845E1B]" />
              <span>{t.directionsButton}</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#story"
          aria-label="Scroll to Our Story"
          className="mt-10 inline-flex flex-col items-center text-[#845E1B] hover:text-[#2C2621] transition-colors"
        >
          <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
            {lang === 'ur' ? 'ہماری کہانی' : 'Our Story'}
          </span>
          <ChevronDown size={18} className="animate-bounce mt-1" />
        </a>
      </div>
    </section>
  );
};
