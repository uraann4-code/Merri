import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, query, limit } from 'firebase/firestore';
import { MessageSquare, Send, Film, Image as ImageIcon, Lock, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { GalleryItem } from '../types/wedding';
import { GoldDivider, MughalCorner } from './MughalMotif';

import { Language, translations } from '../lib/translations';

interface MemoriesGalleryProps {
  isMemoriesActive: boolean;
  guestName?: string;
  lang?: Language;
}

interface GuestDuas {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
}

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({ isMemoriesActive, guestName, lang = 'en' }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [wishes, setWishes] = useState<GuestDuas[]>([]);
  const [newAuthor, setNewAuthor] = useState(guestName || '');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedWish, setSubmittedWish] = useState(false);
  const t = translations[lang];

  // Sync Gallery Items from Firestore collection 'gallery'
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'gallery'), (snap) => {
        const list: GalleryItem[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }));
        if (list.length > 0) {
          setGalleryItems(list);
        } else {
          setGalleryItems([
            { id: '1', title: 'The Royal Walima Stage', category: 'Stage Elegance' },
            { id: '2', title: 'Dawat-e-Walima Feast', category: 'Banquet & Milni' },
            { id: '3', title: 'Family Blessings & Duas', category: 'Moments of Grace' },
            { id: '4', title: 'Couple Formal Portraiture', category: 'Portraits' },
            { id: '5', title: 'Istiqbal & Reception', category: 'Guest Welcome' },
            { id: '6', title: 'Celebratory Farewell', category: 'Sweet Farewells' },
          ]);
        }
      });
      return () => unsub();
    } catch {
      // Fallback
    }
  }, []);

  // Sync Wishes from Firestore 'rsvps' notes or dedicated wishes
  useEffect(() => {
    try {
      const q = query(collection(db, 'wishes'), limit(20));
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list: GuestDuas[] = [];
          snap.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as Omit<GuestDuas, 'id'>) });
          });
          if (list.length > 0) {
            setWishes(list);
          } else {
            setWishes([
              {
                id: 'wish_1',
                guestName: 'Uncle Tariq & Family',
                message: 'Mubarak to Mubasshir and Tasmia! May Allah SWT shower your Walima and union with endless happiness, barakah, and peace.',
                createdAt: '2026-10-28T10:00:00Z',
              },
              {
                id: 'wish_2',
                guestName: 'Farhan & Ayesha',
                message: 'So thrilled to celebrate your special Walima at Bukhara Royale! You two make the most wonderful couple. Heartiest congratulations!',
                createdAt: '2026-10-29T14:30:00Z',
              },
            ]);
          }
        },
        () => {}
      );
      return () => unsubscribe();
    } catch {}
  }, []);

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    const wishData = {
      guestName: newAuthor.trim(),
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'wishes'), wishData);
      setNewMessage('');
      setSubmittedWish(true);
      setTimeout(() => setSubmittedWish(false), 4000);
    } catch (err) {
      console.error('Error posting wish', err);
      setWishes([{ id: `local_${Date.now()}`, ...wishData }, ...wishes]);
      setNewMessage('');
      setSubmittedWish(true);
      setTimeout(() => setSubmittedWish(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="memories" className="py-24 sm:py-32 ivory-palace-gradient text-[#2C2621] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#845E1B] font-bold">
            {lang === 'ur' ? 'یادگار لمحات اور دعائیں' : 'Cherished Moments & Blessings'}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2621] tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {t.memoriesTitle}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-base sm:text-lg text-[#3D332A] ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {t.memoriesSubtitle}
          </p>
        </div>

        {/* Gallery Section */}
        <div className="mb-20">
          {isMemoriesActive ? (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-[#D4AF67]/30">
                <div className="flex items-center gap-2 text-[#845E1B]">
                  <Film size={22} />
                  <h3 className={`text-xl sm:text-2xl font-bold text-[#2C2621] uppercase tracking-wider ${
                    lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
                  }`}>
                    {lang === 'ur' ? 'سرکاری تصویری البم اور فلم' : 'Official Walima Gallery & Film'}
                  </h3>
                </div>
                <div className="text-xs uppercase tracking-widest text-[#845E1B] font-serif-royal font-bold">
                  {lang === 'ur' ? 'کھول دیا گیا' : 'Memories Unlocked'}
                </div>
              </div>

              {/* Video Highlight Box */}
              <div className="w-full aspect-video max-h-[460px] rounded-3xl border-2 border-[#D4AF67] bg-[#1F1A17] flex flex-col items-center justify-center p-8 text-center shadow-xl relative overflow-hidden">
                <div className="w-18 h-18 rounded-full gold-foil-bg text-[#2C2621] flex items-center justify-center shadow-xl mb-4 border border-[#D4AF67]/50">
                  <Film size={32} />
                </div>
                <h4 className={`text-2xl font-bold text-white ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                  {lang === 'ur' ? 'سینماٹک ویڈیو ہائی لائٹس' : 'The Walima Cinematic Wedding Highlight'}
                </h4>
                <p className={`text-xs text-[#FAF7F2]/85 mt-2 max-w-md ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                  {lang === 'ur'
                    ? 'بخارا روئیل مارکی میں منعقدہ دعوتِ ولیمہ کی خوبصورت اور پُروقار ویڈیو جھلکیاں۔'
                    : 'A high-definition cinematic short film capturing the grand reception, the royal decor of Bukhara Royale Marquee, and joyful family moments.'}
                </p>
              </div>

              {/* Photo Cards Grid from Firestore collection 'gallery' */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl border-2 border-[#D4AF67]/40 overflow-hidden bg-white p-8 min-h-[200px] flex flex-col justify-end transition-all duration-300 hover:border-[#D4AF67] hover:scale-[1.02] shadow-md text-[#2C2621]"
                  >
                    <div className="absolute top-4 right-4 text-[#845E1B]/60 group-hover:text-[#845E1B]">
                      <ImageIcon size={22} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#845E1B] font-serif-royal font-bold">
                      {item.category}
                    </span>
                    <h5 className={`text-lg font-bold text-[#2C2621] mt-1 ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                      {item.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="luxury-card-gradient rounded-3xl border-2 border-[#D4AF67]/50 p-8 sm:p-14 text-center shadow-xl relative max-w-3xl mx-auto text-[#2C2621]">
              <MughalCorner position="top-left" className="absolute top-3 left-3" size={36} />
              <MughalCorner position="top-right" className="absolute top-3 right-3" size={36} />
              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF67] bg-[#FAF7F2] text-[#845E1B] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Lock size={26} />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#845E1B] font-bold">
                {lang === 'ur' ? 'تصویری البم اور ویڈیو' : 'Event Film & Photo Album'}
              </span>
              <h3 className={`text-2xl sm:text-3xl font-bold text-[#2C2621] mt-2 ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                {t.memoriesTeaserTitle}
              </h3>
              <p className={`text-sm text-[#3D332A] max-w-lg mx-auto mt-3 leading-relaxed ${lang === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                {t.memoriesTeaserDesc}
              </p>
              <div className="mt-6 text-xs text-[#845E1B] font-serif-royal font-bold">
                {lang === 'ur' ? 'تقریب کے اختتام پر جاری کیا جائے گا' : 'Admin Activated Post-Ceremony'}
              </div>
            </div>
          )}
        </div>

        {/* Guest Blessings & Dua Wall */}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#D4AF67]/25">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-serif-royal text-[#845E1B] font-bold">
                {lang === 'ur' ? 'دعائیہ پیغامات کا گوشہ' : 'Guestbook of Prayers'}
              </span>
              <h3 className={`text-2xl sm:text-3xl font-bold text-[#2C2621] mt-1 ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                {lang === 'ur' ? 'مبشر اور تسمیہ کے لیے نیک تمنائیں اور دعائیں' : 'Leave a Blessing for Mubasshir & Tasmia'}
              </h3>
            </div>
            <span className={`text-xs text-[#845E1B] font-semibold ${lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'}`}>
              {lang === 'ur' ? 'اپنے دعائیہ کلمات اور مبارکباد شیئر کیجیے' : "Share your du'as and congratulatory messages"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white border-2 border-[#D4AF67]/40 rounded-3xl p-7 shadow-xl h-fit relative text-[#2C2621]">
              <MughalCorner position="top-left" className="absolute top-2 left-2" size={28} />
              <h4 className={`text-base font-bold text-[#2C2621] mb-4 flex items-center gap-2 ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                <MessageSquare size={16} className="text-[#845E1B]" />
                <span>{t.leaveWishTitle}</span>
              </h4>

              {submittedWish && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-400 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-serif-royal font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>{lang === 'ur' ? 'جزاکم اللہ خیراً! آپ کی دعا شامل کر لی گئی ہے۔' : "JazakAllah Khair! Your du'a has been added to the blessing wall."}</span>
                </div>
              )}

              <form onSubmit={handleSendWish} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#2C2621] font-serif-royal font-bold mb-1">
                    {lang === 'ur' ? 'آپ کا اسم گرامی / فیملی' : 'Your Name / Family'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder={lang === 'ur' ? 'مثلاً: انکل ندیم و فیملی' : 'e.g. Uncle Nadeem & Family'}
                    className={`w-full px-4 py-3 rounded-xl border border-stone-300 bg-[#FAF8F5] text-[#2C2621] placeholder:text-stone-400 text-xs focus:border-[#D4AF67] outline-none ${
                      lang === 'ur' ? 'font-urdu' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#2C2621] font-serif-royal font-bold mb-1">
                    {lang === 'ur' ? 'آپ کا دعائیہ پیغام' : "Your Blessing or Du'a"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={lang === 'ur' ? 'اللہ تعالیٰ اس مبارک بندھن کو دائمی خوشیوں، برکت اور امن سے نوازے...' : 'May Allah bless this beautiful union with happiness, longevity, and peace...'}
                    className={`w-full px-4 py-3 rounded-xl border border-stone-300 bg-[#FAF8F5] text-[#2C2621] placeholder:text-stone-400 text-xs focus:border-[#D4AF67] outline-none ${
                      lang === 'ur' ? 'font-urdu' : ''
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer border border-[#D4AF67]/50"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? (lang === 'ur' ? 'ارسال کیا جا رہا ہے...' : 'Posting Du’a...') : t.postBlessing}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4 max-h-[540px] overflow-y-auto pr-2">
              {wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="bg-white border-2 border-[#D4AF67]/35 rounded-2xl p-6 hover:border-[#D4AF67] transition-all relative group shadow-sm text-[#2C2621]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif-royal text-base font-bold text-[#2C2621] group-hover:text-[#845E1B] transition-colors">
                      {wish.guestName}
                    </span>
                    <span className="text-[11px] text-[#845E1B] font-mono font-bold">
                      {new Date(wish.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-[#3D332A] font-serif-elegant italic leading-relaxed">
                    "{wish.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
