import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, ListMusic } from 'lucide-react';
import { royalAmbiance, WeddingTrack } from '../lib/audioAmbiance';
import { Language } from '../lib/translations';

interface MusicFloatingPillProps {
  onOpenSelector: () => void;
  lang?: Language;
}

export const MusicFloatingPill: React.FC<MusicFloatingPillProps> = ({
  onOpenSelector,
  lang = 'en',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(royalAmbiance.getIsPlaying());
  const [track, setTrack] = useState<WeddingTrack>(royalAmbiance.getCurrentTrack());

  useEffect(() => {
    const unsubState = royalAmbiance.subscribe(setIsPlaying);
    const unsubTrack = royalAmbiance.subscribeTrack(setTrack);
    return () => {
      unsubState();
      unsubTrack();
    };
  }, []);

  const toggleMusic = () => {
    royalAmbiance.toggle();
  };

  return (
    <aside aria-label="Wedding Music Player" className="fixed bottom-4 right-4 z-40 select-none">
      <div className="flex items-center gap-1.5 p-1.5 pl-3 rounded-full bg-white/95 backdrop-blur-md border border-[#D4AF67]/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-[#2C2621] transition-all hover:border-[#D4AF67]">
        {/* Track Info & Toggle */}
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 cursor-pointer group"
          title={isPlaying ? 'Pause Background Music' : 'Play Background Music'}
        >
          <div className="w-7 h-7 rounded-full bg-[#EDE4D5] border border-[#D4AF67]/50 flex items-center justify-center text-[#845E1B] group-hover:bg-[#D4AF67] group-hover:text-[#2C2621] transition-colors">
            {isPlaying ? (
              <Volume2 size={13} className="animate-pulse" />
            ) : (
              <VolumeX size={13} />
            )}
          </div>

          <div className="text-left hidden md:block max-w-[140px] truncate pr-1">
            <p className="text-[11px] font-serif-royal font-bold text-[#2C2621] truncate leading-tight">
              {track.title}
            </p>
            <p className="text-[9px] text-[#845E1B] truncate leading-tight font-sans">
              {isPlaying ? (lang === 'ur' ? 'جاری ہے' : 'Playing') : (lang === 'ur' ? 'موقوف' : 'Paused')}
            </p>
          </div>
        </button>

        {/* Change Track Button */}
        <button
          onClick={onOpenSelector}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full gold-foil-bg text-[#2C2621] text-[10px] font-serif-royal font-bold uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-xs"
          title="Change wedding background music"
        >
          <ListMusic size={12} />
          <span className="hidden sm:inline">{lang === 'ur' ? 'تبدیل' : 'Change'}</span>
        </button>
      </div>
    </aside>
  );
};
