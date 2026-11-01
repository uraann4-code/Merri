import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { GoldDivider, RoyalCrest, MughalCorner } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface CountdownProps {
  lang?: Language;
}

export const Countdown: React.FC<CountdownProps> = ({ lang = 'en' }) => {
  const t = translations[lang];

  // Target: 8 November 2026, 1:00 PM Pakistan Standard Time (UTC+5)
  const targetDate = new Date('2026-11-08T13:00:00+05:00').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { label: t.countdownDays, value: timeLeft.days },
    { label: t.countdownHours, value: timeLeft.hours },
    { label: t.countdownMinutes, value: timeLeft.minutes },
    { label: t.countdownSeconds, value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-24 sm:py-28 bg-[#F8F5EF] text-[#29101A] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#9E7422] font-bold">
          {lang === 'ur' ? 'شمارِ لمحۂ مسرت' : 'Count Every Blessed Second'}
        </span>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#641D32] tracking-wide mt-2 ${
          lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
        }`}>
          {t.countdownTitle}
        </h2>
        <GoldDivider className="my-5" />

        {timeLeft.isPast ? (
          /* Post-Event Celebration Message */
          <div className="burgundy-card-gradient text-[#F8F5EF] p-8 sm:p-14 rounded-3xl border-2 border-[#D4AF67] shadow-2xl max-w-2xl mx-auto animate-fade-in relative">
            <MughalCorner position="top-left" className="absolute top-3 left-3" size={36} />
            <MughalCorner position="top-right" className="absolute top-3 right-3" size={36} />
            <RoyalCrest size={72} className="mx-auto mb-4" />
            <h3 className={`text-2xl sm:text-3xl font-bold text-[#F7E7C4] tracking-wider uppercase ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
            }`}>
              {t.mubarakCelebration}
            </h3>
            <p className="font-serif-elegant italic text-xl text-white mt-3 leading-relaxed">
              "بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ"
            </p>
            <p className={`text-sm text-[#F7E7C4]/90 mt-2 ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
              {t.mubarakDua}
            </p>
          </div>
        ) : (
          /* Live Countdown Clock Cards */
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#641D32] mb-10 font-serif-royal font-semibold">
              <span>{t.eventDate}</span>
              <span aria-hidden="true">·</span>
              <span>{t.eventTime} {t.eventTimezone}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="bg-white rounded-3xl border-2 border-[#D4AF67]/50 p-6 sm:p-7 shadow-xl relative overflow-hidden group hover:border-[#D4AF67] transition-all hover:scale-105"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 gold-foil-bg" />

                  <div className="font-serif-royal text-4xl sm:text-5xl md:text-6xl font-bold text-[#641D32] tracking-tight">
                    {String(unit.value).padStart(2, '0')}
                  </div>

                  <div className={`mt-2 text-xs uppercase tracking-[0.25em] font-bold text-[#9E7422] ${
                    lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
                  }`}>
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-10 flex items-center justify-center gap-2 text-sm text-[#641D32] ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
            }`}>
              <Sparkles size={16} className="text-[#D4AF67]" />
              <span>
                {lang === 'ur'
                  ? 'ہم آپ کے ہمراہ اس تاریخی اور بابرکت دن کے شاہد بننے کے لیے بے تاب ہیں۔'
                  : 'We eagerly await sharing this historic celebration with you.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
