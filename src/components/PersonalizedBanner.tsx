import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Sparkles } from 'lucide-react';
import { Guest } from '../types/wedding';
import { GoldDivider, MughalCorner } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface PersonalizedBannerProps {
  currentGuest: Guest | null;
  inviteToken: string | null;
  lang?: Language;
}

export const PersonalizedBanner: React.FC<PersonalizedBannerProps> = ({ currentGuest, inviteToken, lang = 'en' }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const getFullShareUrl = () => {
    const origin = window.location.origin + window.location.pathname;
    if (inviteToken) {
      return `${origin}?invite=${inviteToken}`;
    }
    return window.location.href;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getFullShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const url = getFullShareUrl();
    const guestGreeting = currentGuest 
      ? (lang === 'ur' ? `محترم ${currentGuest.name}، ` : `Dear ${currentGuest.name}, `)
      : (lang === 'ur' ? 'محترم و مکرم فیملی و احباب، ' : 'Respected Family & Friends, ');
    
    const message = lang === 'ur'
      ? `✨ *دعوت نامہ دعوتِ ولیمہ: مبشر و تسمیہ محفوظ* ✨\n\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\n\n${guestGreeting}باہم شمولیت والدین و خاندان، ہم آپ کو مبشر اور تسمیہ محفوظ کی پرمسرت تقریبِ ولیمہ میں شرکت اور دعاؤں کی دلی دعوت پیش کرتے ہیں۔\n\n📅 *تاریخ:* اتوار، 8 نومبر 2026ء\n🕐 *وقت:* 1:00 بجے دوپہر\n📍 *مقام:* بخارا روئیل مارکی، مین ایکسپریس وے، اسلام آباد (نزد گلبرگ)\n\nاپنا خصوصی دعوت نامہ دیکھنے اور شرکت کی تصدیق کے لیے لنک ملاحظہ فرمائیں:\n${url}`
      : `✨ *Grand Walima Invitation: Mubasshir & Tasmia Mehfooz* ✨\n\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\n\n${guestGreeting}Together with our families, we request the honour of your presence and blessings at the Grand Walima ceremony.\n\n📅 *Date:* Sunday, 8 November 2026\n🕐 *Time:* 1:00 PM PKT\n📍 *Venue:* Bukhara Royale Marquee, Main Expressway, Islamabad (near Gulberg)\n\nPlease view your personalized royal card and confirm your RSVP at:\n${url}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!currentGuest && !inviteToken) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 my-10 select-none">
      <div className="burgundy-card-gradient rounded-3xl border-2 border-[#D4AF67] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center text-[#F8F5EF]">
        <MughalCorner position="top-left" className="absolute top-2 left-2" size={36} />
        <MughalCorner position="top-right" className="absolute top-2 right-2" size={36} />
        <MughalCorner position="bottom-left" className="absolute bottom-2 left-2" size={36} />
        <MughalCorner position="bottom-right" className="absolute bottom-2 right-2" size={36} />

        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] font-serif-royal text-[#D4AF67] font-bold mb-2">
          <Sparkles size={13} className="text-[#F7E7C4]" />
          <span>{lang === 'ur' ? 'خصوصی دعوت نامہ برائے معزز مہمان' : 'Personalized Royal Guest Invitation'}</span>
          <Sparkles size={13} className="text-[#F7E7C4]" />
        </div>

        <h3 className={`text-2xl sm:text-4xl font-bold text-white tracking-wide ${
          lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
        }`}>
          {currentGuest ? currentGuest.name : (lang === 'ur' ? 'معزز مہمانِ گرامی' : 'Esteemed Guest')}
        </h3>

        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#F7E7C4] mt-2 font-medium">
          {currentGuest?.familyGroup && <span>{lang === 'ur' ? `خاندان: ${currentGuest.familyGroup}` : `Family: ${currentGuest.familyGroup}`}</span>}
          {currentGuest?.familyGroup && currentGuest?.maxGuests && <span aria-hidden="true">·</span>}
          {currentGuest?.maxGuests && (
            <span>{lang === 'ur' ? `مختص نشستیں: ${currentGuest.maxGuests}` : `Reserved Seating: ${currentGuest.maxGuests} ${currentGuest.maxGuests > 1 ? 'Seats' : 'Seat'}`}</span>
          )}
        </div>

        <GoldDivider className="my-5" />

        <p className={`text-xs sm:text-sm text-[#F8F5EF]/85 max-w-lg mx-auto mb-6 leading-relaxed ${
          lang === 'ur' ? 'font-urdu' : 'font-sans'
        }`}>
          {lang === 'ur'
            ? 'یہ خصوصی لنک آپ اور آپ کے خاندان کے لیے مختص کیا گیا ہے۔ آپ اسے واٹس ایپ پر شیئر کر سکتے ہیں یا اپنے پاس محفوظ رکھ کر شرکت کی تصدیق کر سکتے ہیں۔'
            : 'This unique link has been reserved exclusively for you. You can share this link directly via WhatsApp or keep it saved to review event updates and manage your RSVP.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF67] bg-[#641D32]/70 hover:bg-[#641D32] text-[#F7E7C4] hover:text-white font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? (lang === 'ur' ? 'لنک کاپی ہو گیا!' : 'Link Copied!') : (lang === 'ur' ? 'لنک کاپی کریں' : 'Copy Unique Invitation Link')}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer"
          >
            <MessageCircle size={15} />
            <span>{lang === 'ur' ? 'واٹس ایپ پر شیئر کریں' : 'Share via WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
