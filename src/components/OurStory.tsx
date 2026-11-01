import React from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { GoldDivider, RoyalCrest, MughalCorner } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface OurStoryProps {
  lang?: Language;
}

export const OurStory: React.FC<OurStoryProps> = ({ lang = 'en' }) => {
  const t = translations[lang];

  const storyChapters = [
    {
      step: '01',
      title: lang === 'ur' ? 'مقدر کا مبارک سفر' : 'A Destined Meeting',
      subtitle: lang === 'ur' ? 'جہاں دو دل ایک مقصد پر متفق ہوئے' : 'Where Two Hearts Found Alignment',
      date: lang === 'ur' ? 'خوبصورت آغاز' : 'The Beginning',
      desc: lang === 'ur'
        ? 'خلوص، احترام اور یکساں اقدار کے ساتھ مبشر اور تسمیہ کے راستے باہم ملے۔ ایک باوقار آغاز نے جلد ہی باہمی اعتماد، سنجیدگی اور چاہت کے خوبصورت رشتے کی صورت اختیار کر لی۔'
        : 'With faith, respect, and quiet shared dreams, Mubasshir and Tasmia crossed paths. What began with heartfelt understanding quickly blossomed into an enduring bond built upon shared values, laughter, and sincere companionship.',
      icon: Sparkles,
      quote: lang === 'ur' ? '«وَخَلَقْنَاكُمْ أَزْوَاجًا» — "اور ہم نے تمہیں جوڑوں کی صورت پیدا کیا" (النباء: 8)' : '"And We created you in pairs." — Surah An-Naba (78:8)',
    },
    {
      step: '02',
      title: lang === 'ur' ? 'بزرگوں کی دعائیں و برکت' : 'The Families’ Blessing',
      subtitle: lang === 'ur' ? 'دو خاندانوں کا پُروقار اتحاد' : 'Two Legacies Becoming One',
      date: lang === 'ur' ? 'روایات و دعائے خیر' : 'The Dua & Traditions',
      desc: lang === 'ur'
        ? 'والدین اور خاندان کے معزز بزرگوں کی دعاؤں کے سائے میں دونوں خاندانوں نے خوشی سے اس مبارک رشتے کو قبول کیا۔ روایتی شیرینی اور نیک تمناؤں کے ساتھ دائمی سفر کی بنیاد رکھی گئی۔'
        : 'Surrounded by the warm prayers of parents and elders, both families united in joyous harmony. Sweets were shared, heartfelt duas were made, and the journey toward their sacred union was sealed with unconditional love.',
      icon: Heart,
      quote: lang === 'ur' ? 'خاندانی وقار، باہمی احترام اور اسلامی روایات سے سجا پُروقار سنگ میل۔' : 'A celebration grounded in cultural heritage, family dignity, and mutual respect.',
    },
    {
      step: '03',
      title: lang === 'ur' ? 'تقریبِ ولیمہ کا شاہی جشن' : 'The Grand Walima',
      subtitle: lang === 'ur' ? '8 نومبر 2026ء · بخارا روئیل مارکی، اسلام آباد' : '8 November 2026 · Bukhara Royale Marquee',
      date: lang === 'ur' ? 'شاہی تقریب' : 'The Celebration',
      desc: lang === 'ur'
        ? 'اب اسلام آباد کی پُروقار بخارا روئیل مارکی کے سحر انگیز ماحول میں مبشر اور تسمیہ محفوظ اپنی مسرور کن سنتِ ولیمہ پر آپ کی پُرتپاک شرکت کے منتظر ہیں۔'
        : 'Now, under the royal chandeliers and arches of Islamabad, Mubasshir & Tasmia invite you to celebrate their sacred Sunnah union. We eagerly await your presence to celebrate this unforgettable milestone of joy, feast, and celebration.',
      icon: Star,
      quote: lang === 'ur' ? 'آپ کی آمد اور دعائیں ہمارے اس یادگار دن کو دوبالا کر دیں گی۔' : 'Your presence and prayers will make this joyous day complete.',
    },
  ];

  return (
    <section id="story" className="py-24 sm:py-32 bg-[#F8F5EF] text-[#2C2621] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#845E1B] font-bold">
            {t.ourStorySubtitle}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2621] tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {t.ourStoryTitle}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-lg sm:text-xl text-[#3D332A] leading-relaxed ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {t.ourStoryQuote}
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
                    <div className="bg-white p-7 sm:p-9 rounded-2xl border-2 border-[#D4AF67]/40 shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
                      <MughalCorner position="top-left" className="absolute top-2 left-2" size={32} />
                      <MughalCorner position="top-right" className="absolute top-2 right-2" size={32} />

                      <div className="flex items-center justify-between mb-3 pt-2">
                        <span className="font-serif-royal text-2xl font-bold text-[#D4AF67] group-hover:scale-105 transition-transform">
                          {chapter.step}
                        </span>
                        <div className="text-xs uppercase tracking-widest font-serif-royal font-bold text-[#845E1B]">
                          {chapter.date}
                        </div>
                      </div>

                      <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2C2621]">
                        {chapter.title}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-[#845E1B] font-semibold mt-0.5 mb-3">
                        {chapter.subtitle}
                      </p>

                      <p className="text-sm text-[#3D332A] leading-relaxed font-sans">
                        {chapter.desc}
                      </p>

                      <div className="mt-5 pt-4 border-t border-[#D4AF67]/30 text-xs font-serif-elegant italic text-[#845E1B] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#D4AF67]/20 font-semibold">
                        {chapter.quote}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-13 h-13 rounded-full bg-white border-2 border-[#D4AF67] text-[#845E1B] shadow-xl z-10 group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>

                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-full max-w-sm h-52 sm:h-60 rounded-2xl overflow-hidden border-2 border-[#D4AF67] shadow-xl relative flex items-center justify-center p-6 luxury-card-gradient text-[#2C2621]">
                      <div className="absolute inset-0 mughal-damask-pattern opacity-30 pointer-events-none" />
                      <div className="relative text-center">
                        <RoyalCrest size={72} className="mx-auto mb-2 opacity-95 animate-float" />
                        <h4 className="font-serif-royal text-base font-bold tracking-wider text-[#2C2621]">
                          Mubasshir &amp; Tasmia
                        </h4>
                        <p className="font-serif-elegant italic text-xs text-[#845E1B] font-bold mt-1">
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
