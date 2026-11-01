import React from 'react';
import { Calendar, MapPin, Clock, Heart, ChevronDown } from 'lucide-react';
import { RoyalCrest, GoldDivider, BismillahCalligraphy, MughalCorner, MughalMehrabArch } from './MughalMotif';

interface HeroProps {
  guestName?: string;
  familyGroup?: string;
}

export const Hero: React.FC<HeroProps> = ({ guestName, familyGroup }) => {
  return (
    <section id="invitation" className="relative min-h-screen pt-28 pb-20 flex flex-col items-center justify-center overflow-hidden burgundy-palace-gradient text-[#F8F5EF] select-none">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-radial from-[#641D32]/50 via-[#D4AF67]/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-32 left-10 w-96 h-96 bg-[#D4AF67]/8 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#641D32]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Mughal Geometry Watermark Pattern */}
      <div className="absolute inset-0 dark-damask-pattern opacity-35 pointer-events-none" />

      <div className="w-full max-w-4xl px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Royal Card Container with Mughal Mehrab Arch */}
        <div className="w-full burgundy-card-gradient p-7 sm:p-12 md:p-16 rounded-3xl border-2 border-[#D4AF67]/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative">
          <MughalCorner position="top-left" className="absolute top-3.5 left-3.5" size={48} />
          <MughalCorner position="top-right" className="absolute top-3.5 right-3.5" size={48} />
          <MughalCorner position="bottom-left" className="absolute bottom-3.5 left-3.5" size={48} />
          <MughalCorner position="bottom-right" className="absolute bottom-3.5 right-3.5" size={48} />

          {/* Architectural Mehrab Arch Silhouette */}
          <MughalMehrabArch className="mb-4">
            <div className="flex justify-center -mt-6">
              <RoyalCrest size={80} className="animate-float" />
            </div>
          </MughalMehrabArch>

          {/* Sacred Bismillah Calligraphy */}
          <BismillahCalligraphy className="mb-6" />

          {/* Personalized Guest Greeting */}
          {guestName && (
            <div className="mb-6 animate-fade-in">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF67] font-serif-royal font-semibold">
                Personalized Royal Invitation
              </p>
              <h2 className="font-serif-elegant text-lg sm:text-xl font-bold text-white tracking-wide mt-0.5">
                Honoured Guest: {guestName} {familyGroup ? `· ${familyGroup}` : ''}
              </h2>
            </div>
          )}

          {/* Formal Family Invitation Wording */}
          <div className="space-y-1 mb-6 text-[#F8F5EF]/85">
            <p className="font-serif-elegant italic text-lg sm:text-xl text-[#F7E7C4] tracking-wide">
              Together with their families
            </p>
            <p className="font-serif-royal uppercase text-[11px] sm:text-xs tracking-[0.28em] text-[#D4AF67] font-semibold">
              Request the honour of your esteemed presence &amp; du'as
            </p>
            <p className="font-serif-elegant italic text-sm sm:text-base text-[#F8F5EF]/80">
              at the auspicious wedding reception (Walima) celebrating the union of
            </p>
          </div>

          {/* Couple Names */}
          <div className="py-2 relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-6">
              <h1 className="font-serif-royal text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] gold-foil-text drop-shadow-md">
                MUBASSHIR
              </h1>

              <div className="flex items-center justify-center my-0.5 md:my-0">
                <span className="font-calligraphy text-4xl sm:text-5xl md:text-6xl text-[#D4AF67] px-2 select-none">
                  &amp;
                </span>
              </div>

              <h1 className="font-serif-royal text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] gold-foil-text drop-shadow-md">
                TASMIA <span className="text-white">MEHFOOZ</span>
              </h1>
            </div>
          </div>

          <GoldDivider className="my-6" />

          {/* Event Metadata */}
          <div className="mb-6">
            <span className="font-serif-royal text-xs sm:text-sm uppercase tracking-[0.35em] text-[#D4AF67] font-bold">
              The Grand Walima Reception
            </span>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-3 pb-6 border-y border-[#D4AF67]/30 text-[#F8F5EF]">
            <div className="flex flex-col items-center p-3.5 bg-black/25 rounded-xl border border-white/5">
              <Calendar className="text-[#D4AF67] mb-1.5" size={20} />
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF67]">Date</span>
              <span className="font-serif-royal text-sm sm:text-base font-bold mt-0.5 text-white">
                Sunday, 8 Nov 2026
              </span>
            </div>

            <div className="flex flex-col items-center p-3.5 bg-black/25 rounded-xl border border-white/5">
              <Clock className="text-[#D4AF67] mb-1.5" size={20} />
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF67]">Reception Time</span>
              <span className="font-serif-royal text-sm sm:text-base font-bold mt-0.5 text-white">
                1:00 PM PKT
              </span>
              <span className="text-[10px] text-[#F7E7C4]/70">Pakistan Standard Time</span>
            </div>

            <div className="flex flex-col items-center p-3.5 bg-black/25 rounded-xl border border-white/5">
              <MapPin className="text-[#D4AF67] mb-1.5" size={20} />
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF67]">Venue</span>
              <span className="font-serif-royal text-sm sm:text-base font-bold mt-0.5 text-white">
                Bukhara Royale Marquee
              </span>
              <span className="text-[10px] text-[#F7E7C4]/70">Main Expressway, Islamabad</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full gold-foil-bg text-[#29101A] font-serif-royal text-xs sm:text-sm font-bold tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#D4AF67]/25"
            >
              <Heart size={16} className="fill-[#29101A]" />
              <span>RSVP Attending</span>
            </a>

            <a
              href="#event"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D4AF67]/70 bg-[#29101A]/60 hover:bg-[#641D32]/60 text-[#F8F5EF] font-serif-royal text-xs sm:text-sm font-medium tracking-[0.18em] uppercase transition-all"
            >
              <Calendar size={15} className="text-[#D4AF67]" />
              <span>Event Details</span>
            </a>

            <a
              href="#venue"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-[#F8F5EF] font-serif-royal text-xs sm:text-sm font-medium tracking-[0.18em] uppercase transition-all"
            >
              <MapPin size={15} className="text-[#D4AF67]" />
              <span>Directions</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#story"
          aria-label="Scroll to Our Story"
          className="mt-10 inline-flex flex-col items-center text-[#D4AF67]/75 hover:text-[#D4AF67] transition-colors"
        >
          <span className="text-[10px] font-serif-royal uppercase tracking-[0.25em]">Our Story</span>
          <ChevronDown size={18} className="animate-bounce mt-1" />
        </a>
      </div>
    </section>
  );
};
