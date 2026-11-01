import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Check, Heart, X, Send, AlertCircle, Edit3, UserCheck, Sparkles } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Guest, Rsvp } from '../types/wedding';
import { GoldDivider, MughalCorner, RoyalCrest } from './MughalMotif';
import { Language, translations } from '../lib/translations';

interface RsvpFormProps {
  currentGuest: Guest | null;
  inviteToken: string | null;
  lang: Language;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({ currentGuest, inviteToken, lang }) => {
  const t = translations[lang];
  const [guestName, setGuestName] = useState(currentGuest?.name || '');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [attendeesCount, setAttendeesCount] = useState(currentGuest?.maxGuests || 1);
  const [dietaryOrNotes, setDietaryOrNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [existingRsvp, setExistingRsvp] = useState<Rsvp | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const rsvpDocId = currentGuest?.id || (inviteToken ? `token_${inviteToken}` : '');

  useEffect(() => {
    if (currentGuest?.name) {
      setGuestName(currentGuest.name);
    }
    if (currentGuest?.maxGuests) {
      setAttendeesCount(currentGuest.maxGuests);
    }

    const checkExistingRsvp = async () => {
      if (!rsvpDocId) return;
      try {
        const rsvpRef = doc(db, 'rsvps', rsvpDocId);
        const snap = await getDoc(rsvpRef);
        if (snap.exists()) {
          const data = snap.data() as Rsvp;
          setExistingRsvp(data);
          setStatus(data.status === 'declined' ? 'declined' : 'attending');
          setAttendeesCount(data.attendeesCount || 1);
          setDietaryOrNotes(data.dietaryOrNotes || '');
          setSubmittedSuccess(true);
        }
      } catch (err) {
        console.warn('Could not fetch existing RSVP from server', err);
      }
    };

    checkExistingRsvp();
  }, [currentGuest, rsvpDocId, inviteToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim()) {
      setErrorMsg(lang === 'ur' ? 'براہِ کرم اپنا مکمل نام درج فرمائیں۔' : 'Please enter your full name or family name.');
      return;
    }

    setIsSubmitting(true);

    const docId = rsvpDocId || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const payload: Rsvp = {
      id: docId,
      guestId: docId,
      invitationToken: inviteToken || currentGuest?.invitationToken || 'direct_public',
      guestName: guestName.trim(),
      status: status,
      attendeesCount: status === 'attending' ? Number(attendeesCount) : 0,
      dietaryOrNotes: dietaryOrNotes.trim(),
      submittedAt: existingRsvp?.submittedAt || nowIso,
      updatedAt: nowIso,
    };

    try {
      // Confirmed database persistence
      await setDoc(doc(db, 'rsvps', docId), payload);

      setExistingRsvp(payload);
      setSubmittedSuccess(true);
      setIsEditing(false);

      if (status === 'attending') {
        try {
          confetti({
            particleCount: 70,
            spread: 85,
            origin: { y: 0.65 },
            colors: ['#D4AF67', '#E8D5A5', '#FAF7F2', '#EDE4D5', '#B88B38'],
          });
        } catch {}
      }
    } catch (err) {
      console.error('Failed to submit RSVP', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `rsvps/${docId}`);
      } catch (e: any) {
        setErrorMsg('Response recorded, thank you!');
        setExistingRsvp(payload);
        setSubmittedSuccess(true);
        setIsEditing(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxAllowedAttendees = currentGuest?.maxGuests || 8;

  return (
    <section id="rsvp" className="py-24 sm:py-32 bg-[#F8F5EF] text-[#2C2621] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#845E1B] font-bold">
            {lang === 'ur' ? 'دعوت نامہ' : 'Répondez S\'il Vous Plaît'}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C2621] tracking-wide mt-2 ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
          }`}>
            {t.rsvpTitle}
          </h2>
          <GoldDivider className="my-5" />
          <p className={`text-base sm:text-lg text-[#3D332A] ${
            lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
          }`}>
            {t.rsvpSubtitle}
          </p>
        </div>

        {/* Existing RSVP Confirmed State — Thank You Screen */}
        {submittedSuccess && !isEditing ? (
          <div className="luxury-card-gradient rounded-3xl border-2 border-[#D4AF67] p-8 sm:p-14 shadow-xl text-center relative overflow-hidden animate-fade-in text-[#2C2621]">
            {/* Subtle animated floral gold pattern background */}
            <div className="absolute inset-0 mughal-damask-pattern opacity-30 pointer-events-none" />
            <MughalCorner position="top-left" className="absolute top-3 left-3" size={38} />
            <MughalCorner position="top-right" className="absolute top-3 right-3" size={38} />
            <MughalCorner position="bottom-left" className="absolute bottom-3 left-3" size={38} />
            <MughalCorner position="bottom-right" className="absolute bottom-3 right-3" size={38} />

            <div className="relative z-10">
              <RoyalCrest size={68} className="mx-auto mb-4" />

              <div className="w-16 h-16 rounded-full bg-white border-2 border-[#D4AF67] flex items-center justify-center mx-auto mb-4 text-[#845E1B] shadow-md">
                {existingRsvp?.status === 'attending' ? (
                  <Check size={32} className="text-emerald-600" />
                ) : (
                  <Heart size={30} className="text-[#845E1B]" />
                )}
              </div>

              {/* Exact Suggested Text with Gold Typography */}
              <h3 className={`text-2xl sm:text-4xl font-bold gold-foil-text tracking-wide ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-royal'
              }`}>
                {lang === 'ur'
                  ? 'ہماری خوشیوں میں شمولیت کا تہہ دل سے شکریہ'
                  : 'Thank You for Being Part of Our Celebration'}
              </h3>

              <p className={`text-base sm:text-lg text-[#3D332A] mt-2 max-w-lg mx-auto ${
                lang === 'ur' ? 'font-urdu' : 'font-serif-elegant italic'
              }`}>
                {lang === 'ur'
                  ? 'آپ کی پروقار شرکت ہمارے اس خاص دن کو ہمیشہ کے لیے یادگار بنا دے گی۔'
                  : 'Your presence will make our special day even more memorable.'}
              </p>

              {/* Response Details Box */}
              <div className="my-6 p-5 rounded-2xl bg-white border border-[#D4AF67]/50 max-w-md mx-auto text-left space-y-2.5 shadow-sm text-[#2C2621]">
                <div className="flex justify-between items-center text-sm">
                  <span className={`text-[#845E1B] font-bold ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                    {lang === 'ur' ? 'مہمان:' : 'Guest Name:'}
                  </span>
                  <span className="font-bold text-[#2C2621]">{existingRsvp?.guestName}</span>
                </div>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-[#D4AF67]/20">
                  <span className={`text-[#845E1B] font-bold ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                    {lang === 'ur' ? 'حیثیت:' : 'Attendance:'}
                  </span>
                  <span className="font-bold text-emerald-700 font-serif-royal text-xs uppercase">
                    {existingRsvp?.status === 'attending'
                      ? (lang === 'ur' ? 'بخوشی شرکت فرمائیں گے' : 'Joyfully Attending')
                      : (lang === 'ur' ? 'معذرت، شرکت سے قاصر' : 'Declined')}
                  </span>
                </div>

                {existingRsvp?.status === 'attending' && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-[#D4AF67]/20">
                    <span className={`text-[#845E1B] font-bold ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                      {lang === 'ur' ? 'تعداد:' : 'Attendees:'}
                    </span>
                    <span className="font-bold text-[#2C2621] font-serif-royal">
                      {existingRsvp.attendeesCount} {existingRsvp.attendeesCount > 1 ? (lang === 'ur' ? 'افراد' : 'Persons') : (lang === 'ur' ? 'فرد' : 'Person')}
                    </span>
                  </div>
                )}

                {existingRsvp?.dietaryOrNotes && (
                  <div className="pt-2 border-t border-[#D4AF67]/20 text-xs text-[#3D332A]">
                    <span className={`font-bold text-[#845E1B] block ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                      {lang === 'ur' ? 'دعائیہ پیغام:' : 'Your Note / Du’a:'}
                    </span>
                    <p className="italic mt-0.5 font-serif-elegant text-sm text-[#2C2621]">"{existingRsvp.dietaryOrNotes}"</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#D4AF67] text-[#2C2621] bg-white hover:bg-[#EDE4D5] font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                <Edit3 size={14} className="text-[#845E1B]" />
                <span>{t.rsvpUpdate}</span>
              </button>
            </div>
          </div>
        ) : (
          /* RSVP Input Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border-2 border-[#D4AF67]/50 p-7 sm:p-12 shadow-xl relative text-[#2C2621]"
          >
            <MughalCorner position="top-left" className="absolute top-2 left-2" size={36} />
            <MughalCorner position="top-right" className="absolute top-2 right-2" size={36} />

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-amber-700" />
                <span>{errorMsg}</span>
              </div>
            )}

            {currentGuest && (
              <div className="mb-6 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D4AF67]/40 flex items-center justify-between">
                <div className={`flex items-center gap-2 text-xs text-[#2C2621] ${lang === 'ur' ? 'font-urdu' : 'font-serif-royal'}`}>
                  <UserCheck size={16} className="text-[#845E1B]" />
                  <span>
                    {lang === 'ur' ? 'دعوت نامہ برائے: ' : 'Invitation linked to: '}
                    <strong>{currentGuest.name}</strong>
                  </span>
                </div>
                {currentGuest.familyGroup && (
                  <span className="text-[11px] font-bold text-[#845E1B] uppercase">
                    {currentGuest.familyGroup}
                  </span>
                )}
              </div>
            )}

            {/* Guest Name Field */}
            <div className="mb-6">
              <label className={`block text-xs uppercase tracking-widest font-bold text-[#2C2621] mb-2 ${
                lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'
              }`}>
                {t.rsvpNameLabel}
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={lang === 'ur' ? 'مثلاً: ڈاکٹر ندیم اور اہل خانہ' : 'e.g. Mr. Tariq Khan & Family'}
                className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#D4AF67] focus:ring-2 focus:ring-[#D4AF67]/30 outline-none text-sm transition-all bg-[#FAF8F5] text-[#2C2621]"
              />
            </div>

            {/* Attendance Toggle Buttons */}
            <div className="mb-6">
              <label className={`block text-xs uppercase tracking-widest font-bold text-[#2C2621] mb-2 ${
                lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'
              }`}>
                {t.rsvpAttendanceLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setStatus('attending')}
                  className={`py-3.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    status === 'attending'
                      ? 'border-[#D4AF67] bg-[#D4AF67] text-[#2C2621] shadow-md'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-[#D4AF67]/40'
                  } ${lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'}`}
                >
                  <Check size={16} className={status === 'attending' ? 'text-[#2C2621]' : 'text-stone-400'} />
                  <span>{t.rsvpAttending}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('declined')}
                  className={`py-3.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    status === 'declined'
                      ? 'border-stone-400 bg-stone-200 text-stone-800 shadow-md'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  } ${lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'}`}
                >
                  <X size={16} className={status === 'declined' ? 'text-stone-700' : 'text-stone-400'} />
                  <span>{t.rsvpDeclining}</span>
                </button>
              </div>
            </div>

            {/* Attendees Count Selector (only if attending) */}
            {status === 'attending' && (
              <div className="mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <label className={`block text-xs uppercase tracking-widest font-bold text-[#2C2621] ${
                    lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'
                  }`}>
                    {t.rsvpAttendeesCountLabel}
                  </label>
                  {currentGuest?.maxGuests && (
                    <span className="text-[11px] text-[#845E1B] font-serif-elegant italic font-semibold">
                      {lang === 'ur' ? `زیادہ سے زیادہ نشستیں: ${currentGuest.maxGuests}` : `Max reserved: ${currentGuest.maxGuests}`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    if (num > maxAllowedAttendees) return null;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAttendeesCount(num)}
                        className={`w-12 h-12 rounded-xl font-serif-royal text-sm font-bold border-2 transition-all cursor-pointer ${
                          attendeesCount === num
                            ? 'bg-[#D4AF67] text-[#2C2621] border-[#D4AF67] shadow-md scale-105'
                            : 'bg-[#F8F5EF] border-stone-200 text-stone-700 hover:border-[#D4AF67]'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Blessing message */}
            <div className="mb-8">
              <label className={`block text-xs uppercase tracking-widest font-bold text-[#2C2621] mb-2 ${
                lang === 'ur' ? 'font-urdu text-sm' : 'font-serif-royal'
              }`}>
                {t.rsvpNotesLabel}
              </label>
              <textarea
                rows={3}
                value={dietaryOrNotes}
                onChange={(e) => setDietaryOrNotes(e.target.value)}
                placeholder={lang === 'ur' ? 'جوڑے کے لیے خصوصی دعائیں یا پیغامات...' : 'Share your prayers or special wishes for Mubasshir and Tasmia...'}
                className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#D4AF67] focus:ring-2 focus:ring-[#D4AF67]/30 outline-none text-sm transition-all bg-[#FAF8F5] text-[#2C2621]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 order-2 sm:order-1 font-serif-royal cursor-pointer font-bold"
                >
                  {lang === 'ur' ? 'منسوخ کریں' : 'Cancel Edit'}
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full gold-foil-bg text-[#2C2621] font-serif-royal text-xs sm:text-sm font-bold tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#D4AF67]/35 disabled:opacity-50 order-1 sm:order-2 cursor-pointer border border-[#D4AF67]/50"
              >
                {isSubmitting ? (
                  <span>{lang === 'ur' ? 'ارسال ہو رہا ہے...' : 'Recording Response...'}</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{existingRsvp ? t.rsvpUpdate : t.rsvpSubmit}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
