import React from 'react';
import { MapPin, ExternalLink, Compass, Car, PhoneCall } from 'lucide-react';
import { GoldDivider, MughalCorner } from './MughalMotif';

export const VenueSection: React.FC = () => {
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
            Location &amp; Travel Guide
          </span>
          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide mt-2">
            Bukhara Royale Marquee
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif-elegant italic text-base sm:text-lg text-[#F7E7C4]/90">
            Main Expressway, Islamabad, near Gulberg, Pakistan.
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
                <span>Main Expressway, Islamabad (near Gulberg Greens)</span>
              </div>
              <a
                href={directMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full gold-foil-bg text-[#29101A] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-sm"
              >
                <span>Open in Google Maps</span>
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
                <span>Route Guidance</span>
              </div>
              <ul className="text-xs text-[#F8F5EF]/85 space-y-2.5 font-sans leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF67] mt-0.5 font-bold">·</span>
                  <span><strong>From Islamabad (Zero Point / Blue Area):</strong> Proceed southbound on Islamabad Expressway. The marquee is prominently situated along the main avenue near Gulberg.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF67] mt-0.5 font-bold">·</span>
                  <span><strong>From Rawalpindi / Saddar:</strong> Accessible via Airport Road and the Islamabad Expressway interchange.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#2D0F1D] border-2 border-[#D4AF67]/35 rounded-2xl p-6 relative">
              <MughalCorner position="top-right" className="absolute top-2 right-2" size={28} />
              <div className="flex items-center gap-2.5 text-[#D4AF67] mb-2 font-serif-royal text-sm font-bold uppercase tracking-wider">
                <Car size={18} />
                <span>Complimentary Valet &amp; Parking</span>
              </div>
              <p className="text-xs text-[#F8F5EF]/85 font-sans leading-relaxed">
                A grand on-site parking plaza is reserved exclusively for Walima attendees. Uniformed valet chauffeurs will receive you at the grand marquee porch upon arrival.
              </p>
            </div>

            <div className="bg-[#2D0F1D] border-2 border-[#D4AF67]/35 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2.5 text-[#D4AF67] mb-2 font-serif-royal text-sm font-bold uppercase tracking-wider">
                <PhoneCall size={18} />
                <span>Hospitality &amp; Guest Helpline</span>
              </div>
              <p className="text-xs text-[#F8F5EF]/85 font-sans leading-relaxed">
                Should you require any route navigation, parking guidance, or venue assistance on the day of the Walima, the family hospitality concierge will be available to assist.
              </p>
              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#D4AF67] font-serif-royal">
                <span className="font-bold">Venue Helpline:</span>
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
