import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Navigation, Download, Check, Sparkles, Utensils, Camera, HeartHandshake } from 'lucide-react';
import { GoldDivider, MughalCorner } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface EventDetailsProps {
  lang?: Language;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ lang = 'en' }) => {
  const [downloadedIcs, setDownloadedIcs] = useState(false);
  const t = translations[lang];

  // Event metadata
  const eventTitle = lang === 'ur' ? 'دعوتِ ولیمہ: مبشر و تسمیہ محفوظ' : 'Mubasshir & Tasmia Mehfooz — Grand Walima';
  const eventLocation = lang === 'ur' ? 'بخارا روئیل مارکی، مین ایکسپریس وے، نزد گلبرگ، اسلام آباد' : 'Bukhara Royale Marquee, Main Expressway, near Gulberg, Islamabad, Pakistan';
  const eventDescription = lang === 'ur' ? 'مبشر اور تسمیہ محفوظ کی پرمسرت تقریبِ دعوتِ ولیمہ بمقام بخارا روئیل مارکی، اسلام آباد' : 'Royal wedding reception (Walima) celebrating the union of Mubasshir and Tasmia Mehfooz at Bukhara Royale Marquee, Islamabad.';

  // Date: 8 November 2026, 1:00 PM PKT (UTC+5) = 20261108T080000Z to 20261108T120000Z
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=20261108T080000Z/20261108T120000Z&details=${encodeURIComponent(
    eventDescription
  )}&location=${encodeURIComponent(eventLocation)}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Bukhara Royale Marquee Main Expressway Islamabad Pakistan'
  )}`;

  const downloadIcsFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mubasshir & Tasmia Wedding//Walima Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:' + eventTitle,
      'DESCRIPTION:' + eventDescription,
      'LOCATION:' + eventLocation,
      'DTSTART:20261108T080000Z',
      'DTEND:20261108T120000Z',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Mubasshir & Tasmia Walima Tomorrow at 1:00 PM',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Mubasshir-Tasmia-Walima.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 4000);
  };

  const scheduleFlow = [
    {
      time: lang === 'ur' ? '1:00 بجے' : '1:00 PM',
      title: t.scheduleArrival,
      desc: t.scheduleArrivalDesc,
      icon: HeartHandshake,
    },
    {
      time: lang === 'ur' ? '1:45 بجے' : '1:45 PM',
      title: t.scheduleStage,
      desc: t.scheduleStageDesc,
      icon: Camera,
    },
    {
      time: lang === 'ur' ? '2:15 بجے' : '2:15 PM',
      title: t.scheduleFeast,
      desc: t.scheduleFeastDesc,
      icon: Utensils,
    },
    {
      time: lang === 'ur' ? '4:00 بجے' : '4:00 PM',
      title: t.scheduleDua,
      desc: t.scheduleDuaDesc,
      icon: Sparkles,
    },
  ];

  return (
    <section id="event" className="py-24 sm:py-32 ivory-palace-gradient text-[#2C2621] relative overflow-hidden select-none">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF67]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#EDE4D5]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#845E1B] font-bold">
            {lang === 'ur' ? 'تقریبِ ولیمہ کی تفصیلات' : 'The Wedding Ceremony'}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2621] tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {t.walimaReception}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-base sm:text-lg text-[#3D332A] ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {lang === 'ur'
              ? 'مبارک روایات، شاہی ضیافت اور مسرتوں سے سجی ایک یادگار سہ پہر۔'
              : '"A momentous afternoon of cultural majesty, royal hospitality, and everlasting celebration."'}
          </p>
        </div>

        {/* Grand Event Highlight Card */}
        <div className="luxury-card-gradient border-2 border-[#D4AF67]/60 rounded-3xl p-7 sm:p-12 shadow-xl relative mb-20 text-[#2C2621]">
          <MughalCorner position="top-left" className="absolute top-3 left-3" size={44} />
          <MughalCorner position="top-right" className="absolute top-3 right-3" size={44} />
          <MughalCorner position="bottom-left" className="absolute bottom-3 left-3" size={44} />
          <MughalCorner position="bottom-right" className="absolute bottom-3 right-3" size={44} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Column: Key Stats */}
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-[0.25em] font-serif-royal text-[#845E1B] font-bold">
                {lang === 'ur' ? 'یومِ ولیمہ · اتوار کی باوقار تقریب' : 'Walima Day · Sunday Reception'}
              </div>

              <div>
                <h3 className={`text-2xl sm:text-4xl font-bold text-[#2C2621] tracking-wide ${
                  lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
                }`}>
                  {t.eventDate}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-[#845E1B] text-base font-serif-royal font-bold">
                  <Clock size={18} className="text-[#845E1B]" />
                  <span>{t.eventTime} ({t.eventTimezone})</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4AF67]/30 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin size={22} className="text-[#845E1B] shrink-0 mt-1" />
                  <div>
                    <h4 className={`text-xl font-bold text-[#2C2621] ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                      {t.venueName}
                    </h4>
                    <p className={`text-sm text-[#3D332A] mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                      {t.venueAddress}
                    </p>
                    <p className={`text-xs text-[#845E1B] mt-1 font-semibold ${lang === 'ur' ? 'font-urdu' : ''}`}>
                      {lang === 'ur' ? 'وسیع پارکنگ، ویلٹ سروس اور پروقار شاہی انتظام۔' : 'Complimentary valet parking & grand banquet reception.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Calendar & Map */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-md border border-[#D4AF67]/50"
                >
                  <Calendar size={14} className="text-[#2C2621]" />
                  <span>{lang === 'ur' ? 'گوگل کیلنڈر' : 'Google Calendar'}</span>
                </a>

                <button
                  onClick={downloadIcsFile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF67] bg-white hover:bg-[#EDE4D5] text-[#2C2621] font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                  title="Download .ics for Apple / Outlook Calendar"
                >
                  {downloadedIcs ? <Check size={14} className="text-emerald-600" /> : <Download size={14} className="text-[#845E1B]" />}
                  <span>{downloadedIcs ? (lang === 'ur' ? 'کیلنڈر میں شامل!' : 'Added to iCal!') : (lang === 'ur' ? 'ایپل / آئی کیلنڈر' : 'Apple / iCal (.ics)')}</span>
                </button>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF67]/60 bg-white/80 hover:bg-[#EDE4D5] text-[#2C2621] font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                >
                  <Navigation size={14} className="text-[#845E1B]" />
                  <span>{t.directionsButton}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Marquee Highlight */}
            <div className="rounded-2xl border-2 border-[#D4AF67]/50 p-7 bg-white shadow-lg text-center flex flex-col justify-center text-[#2C2621]">
              <div className="w-16 h-16 mx-auto rounded-full border border-[#D4AF67] flex items-center justify-center bg-[#FAF7F2] text-[#845E1B] mb-4 shadow-sm">
                <Sparkles size={28} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#845E1B] font-serif-royal font-bold">
                {lang === 'ur' ? 'شاہی تقریب کا مقام' : 'Venue Landmark'}
              </span>
              <h4 className={`text-xl sm:text-2xl font-bold text-[#2C2621] mt-1 ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                {t.venueName}
              </h4>
              <p className={`text-xs text-[#3D332A] mt-2.5 leading-relaxed ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                {lang === 'ur'
                  ? 'اسلام آباد کے مین ایکسپریس وے پر واقع بخارا روئیل مارکی اپنی مغلائی طرزِ تعمیر، دلکش جھومروں اور شاہی مہمان نوازی کے باعث ایک منفرد شناخت رکھتی ہے۔'
                  : 'Nestled along Islamabad\'s prime Expressway near Gulberg Greens, Bukhara Royale Marquee offers majestic Mughal-inspired chandeliers, grand banquet halls, and royal hospitality fit for a prince & princess.'}
              </p>
              <div className="mt-5 pt-4 border-t border-[#D4AF67]/30 flex justify-center items-center gap-4 text-xs text-[#845E1B] font-serif-royal font-bold">
                <span>{lang === 'ur' ? 'ویلٹ پارکنگ' : 'Valet Parking'}</span>
                <span>·</span>
                <span>{lang === 'ur' ? 'مکمل ایئرکنڈیشنڈ' : 'Climate Controlled'}</span>
                <span>·</span>
                <span>{lang === 'ur' ? 'نماز کی جگہ' : 'Dedicated Prayer Area'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Program Itinerary Flow */}
        <div className="mt-8">
          <div className="text-center mb-10">
            <h3 className={`text-2xl sm:text-3xl font-bold text-[#2C2621] tracking-wide ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
            }`}>
              {t.scheduleTitle}
            </h3>
            <p className={`text-xs uppercase tracking-widest text-[#845E1B] mt-1.5 font-bold ${
              lang === 'ur' ? 'font-urdu' : ''
            }`}>
              {t.scheduleSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {scheduleFlow.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.time}
                  className="bg-white border-2 border-[#D4AF67]/40 hover:border-[#D4AF67] rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 group shadow-md text-[#2C2621]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-serif-royal font-bold text-[#845E1B] px-3 py-1 rounded-lg bg-[#FAF7F2] border border-[#D4AF67]/40">
                      {item.time}
                    </span>
                    <Icon size={20} className="text-[#845E1B] group-hover:text-[#2C2621] transition-colors" />
                  </div>
                  <h4 className="font-serif-royal text-base font-bold text-[#2C2621] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#3D332A] leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
