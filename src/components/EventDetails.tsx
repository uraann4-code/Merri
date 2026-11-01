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
    <section id="event" className="py-24 sm:py-32 burgundy-palace-gradient text-[#F8F5EF] relative overflow-hidden select-none">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#641D32]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF67]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dark-damask-pattern opacity-35 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#D4AF67] font-bold">
            {lang === 'ur' ? 'تقریبِ ولیمہ کی تفصیلات' : 'The Wedding Ceremony'}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {t.walimaReception}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-base sm:text-lg text-[#F7E7C4]/90 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {lang === 'ur'
              ? 'مبارک روایات، شاہی ضیافت اور مسرتوں سے سجی ایک یادگار سہ پہر۔'
              : '"A momentous afternoon of cultural majesty, royal hospitality, and everlasting celebration."'}
          </p>
        </div>

        {/* Grand Event Highlight Card */}
        <div className="burgundy-card-gradient border-2 border-[#D4AF67]/60 rounded-3xl p-7 sm:p-12 shadow-2xl relative mb-20">
          <MughalCorner position="top-left" className="absolute top-3 left-3" size={44} />
          <MughalCorner position="top-right" className="absolute top-3 right-3" size={44} />
          <MughalCorner position="bottom-left" className="absolute bottom-3 left-3" size={44} />
          <MughalCorner position="bottom-right" className="absolute bottom-3 right-3" size={44} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Column: Key Stats */}
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-[0.25em] font-serif-royal text-[#D4AF67] font-bold">
                {lang === 'ur' ? 'یومِ ولیمہ · اتوار کی باوقار تقریب' : 'Walima Day · Sunday Reception'}
              </div>

              <div>
                <h3 className={`text-2xl sm:text-4xl font-bold text-white tracking-wide ${
                  lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
                }`}>
                  {t.eventDate}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-[#F7E7C4] text-base font-serif-royal font-semibold">
                  <Clock size={18} className="text-[#D4AF67]" />
                  <span>{t.eventTime} ({t.eventTimezone})</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin size={22} className="text-[#D4AF67] shrink-0 mt-1" />
                  <div>
                    <h4 className={`text-xl font-bold text-white ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                      {t.venueName}
                    </h4>
                    <p className={`text-sm text-[#F8F5EF]/80 mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>
                      {t.venueAddress}
                    </p>
                    <p className={`text-xs text-[#D4AF67] mt-1 font-medium ${lang === 'ur' ? 'font-urdu' : ''}`}>
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gold-foil-bg text-[#29101A] font-serif-royal text-xs font-bold tracking-wider uppercase hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <Calendar size={14} className="text-[#29101A]" />
                  <span>{lang === 'ur' ? 'گوگل کیلنڈر' : 'Google Calendar'}</span>
                </a>

                <button
                  onClick={downloadIcsFile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF67] bg-[#641D32]/50 hover:bg-[#641D32] text-[#F7E7C4] hover:text-white font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all"
                  title="Download .ics for Apple / Outlook Calendar"
                >
                  {downloadedIcs ? <Check size={14} className="text-emerald-400" /> : <Download size={14} />}
                  <span>{downloadedIcs ? (lang === 'ur' ? 'کیلنڈر میں شامل!' : 'Added to iCal!') : (lang === 'ur' ? 'ایپل / آئی کیلنڈر' : 'Apple / iCal (.ics)')}</span>
                </button>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-[#F8F5EF] font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all"
                >
                  <Navigation size={14} className="text-[#D4AF67]" />
                  <span>{t.directionsButton}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Marquee Highlight */}
            <div className="rounded-2xl border-2 border-[#D4AF67]/50 p-7 bg-gradient-to-br from-[#1C0912] to-[#2E0F1D] shadow-2xl text-center flex flex-col justify-center">
              <div className="w-16 h-16 mx-auto rounded-full border border-[#D4AF67] flex items-center justify-center bg-[#641D32]/50 text-[#D4AF67] mb-4">
                <Sparkles size={28} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF67] font-serif-royal font-bold">
                {lang === 'ur' ? 'شاہی تقریب کا مقام' : 'Venue Landmark'}
              </span>
              <h4 className={`text-xl sm:text-2xl font-bold text-white mt-1 ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                {t.venueName}
              </h4>
              <p className={`text-xs text-[#F7E7C4]/85 mt-2.5 leading-relaxed ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                {lang === 'ur'
                  ? 'اسلام آباد کے مین ایکسپریس وے پر واقع بخارا روئیل مارکی اپنی مغلائی طرزِ تعمیر، دلکش جھومروں اور شاہی مہمان نوازی کے باعث ایک منفرد شناخت رکھتی ہے۔'
                  : 'Nestled along Islamabad\'s prime Expressway near Gulberg Greens, Bukhara Royale Marquee offers majestic Mughal-inspired chandeliers, grand banquet halls, and royal hospitality fit for a prince & princess.'}
              </p>
              <div className="mt-5 pt-4 border-t border-[#D4AF67]/30 flex justify-center items-center gap-4 text-xs text-[#D4AF67] font-serif-royal font-medium">
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
            <h3 className={`text-2xl sm:text-3xl font-bold text-white tracking-wide ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
            }`}>
              {t.scheduleTitle}
            </h3>
            <p className={`text-xs uppercase tracking-widest text-[#D4AF67] mt-1.5 font-medium ${
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
                  className="bg-[#2D0F1D] border-2 border-[#D4AF67]/30 hover:border-[#D4AF67] rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 group shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-serif-royal font-bold text-[#D4AF67] px-3 py-1 rounded-lg bg-[#641D32] border border-[#D4AF67]/30">
                      {item.time}
                    </span>
                    <Icon size={20} className="text-[#D4AF67]/80 group-hover:text-[#F7E7C4] transition-colors" />
                  </div>
                  <h4 className="font-serif-royal text-base font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#F8F5EF]/80 leading-relaxed font-sans">
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
