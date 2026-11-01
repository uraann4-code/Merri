import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Shield, Heart, Globe, ListMusic } from 'lucide-react';
import { royalAmbiance, WeddingTrack } from '../lib/audioAmbiance';
import { Language, translations } from '../lib/translations';

interface NavbarProps {
  onOpenAdmin: () => void;
  guestName?: string;
  isMemoriesActive?: boolean;
  lang: Language;
  onToggleLang: () => void;
  onOpenMusicSelector?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  guestName,
  lang,
  onToggleLang,
  onOpenMusicSelector,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(royalAmbiance.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<WeddingTrack>(royalAmbiance.getCurrentTrack());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubState = royalAmbiance.subscribe(setIsPlayingMusic);
    const unsubTrack = royalAmbiance.subscribeTrack(setCurrentTrack);
    return () => {
      unsubState();
      unsubTrack();
    };
  }, []);

  const toggleMusic = () => {
    royalAmbiance.toggle();
  };

  const navLinks = [
    { label: lang === 'ur' ? 'دعوت نامہ' : 'Invitation', href: '#invitation' },
    { label: lang === 'ur' ? 'ہماری کہانی' : 'Our Story', href: '#story' },
    { label: lang === 'ur' ? 'تقریبِ ولیمہ' : 'Walima Event', href: '#event' },
    { label: lang === 'ur' ? 'شمارِ وقت' : 'Countdown', href: '#countdown' },
    { label: lang === 'ur' ? 'تصویری البم' : 'Gallery', href: '#gallery' },
    { label: lang === 'ur' ? 'شرکت کی تصدیق' : 'RSVP', href: '#rsvp' },
    { label: lang === 'ur' ? 'مقام و نقشہ' : 'Venue & Map', href: '#venue' },
    { label: lang === 'ur' ? 'معلومات' : 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md py-3 shadow-md border-b border-[#D4AF67]/35 text-[#2C2621]'
          : 'bg-gradient-to-b from-[#FAF7F2]/95 via-[#FAF7F2]/60 to-transparent py-4 text-[#2C2621]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Monogram Brand */}
        <a href="#invitation" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4AF67] flex items-center justify-center bg-white text-[#845E1B] shadow-md group-hover:scale-105 transition-transform">
            <span className="font-serif-decorative text-xs font-bold tracking-wider">M&amp;T</span>
          </div>
          <div className="flex flex-col text-left">
            <span className={`text-xs sm:text-sm font-bold tracking-wider text-[#2C2621] group-hover:text-[#845E1B] transition-colors ${
              lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
            }`}>
              {lang === 'ur' ? 'مبشر اور تسمیہ محفوظ' : 'Mubasshir & Tasmia'}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#845E1B] font-bold font-serif-royal">
              <span>{lang === 'ur' ? 'دعوتِ ولیمہ' : 'Walima'}</span>
              <span aria-hidden="true">·</span>
              <span>8 Nov 2026</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-xs uppercase tracking-[0.18em] font-medium text-[#3D332A] hover:text-[#845E1B] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D4AF67] hover:after:w-full after:transition-all ${
                lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Controls: Language Toggle, Music Player & Admin */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4AF67]/50 bg-white/90 hover:bg-[#EDE4D5] text-[#2C2621] text-xs font-serif-royal transition-all duration-300 cursor-pointer shadow-sm"
            title={lang === 'en' ? 'اردو میں دیکھیں (Switch to Urdu)' : 'Switch to English'}
          >
            <Globe size={13} className="text-[#845E1B]" />
            <span className="font-bold">{lang === 'en' ? 'اردو' : 'English'}</span>
          </button>

          {/* Audio Ambiance Controller */}
          <div className="relative flex items-center gap-1">
            <button
              onClick={toggleMusic}
              aria-label={isPlayingMusic ? 'Mute background music' : 'Play background music'}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF67]/50 bg-white/90 hover:bg-[#EDE4D5] text-[#845E1B] text-xs font-serif-royal transition-all duration-300 shadow-sm cursor-pointer"
              title={isPlayingMusic ? 'Mute background music' : 'Play background music'}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 size={14} className="text-[#845E1B] animate-pulse" />
                  <span className="hidden sm:inline text-[11px] tracking-wider uppercase font-semibold">
                    {currentTrack.title}
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={14} className="text-[#845E1B]" />
                  <span className="hidden sm:inline text-[11px] tracking-wider uppercase font-semibold">
                    Play Music
                  </span>
                </>
              )}
            </button>

            {onOpenMusicSelector && (
              <button
                onClick={onOpenMusicSelector}
                aria-label="Change wedding song"
                className="p-1.5 rounded-full border border-[#D4AF67]/50 bg-white/90 hover:bg-[#EDE4D5] text-[#845E1B] transition-colors cursor-pointer shadow-xs"
                title="Change wedding song"
              >
                <ListMusic size={13} />
              </button>
            )}
          </div>

          {/* Quick RSVP CTA button */}
          <a
            href="#rsvp"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-md border border-[#D4AF67]/40"
          >
            <Heart size={12} className="fill-[#2C2621]" />
            <span>{lang === 'ur' ? 'تصدیق' : 'RSVP'}</span>
          </a>

          {/* Admin shortcut button */}
          <button
            onClick={onOpenAdmin}
            aria-label="Open Admin Dashboard"
            className="p-1.5 text-[#845E1B] hover:text-[#2C2621] transition-colors rounded-full hover:bg-[#D4AF67]/20 cursor-pointer"
            title="Admin Login & Guest Portal"
          >
            <Shield size={16} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-1.5 text-[#2C2621] hover:text-[#845E1B] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#D4AF67]/40 px-6 py-6 animate-fade-in shadow-2xl text-center">
          {guestName && (
            <p className="text-xs text-[#845E1B] mb-4 pb-2 border-b border-[#D4AF67]/20 font-serif-elegant font-semibold">
              {lang === 'ur' ? 'محترم مہمانِ گرامی: ' : 'Honoured Guest: '}
              <span className="text-[#2C2621] font-bold">{guestName}</span>
            </p>
          )}

          <div className="flex justify-center mb-4">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#D4AF67] text-xs font-serif-royal text-[#845E1B] bg-white"
            >
              <Globe size={13} />
              <span>{lang === 'en' ? 'اردو زبان منتخب کریں' : 'Switch to English'}</span>
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs uppercase tracking-[0.2em] font-medium text-[#2C2621] hover:text-[#845E1B] py-1 ${
                  lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#D4AF67]/20 flex justify-center">
              <a
                href="#rsvp"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold tracking-widest uppercase shadow border border-[#D4AF67]/40"
              >
                <Heart size={12} className="fill-[#2C2621]" />
                {lang === 'ur' ? 'شرکت کی تصدیق فرمائیں' : 'Confirm Attendance (RSVP)'}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
