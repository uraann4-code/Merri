import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Music, Sparkles, Volume2, Check, ExternalLink, Disc3, Radio } from 'lucide-react';
import { royalAmbiance, CURATED_TRACKS, WeddingTrack } from '../lib/audioAmbiance';
import { Language } from '../lib/translations';

interface MusicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const MusicSelectorModal: React.FC<MusicSelectorModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  const [currentTrack, setCurrentTrack] = useState<WeddingTrack>(royalAmbiance.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(royalAmbiance.getIsPlaying());
  const [volume, setVolume] = useState<number>(royalAmbiance.getVolume());
  const [customInput, setCustomInput] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');

  useEffect(() => {
    const unsubState = royalAmbiance.subscribe(setIsPlaying);
    const unsubTrack = royalAmbiance.subscribeTrack(setCurrentTrack);
    return () => {
      unsubState();
      unsubTrack();
    };
  }, []);

  if (!isOpen) return null;

  const handleSelectTrack = (track: WeddingTrack) => {
    royalAmbiance.selectTrack(track);
    if (!isPlaying) {
      royalAmbiance.play();
    }
  };

  const handleTogglePlay = () => {
    royalAmbiance.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    royalAmbiance.setVolume(newVol);
  };

  const handleApplyCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    royalAmbiance.setCustomYouTubeTrack(customInput.trim(), customTitle.trim() || undefined);
    setCustomInput('');
    setCustomTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-md select-none animate-fade-in">
      <div className="w-full max-w-xl bg-[#FAF7F2] border-2 border-[#D4AF67] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#2C2621]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#EDE4D5] border-b border-[#D4AF67]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#D4AF67] flex items-center justify-center text-[#845E1B] bg-white shadow-xs">
              <Disc3 size={20} className={isPlaying ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h3 className="font-serif-royal text-base sm:text-lg font-bold text-[#2C2621]">
                {lang === 'ur' ? 'پس منظر موسیقی منتخب کریں' : 'Royal Wedding Background Music'}
              </h3>
              <p className="text-[11px] text-[#845E1B] font-serif-royal">
                {lang === 'ur' ? 'مبشر اور تسمیہ کے لیے شاہی نغمات' : 'Select a romantic Pakistani wedding anthem'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-[#2C2621] hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Currently Playing Card */}
          <div className="p-4 rounded-2xl border-2 border-[#D4AF67]/60 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl gold-foil-bg flex items-center justify-center text-[#2C2621] shadow-xs shrink-0">
                <Music size={22} className={isPlaying ? 'animate-bounce' : ''} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-serif-royal font-bold text-[#845E1B] bg-[#EDE4D5] px-2 py-0.5 rounded-full">
                    {isPlaying ? (lang === 'ur' ? 'جاری ہے' : 'Now Playing') : (lang === 'ur' ? 'موقوف' : 'Paused')}
                  </span>
                  <span className="text-[10px] text-stone-500 font-sans">{currentTrack.tag}</span>
                </div>
                <h4 className="font-serif-royal font-bold text-[#2C2621] text-base truncate mt-0.5">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-[#5C4D3C] truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleTogglePlay}
                className="px-5 py-2.5 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="px-2 flex items-center gap-3">
            <Volume2 size={16} className="text-[#845E1B] shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Adjust wedding music volume"
              className="w-full h-1.5 bg-[#EDE4D5] rounded-lg appearance-none cursor-pointer accent-[#845E1B]"
            />
            <span className="text-xs font-mono text-stone-600 w-8 text-right">{volume}%</span>
          </div>

          {/* Curated Track List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-serif-royal uppercase tracking-wider font-bold text-[#845E1B] flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>{lang === 'ur' ? 'شاہی شادی کے منتخب نغمات' : 'Curated Wedding Melodies'}</span>
              </h4>
              <span className="text-[11px] text-stone-500 font-sans">
                {CURATED_TRACKS.length} Tracks Available
              </span>
            </div>

            <div className="space-y-2">
              {CURATED_TRACKS.map((track) => {
                const isSelected = currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#D4AF67] bg-[#EDE4D5]/60 shadow-xs'
                        : 'border-[#D4AF67]/30 bg-white hover:bg-[#FAF7F2] hover:border-[#D4AF67]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-serif-royal ${
                          isSelected
                            ? 'bg-[#845E1B] text-white shadow-xs'
                            : 'bg-[#EDE4D5] text-[#845E1B]'
                        }`}
                      >
                        {isSelected && isPlaying ? (
                          <Radio size={14} className="animate-pulse" />
                        ) : (
                          <Play size={13} className="ml-0.5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif-royal font-bold text-sm text-[#2C2621] truncate">
                            {track.title}
                          </span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-[#845E1B] text-white text-[9px] uppercase font-bold tracking-wider">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5C4D3C] truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="hidden sm:inline-block text-[10px] text-stone-500 bg-[#FAF7F2] border border-[#D4AF67]/30 px-2 py-1 rounded-md font-sans">
                        {track.tag}
                      </span>
                      {isSelected ? (
                        <Check size={16} className="text-[#845E1B]" />
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg border border-[#D4AF67]/50 text-[#845E1B] text-[11px] font-serif-royal hover:bg-[#D4AF67] hover:text-[#2C2621] transition-colors"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom YouTube Song Input */}
          <div className="pt-2 border-t border-[#D4AF67]/30">
            <h4 className="text-xs font-serif-royal uppercase tracking-wider font-bold text-[#845E1B] mb-1.5 flex items-center gap-1.5">
              <ExternalLink size={13} />
              <span>{lang === 'ur' ? 'اپنی مرضی کا یوٹیوب گانا شامل کریں' : 'Custom Song (YouTube Link)'}</span>
            </h4>
            <p className="text-[11px] text-stone-600 mb-3">
              Want a specific instrumental or song? Paste any YouTube link or video ID below.
            </p>

            <form onSubmit={handleApplyCustomTrack} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or Video ID"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/50 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B] placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="px-4 py-2.5 rounded-xl gold-foil-bg text-[#2C2621] text-xs font-serif-royal font-bold uppercase tracking-wider hover:brightness-105 disabled:opacity-50 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  Play Song
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#EDE4D5]/60 border-t border-[#D4AF67]/30 flex items-center justify-between text-xs text-stone-600">
          <span>Plays gracefully following guest interaction</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-[#D4AF67]/60 bg-white text-[#2C2621] font-serif-royal font-semibold hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
