import React from 'react';
import { MapPin, ExternalLink, Compass, Car, PhoneCall } from 'lucide-react';
import { GoldDivider, MughalCorner } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface VenueSectionProps {
  lang?: Language;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ lang = 'en' }) => {
  const t = translations[lang];

  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Bukhara Royale Marquee Main Expressway Islamabad near Gulberg Pakistan'
  )}`;

  return (
    <section id="venue" className="py-24 sm:py-32 burgundy-palace-gradient text-[#F8F5EF] relative overflow-hidden select-none">
      <div className="absolute inset-0 dark-damask-pattern opacity-35 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#641D32]/35 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#D4AF67] font-bold">
            {t.venueTitle}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {t.venueName}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-base sm:text-lg text-[#F7E7C4]/90 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {t.venueAddress}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 rounded-3xl border-2 border-[#D4AF67]/60 overflow-hidden shadow-2xl relative min-h-[380px] flex flex-col bg-stone-900">
            <iframe
              title="Bukhara Royale Marquee Location"
              src="https://maps.google.com/maps?q=Bukhara+Royale+Marquee+Main+Expressway+Islamabad&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[380px] sm:min-h-[440px] border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-4 bg-[#190910] border-t border-[#D4AF67]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#F8F5EF]/85 font-serif-royal">
                <MapPin size={16} className="text-[#D4AF67]" />
                <span>{lang === 'ur' ? 'مین ایکسپریس وے، نزد گلبرگ گرینز، اسلام آباد' : 'Main Expressway, Islamabad (near Gulberg Greens)'}</span>
              </div>
              <a
                href={directMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full gold-foil-bg text-[#29101A] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-sm"
              >
                <span>{t.openGoogleMaps}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Logistics Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-[#2D0F1D] border-2 border-[#D4AF67]/35 rounded-2xl p-6 relative">
              <MughalCorner position="top-right" className="absolute top-2 right-2" size={28} />
              <div className="flex items-center gap-2.5 text-[#D4AF67] mb-2 font-serif-royal text-sm font-bold uppercase tracking-wider">
                <Compass size={18} />
                <span>{lang === 'ur' ? 'رہنمائی برائے راستہ' : 'Route Guidance'}</span>
              </div>
              <ul className={`text-xs text-[#F8F5EF]/85 space-y-2.5 leading-relaxed ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF67] mt-0.5 font-bold">·</span>
                  <span><strong>{lang === 'ur' ? 'اسلام آباد سے (زیرو پوائنٹ / بلیو ایریا):' : 'From Islamabad (Zero Point / Blue Area):'}</strong> {lang === 'ur' ? 'اسلام آباد ایکسپریس وے پر جنوب کی جانب سفر کریں۔ مارکی گلبرگ کے قریب مین شاہراہ پر واقع ہے۔' : 'Proceed southbound on Islamabad Expressway. The marquee is prominently situated along the main avenue near Gulberg.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF67] mt-0.5 font-bold">·</span>
                  <span><strong>{lang === 'ur' ? 'راولپنڈی / صدر سے:' : 'From Rawalpindi / Saddar:'}</strong> {lang === 'ur' ? 'ائیرپورٹ روڈ اور اسلام آباد ایکسپریس وے انٹرچینج کے ذریعے باآسانی قابلِ رسائی۔' : 'Accessible via Airport Road and the Islamabad Expressway interchange.'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#2D0F1D] border-2 border-[#D4AF67]/35 rounded-2xl p-6 relative">
              <MughalCorner position="top-right" className="absolute top-2 right-2" size={28} />
              <div className="flex items-center gap-2.5 text-[#D4AF67] mb-2 font-serif-royal text-sm font-bold uppercase tracking-wider">
                <Car size={18} />
                <span>{lang === 'ur' ? 'مفت ویلٹ اور کشادہ پارکنگ' : 'Complimentary Valet & Parking'}</span>
              </div>
              <p className={`text-xs text-[#F8F5EF]/85 leading-relaxed ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                {lang === 'ur'
                  ? 'ولیمہ کے معزز شرکاء کے لیے کشادہ آن سائٹ پارکنگ مخصوص کی گئی ہے۔ پورچ پر باوردہ ویلٹ عملہ آپ کے استقبال کے لیے موجود ہوگا۔'
                  : 'A grand on-site parking plaza is reserved exclusively for Walima attendees. Uniformed valet chauffeurs will receive you at the grand marquee porch upon arrival.'}
              </p>
            </div>

            <div className="bg-[#2D0F1D] border-2 border-[#D4AF67]/35 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2.5 text-[#D4AF67] mb-2 font-serif-royal text-sm font-bold uppercase tracking-wider">
                <PhoneCall size={18} />
                <span>{lang === 'ur' ? 'معاونت و مہمان نوازی ہیلپ لائن' : 'Hospitality & Guest Helpline'}</span>
              </div>
              <p className={`text-xs text-[#F8F5EF]/85 leading-relaxed ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                {lang === 'ur'
                  ? 'ولیمہ کے روز راستے یا پارکنگ کے حوالے سے کسی بھی قسم کی رہنمائی کے لیے خاندانی مہمان نوازی ٹیم ہمہ وقت حاضر ہے۔'
                  : 'Should you require any route navigation, parking guidance, or venue assistance on the day of the Walima, the family hospitality concierge will be available to assist.'}
              </p>
              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#D4AF67] font-serif-royal">
                <span className="font-bold">{lang === 'ur' ? 'ہیلپ لائن:' : 'Venue Helpline:'}</span>
                <span className="font-mono bg-black/40 px-3 py-1 rounded-lg border border-[#D4AF67]/30">
                  +92 (051) Bukhara-Royale
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
