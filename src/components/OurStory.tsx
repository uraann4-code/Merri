import React from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { GoldDivider, RoyalCrest, MughalCorner } from './MughalMotif';

export const OurStory: React.FC = () => {
  const storyChapters = [
    {
      step: '01',
      title: 'A Destined Meeting',
      subtitle: 'Where Two Hearts Found Alignment',
      date: 'The Beginning',
      desc: 'With faith, respect, and quiet shared dreams, Mubasshir and Tasmia crossed paths. What began with heartfelt understanding quickly blossomed into an enduring bond built upon shared values, laughter, and sincere companionship.',
      icon: Sparkles,
      quote: '"And We created you in pairs." — Surah An-Naba (78:8)',
    },
    {
      step: '02',
      title: 'The Families’ Blessing',
      subtitle: 'Two Legacies Becoming One',
      date: 'The Dua & Traditions',
      desc: 'Surrounded by the warm prayers of parents and elders, both families united in joyous harmony. Sweets were shared, heartfelt duas were made, and the journey toward their sacred union was sealed with unconditional love.',
      icon: Heart,
      quote: 'A celebration grounded in cultural heritage, family dignity, and mutual respect.',
    },
    {
      step: '03',
      title: 'The Grand Walima',
      subtitle: '8 November 2026 · Bukhara Royale Marquee',
      date: 'The Celebration',
      desc: 'Now, under the royal chandeliers and arches of Islamabad, Mubasshir & Tasmia invite you to celebrate their sacred Sunnah union. We eagerly await your presence to celebrate this unforgettable milestone of joy, feast, and celebration.',
      icon: Star,
      quote: 'Your presence and prayers will make this joyous day complete.',
    },
  ];

  return (
    <section id="story" className="py-24 sm:py-32 bg-[#F8F5EF] text-[#29101A] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#9E7422] font-bold">
            Our Journey of Love &amp; Faith
          </span>
          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-bold text-[#641D32] tracking-wide mt-2">
            The Story of Mubasshir &amp; Tasmia
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif-elegant italic text-lg sm:text-xl text-[#29101A]/85 leading-relaxed">
            "Every love story is written by the Divine, but ours is our most cherished blessing. We invite you to be part of the chapter where two paths merge into one."
          </p>
        </div>

        {/* Timeline Chapters */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-[#D4AF67]/20 via-[#D4AF67] to-[#D4AF67]/20" />

          <div className="space-y-16 md:space-y-20">
            {storyChapters.map((chapter, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = chapter.icon;

              return (
                <div
                  key={chapter.step}
                  className={`relative flex flex-col md:flex-row items-center gap-10 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-full md:w-1/2">
                    <div className="bg-white p-7 sm:p-9 rounded-2xl border-2 border-[#D4AF67]/35 shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
                      <MughalCorner position="top-left" className="absolute top-2 left-2" size={32} />
                      <MughalCorner position="top-right" className="absolute top-2 right-2" size={32} />

                      <div className="flex items-center justify-between mb-3 pt-2">
                        <span className="font-serif-royal text-2xl font-bold text-[#D4AF67] group-hover:scale-105 transition-transform">
                          {chapter.step}
                        </span>
                        <div className="text-xs uppercase tracking-widest font-serif-royal font-semibold text-[#641D32]">
                          {chapter.date}
                        </div>
                      </div>

                      <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#641D32]">
                        {chapter.title}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-[#9E7422] font-semibold mt-0.5 mb-3">
                        {chapter.subtitle}
                      </p>

                      <p className="text-sm text-[#29101A]/85 leading-relaxed font-sans">
                        {chapter.desc}
                      </p>

                      <div className="mt-5 pt-4 border-t border-[#D4AF67]/30 text-xs font-serif-elegant italic text-[#641D32] bg-[#F8F5EF] p-3.5 rounded-xl border border-[#D4AF67]/20">
                        {chapter.quote}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-13 h-13 rounded-full bg-[#641D32] border-2 border-[#D4AF67] text-[#D4AF67] shadow-xl z-10 group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>

                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-full max-w-sm h-52 sm:h-60 rounded-2xl overflow-hidden border-2 border-[#D4AF67] shadow-xl relative flex items-center justify-center p-6 bg-gradient-to-br from-[#4D1828] via-[#29101A] to-[#17060F] text-[#F8F5EF]">
                      <div className="absolute inset-0 dark-damask-pattern opacity-30 pointer-events-none" />
                      <div className="relative text-center">
                        <RoyalCrest size={72} className="mx-auto mb-2 opacity-95 animate-float" />
                        <h4 className="font-serif-royal text-sm font-bold tracking-wider text-[#F7E7C4]">
                          Mubasshir &amp; Tasmia
                        </h4>
                        <p className="font-serif-elegant italic text-xs text-[#D4AF67] mt-1">
                          "Bound by Grace, Blessed by Love"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
