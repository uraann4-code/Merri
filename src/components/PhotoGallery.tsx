import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GoldDivider, MughalCorner } from './MughalMotif';
import { Language, translations } from '../lib/translations';

interface PhotoGalleryProps {
  lang: Language;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  titleUrdu: string;
  category: string;
  categoryUrdu: string;
  aspect: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Curated royal Pakistani wedding moments with rich aesthetic imagery
  const galleryImages: GalleryImage[] = [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      title: 'Imperial Royal Stage',
      titleUrdu: 'شاہی اسٹیج کا دلکش منظر',
      category: 'Mughal Elegance',
      categoryUrdu: 'مغلائی نفاست',
      aspect: 'aspect-4/3',
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      title: 'Handcrafted Festive Attire',
      titleUrdu: 'نفیس روایتی ملبوسات',
      category: 'Couture & Jewels',
      categoryUrdu: 'شاہی ملبوسات و زیورات',
      aspect: 'aspect-3/4',
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      title: 'Bukhara Royale Chandeliers',
      titleUrdu: 'بخارا روئیل کے روشن جھومر',
      category: 'Grand Banquet',
      categoryUrdu: 'عالیشان ہال',
      aspect: 'aspect-4/3',
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      title: 'Sacred Floral Milni',
      titleUrdu: 'پھولوں سے پُرتپاک استقبال',
      category: 'Traditions',
      categoryUrdu: 'روایات و خلوص',
      aspect: 'aspect-3/4',
    },
    {
      id: 'img-5',
      url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      title: 'Dawat-e-Walima Banquet',
      titleUrdu: 'لذیذ روایتی ضیافت',
      category: 'Royal Feast',
      categoryUrdu: 'شاہی دعوت',
      aspect: 'aspect-4/3',
    },
    {
      id: 'img-6',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      title: 'Eternal Vows & Blessings',
      titleUrdu: 'دعائے خیر اور وفا کا عہد',
      category: 'Union of Hearts',
      categoryUrdu: 'دائمی بندھن',
      aspect: 'aspect-4/3',
    },
  ];

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % galleryImages.length);
  }, [selectedIndex, galleryImages.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + galleryImages.length) % galleryImages.length);
  }, [selectedIndex, galleryImages.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  // Touch gesture support on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext(); // Swiped left -> show next
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> show prev
    }
    setTouchStartX(null);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#F8F5EF] text-[#29101A] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#9E7422] font-bold">
            {lang === 'ur' ? 'تصویری جھلکیاں' : 'Moments of Grandeur'}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#641D32] tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {lang === 'ur' ? 'شاہی تصویری البم' : 'Curated Wedding Gallery'}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-base sm:text-lg text-[#29101A]/85 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {lang === 'ur'
              ? 'بخارا روئیل مارکی کے پُروقار ماحول میں دعوتِ ولیمہ کے یادگار اور سحر انگیز لمحات۔'
              : '"Capturing the regal ambiance, timeless heritage, and joyous laughter of our sacred union."'}
          </p>
        </div>

        {/* Responsive Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {galleryImages.map((image, idx) => (
            <div
              key={image.id}
              onClick={() => setSelectedIndex(idx)}
              className="group relative rounded-3xl overflow-hidden border-2 border-[#D4AF67]/40 shadow-lg hover:shadow-2xl hover:border-[#D4AF67] transition-all duration-500 cursor-pointer bg-stone-900"
            >
              <div className="overflow-hidden aspect-4/3 relative">
                <img
                  src={image.url}
                  alt={lang === 'ur' ? image.titleUrdu : image.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-95 group-hover:brightness-100"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Maximize Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#29101A]/80 border border-[#D4AF67] flex items-center justify-center text-[#F7E7C4] opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <Maximize2 size={16} />
                </div>

                {/* Bottom Title Bar */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF67] font-serif-royal font-bold">
                    {lang === 'ur' ? image.categoryUrdu : image.category}
                  </span>
                  <h4 className={`text-base sm:text-lg font-bold text-white mt-0.5 ${
                    lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
                  }`}>
                    {lang === 'ur' ? image.titleUrdu : image.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Interactive Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar with Counter & Close */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:right-8 sm:left-8 z-50 flex items-center justify-between text-[#F8F5EF]">
            <div className="flex items-center gap-2 font-serif-royal text-xs text-[#D4AF67] uppercase tracking-widest">
              <Sparkles size={14} />
              <span>
                {selectedIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close Lightbox"
            >
              <X size={22} />
            </button>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full border border-[#D4AF67]/50 bg-[#29101A]/80 hover:bg-[#641D32] text-[#F7E7C4] hover:text-white transition-all duration-300 cursor-pointer shadow-2xl z-50"
            title="Previous (Left Arrow)"
            aria-label="Previous Image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full border border-[#D4AF67]/50 bg-[#29101A]/80 hover:bg-[#641D32] text-[#F7E7C4] hover:text-white transition-all duration-300 cursor-pointer shadow-2xl z-50"
            title="Next (Right Arrow)"
            aria-label="Next Image"
          >
            <ChevronRight size={28} />
          </button>

          {/* Active Image Container */}
          <div className="relative max-w-5xl max-h-[85vh] p-4 flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF67] shadow-2xl">
              <img
                src={galleryImages[selectedIndex].url}
                alt={lang === 'ur' ? galleryImages[selectedIndex].titleUrdu : galleryImages[selectedIndex].title}
                className="max-h-[75vh] w-auto object-contain mx-auto transition-all duration-300"
              />
            </div>

            {/* Lightbox Caption */}
            <div className="mt-4 text-center">
              <h4 className={`text-lg sm:text-xl font-bold text-white ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {lang === 'ur'
                  ? galleryImages[selectedIndex].titleUrdu
                  : galleryImages[selectedIndex].title}
              </h4>
              <p className="text-xs uppercase tracking-widest text-[#D4AF67] mt-1 font-serif-royal">
                {lang === 'ur'
                  ? galleryImages[selectedIndex].categoryUrdu
                  : galleryImages[selectedIndex].category}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
