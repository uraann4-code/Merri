import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Shield, Heart, Music2 } from 'lucide-react';
import { guzarishAmbiance } from '../lib/audioAmbiance';

interface NavbarProps {
  onOpenAdmin: () => void;
  guestName?: string;
  isMemoriesActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, guestName }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return guzarishAmbiance.subscribe((playing) => {
      setIsPlayingMusic(playing);
    });
  }, []);

  const toggleMusic = () => {
    guzarishAmbiance.toggle();
  };

  const navLinks = [
    { label: 'Invitation', href: '#invitation' },
    { label: 'Our Story', href: '#story' },
    { label: 'Walima Event', href: '#event' },
    { label: 'Countdown', href: '#countdown' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Venue & Map', href: '#venue' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Memories & Duas', href: '#memories' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1C0912]/95 backdrop-blur-md py-3 shadow-xl border-b border-[#D4AF67]/30 text-[#F8F5EF]'
          : 'bg-gradient-to-b from-[#1C0912]/85 via-[#1C0912]/40 to-transparent py-4 text-[#F8F5EF]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Monogram Brand */}
        <a href="#invitation" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full border border-[#D4AF67] flex items-center justify-center bg-[#641D32]/60 text-[#F7E7C4] shadow-md group-hover:scale-105 transition-transform">
            <span className="font-serif-decorative text-xs font-bold tracking-wider">M&amp;T</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif-royal text-xs sm:text-sm font-bold tracking-wider text-white group-hover:text-[#D4AF67] transition-colors">
              Mubasshir &amp; Tasmia
            </span>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#D4AF67]/90 font-medium">
              <span>Walima</span>
              <span aria-hidden="true">·</span>
              <span>8 Nov 2026</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-[0.2em] font-serif-royal font-medium text-[#F8F5EF]/80 hover:text-[#D4AF67] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D4AF67] hover:after:w-full after:transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            aria-label={isPlayingMusic ? 'Mute Guzarish instrumental music' : 'Play Guzarish instrumental music'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF67]/50 bg-[#641D32]/50 hover:bg-[#641D32] text-[#F7E7C4] text-xs font-serif-royal transition-all duration-300 shadow-sm cursor-pointer"
            title={isPlayingMusic ? 'Mute Guzarish background music' : 'Play Guzarish background music'}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 size={14} className="text-[#F7E7C4] animate-pulse" />
                <span className="hidden sm:inline text-[11px] tracking-wider uppercase">Guzarish On</span>
              </>
            ) : (
              <>
                <VolumeX size={14} className="text-[#D4AF67]" />
                <span className="hidden sm:inline text-[11px] tracking-wider uppercase">Play Guzarish</span>
              </>
            )}
          </button>

          <a
            href="#rsvp"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gold-foil-bg text-[#29101A] font-serif-royal text-xs font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <Heart size={12} className="fill-[#29101A]" />
            <span>RSVP</span>
          </a>

          <button
            onClick={onOpenAdmin}
            aria-label="Open Admin Dashboard"
            className="p-1.5 text-[#D4AF67]/70 hover:text-[#D4AF67] transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            title="Admin Login & Guest Portal"
          >
            <Shield size={16} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-1.5 text-[#F8F5EF] hover:text-[#D4AF67] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1C0912] border-b border-[#D4AF67]/30 px-6 py-6 animate-fade-in shadow-2xl text-center">
          {guestName && (
            <p className="text-xs text-[#D4AF67] mb-4 pb-2 border-b border-white/10 font-serif-elegant">
              Honoured Guest: <span className="text-white font-semibold">{guestName}</span>
            </p>
          )}
          <nav className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] font-serif-royal font-medium text-[#F8F5EF]/90 hover:text-[#D4AF67] py-1"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex justify-center">
              <a
                href="#rsvp"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full gold-foil-bg text-[#29101A] font-serif-royal text-xs font-bold tracking-widest uppercase shadow"
              >
                <Heart size={12} className="fill-[#29101A]" />
                Confirm Attendance (RSVP)
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
