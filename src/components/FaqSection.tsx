import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Clock, MapPin, Sparkles, Car, CheckCircle } from 'lucide-react';
import { GoldDivider } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface FaqSectionProps {
  lang?: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang = 'en' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = translations[lang];

  const faqs = [
    {
      q: lang === 'ur' ? 'تقریبِ ولیمہ کے اوقات کیا ہیں؟' : 'What are the exact event timings for the Walima?',
      a: lang === 'ur'
        ? 'تقریبِ ولیمہ اتوار، 8 نومبر 2026ء کو منعقد ہو گی۔ مہمانوں کی تشریف آوری اور استقبال دوپہر 1:00 بجے شروع ہو جائے گا۔ آپ سے التماس ہے کہ بروقت تشریف لا کر پروقار استقبالیہ رسومات میں شامل ہوں۔'
        : 'The Walima will take place on Sunday, 8 November 2026. The reception will commence at 1:00 PM Pakistan Standard Time (PKT). Guests are kindly requested to arrive by 1:00 PM to partake in the warm Istiqbal and welcoming ceremonies.',
      icon: Clock,
    },
    {
      q: lang === 'ur' ? 'بخارا روئیل مارکی کا درست مقام کیا ہے؟' : 'Where is Bukhara Royale Marquee located?',
      a: lang === 'ur'
        ? 'بخارا روئیل مارکی مین اسلام آباد ایکسپریس وے، نزد گلبرگ گرینز، اسلام آباد پر واقع ہے۔ یہ اسلام آباد اور راولپنڈی کے تمام اہم علاقوں سے چند ہی منٹوں کی مسافت پر ہے۔'
        : 'Bukhara Royale Marquee is located on the Main Islamabad Expressway, near Gulberg Greens, Islamabad, Pakistan. It is centrally situated and accessible within minutes from Islamabad and Rawalpindi.',
      icon: MapPin,
    },
    {
      q: lang === 'ur' ? 'لباس کے حوالے سے کیا رہنمائی ہے؟' : 'What is the suggested dress code?',
      a: lang === 'ur'
        ? 'روایتی مشرقی باوقار لباس کی حوصلہ افزائی کی جاتی ہے۔ معزز مرد حضرات شیروانی، پرنس کوٹ یا واسکٹ شلوار قمیص زیب تن فرما سکتے ہیں، اور معزز خواتین روایتی لہنگا، غرارہ، میکسی یا روایتی نفیس دیدہ زیب ملبوسات پہن سکتی ہیں۔'
        : 'We encourage traditional Pakistani formal and festive attire. Gentlemen typically wear Sherwanis, Prince Coats, or formal Waistcoats with Kurta Shalwar. Ladies are welcome in formal Lehengas, Shararas, Ghararas, Maxi Gowns, or embroidered festive ensembles in royal jewel tones or soft pastels.',
      icon: Sparkles,
    },
    {
      q: lang === 'ur' ? 'کیا مارکی میں پارکنگ کی سہولت دستیاب ہے؟' : 'Is parking available at the venue?',
      a: lang === 'ur'
        ? 'جی ہاں، بخارا روئیل مارکی میں وسیع نجی پارکنگ موجود ہے جہاں باوردہ ویلٹ اسٹاف آپ کے استقبال اور گاڑی پارک کرنے کے لیے موجود ہوگا۔'
        : 'Yes, Bukhara Royale Marquee provides a dedicated private parking plaza with complimentary uniformed valet attendants to receive you right at the porch.',
      icon: Car,
    },
    {
      q: lang === 'ur' ? 'میں اپنی شرکت کی تصدیق (RSVP) کیسے جمع یا تبدیل کروں؟' : 'How do I submit or modify my RSVP?',
      a: lang === 'ur'
        ? 'آپ اسی ویب سائٹ کے RSVP سیکشن سے باآسانی اپنی شرکت کی تصدیق کر سکتے ہیں۔ اگر آپ کے پروگرام میں کوئی تبدیلی ہو تو اپنے خصوصی انویٹیشن لنک سے دوبارہ وزٹ کر کے ترمیم فرما سکتے ہیں۔'
        : 'You can confirm your attendance directly via the RSVP section on this website. If your travel plans change, simply revisit using your unique invitation link to update your headcount or response at any time.',
      icon: CheckCircle,
    },
    {
      q: lang === 'ur' ? 'کیا اضافی فیملی ممبرز کو ساتھ لایا جا سکتا ہے؟' : 'Can I bring additional family members?',
      a: lang === 'ur'
        ? 'آپ کے دعوت نامے پر مخصوص نشستوں کی تعداد درج ہے۔ اگر کسی خصوصی انتظام کی ضرورت ہو تو ازراہِ کرم فیملی مہمان نوازی کوآرڈینیٹر سے رابطہ فرمائیں۔'
        : 'Your invitation reflects the reserved seats allocated for your family. If you need any specific adjustments, please reach out to the family hospitality team.',
      icon: HelpCircle,
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#F8F5EF] text-[#2C2621] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#845E1B] font-bold">
            {lang === 'ur' ? 'معلومات برائے معزز مہمانانِ گرامی' : 'Guest Information & Etiquette'}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2621] tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {t.faqTitle}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-base sm:text-lg text-[#3D332A] ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const Icon = faq.icon;

            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border-2 border-[#D4AF67]/40 shadow-sm overflow-hidden transition-all duration-300 hover:border-[#D4AF67] relative"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left rtl:text-right flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#D4AF67]/50 flex items-center justify-center shrink-0 text-[#845E1B] shadow-sm">
                      <Icon size={18} />
                    </div>
                    <span className={`text-base sm:text-lg font-bold text-[#2C2621] tracking-wide ${
                      lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
                    }`}>
                      {faq.q}
                    </span>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`text-[#845E1B] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className={`px-7 pb-6 pt-2 text-sm text-[#3D332A] leading-relaxed border-t border-[#D4AF67]/20 bg-[#FAF7F2] animate-fade-in ${
                    lang === 'ur' ? 'font-urdu' : 'font-sans'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
