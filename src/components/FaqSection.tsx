import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Clock, MapPin, Sparkles, Car, CheckCircle } from 'lucide-react';
import { GoldDivider, MughalCorner } from './MughalMotif';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What are the exact event timings for the Baraat?',
      a: 'The Baraat will take place on Sunday, 8 November 2026. The Groom’s procession and royal arrival will commence at 1:00 PM Pakistan Standard Time (PKT). Guests are kindly requested to arrive by 1:00 PM to partake in the warm Istiqbal and Milni welcoming ceremonies.',
      icon: Clock,
    },
    {
      q: 'Where is Bukhara Royale Marquee located?',
      a: 'Bukhara Royale Marquee is located on the Main Islamabad Expressway, near Gulberg Greens, Islamabad, Pakistan. It is centrally situated and accessible within minutes from Islamabad and Rawalpindi.',
      icon: MapPin,
    },
    {
      q: 'What is the suggested dress code?',
      a: 'We encourage traditional Pakistani formal and festive attire. Gentlemen typically wear Sherwanis, Prince Coats, or formal Waistcoats with Kurta Shalwar. Ladies are welcome in formal Lehengas, Shararas, Ghararas, Maxi Gowns, or embroidered festive ensembles in royal jewel tones or soft pastels.',
      icon: Sparkles,
    },
    {
      q: 'Is parking available at the venue?',
      a: 'Yes, Bukhara Royale Marquee provides a dedicated private parking plaza with complimentary uniformed valet attendants to receive you right at the porch.',
      icon: Car,
    },
    {
      q: 'How do I submit or modify my RSVP?',
      a: 'You can confirm your attendance directly via the RSVP section on this website. If your travel plans change, simply revisit using your unique invitation link to update your headcount or response at any time.',
      icon: CheckCircle,
    },
    {
      q: 'Can I bring additional family members?',
      a: 'Your invitation reflects the reserved seats allocated for your family. If you need any specific adjustments, please reach out to the family hospitality team.',
      icon: HelpCircle,
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#F8F5EF] text-[#29101A] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#9E7422] font-bold">
            Guest Information &amp; Etiquette
          </span>
          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-bold text-[#641D32] tracking-wide mt-2">
            Frequently Asked Questions
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif-elegant italic text-base sm:text-lg text-[#29101A]/85">
            Everything you need to know for a seamless and memorable celebration.
          </p>
        </div>

        {/* Accordion FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const Icon = faq.icon;

            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border-2 border-[#D4AF67]/35 shadow-md overflow-hidden transition-all duration-300 hover:border-[#D4AF67] relative"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#641D32]/10 border border-[#D4AF67]/40 flex items-center justify-center shrink-0 text-[#641D32]">
                      <Icon size={18} />
                    </div>
                    <span className="font-serif-royal text-base sm:text-lg font-bold text-[#641D32] tracking-wide">
                      {faq.q}
                    </span>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`text-[#D4AF67] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-7 pb-6 pt-1 text-sm text-[#29101A]/85 font-sans leading-relaxed border-t border-[#D4AF67]/20 bg-[#FAF7F2] animate-fade-in">
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
