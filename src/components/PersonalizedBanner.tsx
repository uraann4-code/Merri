import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Sparkles } from 'lucide-react';
import { Guest } from '../types/wedding';
import { GoldDivider, MughalCorner } from './MughalMotif';

interface PersonalizedBannerProps {
  currentGuest: Guest | null;
  inviteToken: string | null;
}

export const PersonalizedBanner: React.FC<PersonalizedBannerProps> = ({ currentGuest, inviteToken }) => {
  const [copied, setCopied] = useState(false);

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
    const guestGreeting = currentGuest ? `Dear ${currentGuest.name}, ` : 'Respected Family & Friends, ';
    const message = `✨ *Grand Baraat Invitation: Mubasshir & Tasmia Mehfooz* ✨\n\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\n\n${guestGreeting}Together with our families, we request the honour of your presence and blessings at the Grand Baraat ceremony.\n\n📅 *Date:* Sunday, 8 November 2026\n🕐 *Time:* 1:00 PM PKT\n📍 *Venue:* Bukhara Royale Marquee, Main Expressway, Islamabad (near Gulberg)\n\nPlease view your personalized royal card and confirm your RSVP at:\n${url}`;

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
          <span>Personalized Royal Guest Invitation</span>
          <Sparkles size={13} className="text-[#F7E7C4]" />
        </div>

        <h3 className="font-serif-royal text-2xl sm:text-4xl font-bold text-white tracking-wide">
          {currentGuest ? currentGuest.name : 'Esteemed Guest'}
        </h3>

        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#F7E7C4] mt-2 font-medium">
          {currentGuest?.familyGroup && <span>Family: {currentGuest.familyGroup}</span>}
          {currentGuest?.familyGroup && currentGuest?.maxGuests && <span aria-hidden="true">·</span>}
          {currentGuest?.maxGuests && (
            <span>Reserved Seating: {currentGuest.maxGuests} {currentGuest.maxGuests > 1 ? 'Seats' : 'Seat'}</span>
          )}
        </div>

        <GoldDivider className="my-5" />

        <p className="text-xs sm:text-sm text-[#F8F5EF]/85 max-w-lg mx-auto mb-6 leading-relaxed font-sans">
          This unique link has been reserved exclusively for you. You can share this link directly via WhatsApp or keep it saved to review event updates and manage your RSVP.
        </p>

        {/* Share buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF67] bg-[#641D32]/70 hover:bg-[#641D32] text-[#F7E7C4] hover:text-white font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Link Copied!' : 'Copy Unique Invitation Link'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-md"
          >
            <MessageCircle size={15} />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
