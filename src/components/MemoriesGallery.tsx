import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, query, limit } from 'firebase/firestore';
import { MessageSquare, Send, Film, Image as ImageIcon, Lock, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { GuestWish } from '../types/wedding';
import { GoldDivider, MughalCorner } from './MughalMotif';

interface MemoriesGalleryProps {
  isMemoriesActive: boolean;
  guestName?: string;
}

export const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({ isMemoriesActive, guestName }) => {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [newAuthor, setNewAuthor] = useState(guestName || '');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedWish, setSubmittedWish] = useState(false);

  const defaultWishes: GuestWish[] = [
    {
      id: 'wish_1',
      guestName: 'Uncle Tariq & Family',
      message: 'Mubarak to both Mubasshir and Tasmia! May Allah SWT shower your union with endless happiness, barakah, and peace.',
      createdAt: '2026-10-28T10:00:00Z',
    },
    {
      id: 'wish_2',
      guestName: 'Farhan & Ayesha',
      message: 'So thrilled to celebrate your special day at Bukhara Royale! You two make the most wonderful couple. Heartiest congratulations!',
      createdAt: '2026-10-29T14:30:00Z',
    },
    {
      id: 'wish_3',
      guestName: 'The Mehfooz Relatives',
      message: 'May your home be filled with harmony, laughter, and lifelong devotion. Looking forward to the grand Baraat!',
      createdAt: '2026-10-30T16:00:00Z',
    },
  ];

  useEffect(() => {
    try {
      const q = query(collection(db, 'wishes'), limit(20));
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const list: GuestWish[] = [];
          snap.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as Omit<GuestWish, 'id'>) });
          });
          if (list.length > 0) {
            setWishes(list);
          } else {
            setWishes(defaultWishes);
          }
        },
        (err) => {
          console.warn('Wishes listener warning, using fallback list', err);
          setWishes(defaultWishes);
        }
      );
      return () => unsubscribe();
    } catch {
      setWishes(defaultWishes);
    }
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
      setWishes([
        { id: `local_${Date.now()}`, ...wishData },
        ...wishes,
      ]);
      setNewMessage('');
      setSubmittedWish(true);
      setTimeout(() => setSubmittedWish(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="memories" className="py-24 sm:py-32 burgundy-palace-gradient text-[#F8F5EF] relative overflow-hidden select-none">
      <div className="absolute inset-0 dark-damask-pattern opacity-35 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#D4AF67] font-bold">
            Cherished Moments &amp; Blessings
          </span>
          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide mt-2">
            Wedding Memories &amp; Du'as
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif-elegant italic text-base sm:text-lg text-[#F7E7C4]/90">
            "Words of affection and glimpses of celebration that will last a lifetime."
          </p>
        </div>

        {/* Gallery Section */}
        <div className="mb-20">
          {isMemoriesActive ? (
            /* Activated Gallery */
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-[#D4AF67]/30">
                <div className="flex items-center gap-2 text-[#D4AF67]">
                  <Film size={22} />
                  <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                    Official Baraat Gallery &amp; Film
                  </h3>
                </div>
                <div className="text-xs uppercase tracking-widest text-[#F7E7C4] font-serif-royal font-bold">
                  Memories Unlocked
                </div>
              </div>

              {/* Video Highlight Box */}
              <div className="w-full aspect-video max-h-[460px] rounded-3xl border-2 border-[#D4AF67] bg-black/70 flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden">
                <div className="w-18 h-18 rounded-full gold-foil-bg text-[#29101A] flex items-center justify-center shadow-xl mb-4">
                  <Film size={32} />
                </div>
                <h4 className="font-serif-royal text-2xl font-bold text-white">
                  The Baraat Cinematic Wedding Highlight
                </h4>
                <p className="text-xs text-[#F7E7C4]/85 mt-2 max-w-md font-sans">
                  A high-definition cinematic short film capturing the arrival, the royal decor of Bukhara Royale Marquee, and joyful family moments.
                </p>
              </div>

              {/* Photo Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { title: 'The Royal Istiqbal', label: 'Baraat Entrance' },
                  { title: 'The Baraat Stage', label: 'Mughal Elegance' },
                  { title: 'Dawat-e-Khaas', label: 'Banquet & Milni' },
                  { title: 'Family Blessings', label: 'Cherished Duas' },
                  { title: 'The Sacred Vows', label: 'Nikah & Union' },
                  { title: 'The Rukhsati', label: 'New Beginnings' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group relative rounded-2xl border-2 border-[#D4AF67]/35 overflow-hidden bg-gradient-to-br from-[#381523] to-[#1E0912] p-8 min-h-[200px] flex flex-col justify-end transition-all duration-300 hover:border-[#D4AF67] hover:scale-[1.02] shadow-lg"
                  >
                    <div className="absolute top-4 right-4 text-[#D4AF67]/50 group-hover:text-[#D4AF67]">
                      <ImageIcon size={22} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF67] font-serif-royal font-bold">
                      {item.label}
                    </span>
                    <h5 className="font-serif-royal text-lg font-bold text-white mt-1">
                      {item.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Pre-Wedding Teaser State */
            <div className="burgundy-card-gradient rounded-3xl border-2 border-[#D4AF67]/50 p-8 sm:p-14 text-center shadow-2xl relative max-w-3xl mx-auto">
              <MughalCorner position="top-left" className="absolute top-3 left-3" size={36} />
              <MughalCorner position="top-right" className="absolute top-3 right-3" size={36} />
              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF67] bg-[#641D32]/50 text-[#D4AF67] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock size={26} />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#D4AF67] font-bold">
                Event Film &amp; Photo Album
              </span>
              <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-white mt-2">
                Unveiling After The Grand Baraat
              </h3>
              <p className="text-sm text-[#F8F5EF]/85 max-w-lg mx-auto mt-3 font-sans leading-relaxed">
                The official wedding photography collection, drone highlights, and high-definition cinematic film will be curated and published here following the ceremony on 8 November 2026.
              </p>
              <div className="mt-6 text-xs text-[#F7E7C4] font-serif-royal font-medium">
                Admin Activated Post-Ceremony
              </div>
            </div>
          )}
        </div>

        {/* Guest Blessings & Dua Wall */}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#D4AF67]/25">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-serif-royal text-[#D4AF67] font-bold">
                Guestbook of Prayers
              </span>
              <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-white mt-1">
                Leave a Blessing for Mubasshir &amp; Tasmia
              </h3>
            </div>
            <span className="text-xs text-[#F7E7C4]/80 font-serif-elegant italic">
              Share your du'as and congratulatory messages
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Wish Submission Form (5 cols) */}
            <div className="lg:col-span-5 bg-[#2D0F1D] border-2 border-[#D4AF67]/40 rounded-3xl p-7 shadow-2xl h-fit relative">
              <MughalCorner position="top-left" className="absolute top-2 left-2" size={28} />
              <h4 className="font-serif-royal text-base font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#D4AF67]" />
                <span>Send Your Royal Blessing</span>
              </h4>

              {submittedWish && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-serif-royal">
                  <CheckCircle2 size={16} />
                  <span>JazakAllah Khair! Your du'a has been added to the blessing wall.</span>
                </div>
              )}

              <form onSubmit={handleSendWish} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#D4AF67] font-serif-royal font-bold mb-1">
                    Your Name / Family
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Uncle Nadeem &amp; Family"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black/40 text-white placeholder:text-stone-500 text-xs focus:border-[#D4AF67] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#D4AF67] font-serif-royal font-bold mb-1">
                    Your Blessing or Du'a
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="May Allah bless this beautiful union with happiness, longevity, and peace..."
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-black/40 text-white placeholder:text-stone-500 text-xs focus:border-[#D4AF67] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl gold-foil-bg text-[#29101A] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Posting Du’a...' : 'Post Blessing'}</span>
                </button>
              </form>
            </div>

            {/* Wishes Feed (7 cols) */}
            <div className="lg:col-span-7 space-y-4 max-h-[540px] overflow-y-auto pr-2">
              {wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="bg-[#2D0F1D]/80 border-2 border-[#D4AF67]/25 rounded-2xl p-6 hover:border-[#D4AF67]/60 transition-all relative group shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif-royal text-base font-bold text-[#F8F5EF] group-hover:text-[#D4AF67] transition-colors">
                      {wish.guestName}
                    </span>
                    <span className="text-[11px] text-[#D4AF67]/80 font-mono">
                      {new Date(wish.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-[#F8F5EF]/90 font-serif-elegant italic leading-relaxed">
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
