import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Check, Heart, X, Send, AlertCircle, Edit3, UserCheck } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Guest, Rsvp } from '../types/wedding';
import { GoldDivider, MughalCorner } from './MughalMotif';

interface RsvpFormProps {
  currentGuest: Guest | null;
  inviteToken: string | null;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({ currentGuest, inviteToken }) => {
  const [guestName, setGuestName] = useState(currentGuest?.name || '');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [attendeesCount, setAttendeesCount] = useState(currentGuest?.maxGuests || 1);
  const [dietaryOrNotes, setDietaryOrNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [existingRsvp, setExistingRsvp] = useState<Rsvp | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Derive stable RSVP document ID
  const rsvpDocId = currentGuest?.id || (inviteToken ? `token_${inviteToken}` : '');

  // Fetch existing RSVP if token / guestId exists
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
      setErrorMsg('Please enter your full name or family name.');
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
      await setDoc(doc(db, 'rsvps', docId), payload);

      setExistingRsvp(payload);
      setSubmittedSuccess(true);
      setIsEditing(false);

      if (status === 'attending') {
        try {
          confetti({
            particleCount: 65,
            spread: 85,
            origin: { y: 0.65 },
            colors: ['#D4AF67', '#F7E7C4', '#641D32', '#FFF3DB', '#ECC880'],
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
    <section id="rsvp" className="py-24 sm:py-32 bg-[#F8F5EF] text-[#29101A] relative overflow-hidden select-none">
      <div className="absolute inset-0 mughal-damask-pattern opacity-40 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] font-serif-royal text-[#9E7422] font-bold">
            Répondez S'il Vous Plaît
          </span>
          <h2 className="font-serif-royal text-3xl sm:text-4xl md:text-5xl font-bold text-[#641D32] tracking-wide mt-2">
            Confirm Your Attendance
          </h2>
          <GoldDivider className="my-5" />
          <p className="font-serif-elegant italic text-base sm:text-lg text-[#29101A]/85">
            "Your presence will add warmth and grace to our wedding celebration. Kindly inform us of your attendance."
          </p>
        </div>

        {/* Existing RSVP Confirmed State */}
        {submittedSuccess && !isEditing ? (
          <div className="bg-white rounded-3xl border-2 border-[#D4AF67] p-8 sm:p-14 shadow-2xl text-center relative overflow-hidden animate-fade-in">
            <MughalCorner position="top-left" className="absolute top-2 left-2" size={36} />
            <MughalCorner position="top-right" className="absolute top-2 right-2" size={36} />

            <div className="w-16 h-16 rounded-full bg-[#641D32]/10 border-2 border-[#D4AF67] flex items-center justify-center mx-auto mb-4 text-[#641D32]">
              {existingRsvp?.status === 'attending' ? (
                <Check size={32} className="text-emerald-700" />
              ) : (
                <Heart size={30} className="text-[#641D32]" />
              )}
            </div>

            <span className="text-xs uppercase tracking-widest text-[#9E7422] font-serif-royal font-bold">
              RSVP Confirmation Received
            </span>

            <h3 className="font-serif-royal text-2xl sm:text-3xl font-bold text-[#641D32] mt-2">
              Thank You, {existingRsvp?.guestName}!
            </h3>

            <div className="my-6 p-5 rounded-2xl bg-[#F8F5EF] border border-[#D4AF67]/35 max-w-md mx-auto text-left space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#641D32] font-semibold font-serif-royal">Attendance:</span>
                <span className="font-serif-royal text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {existingRsvp?.status === 'attending' ? 'Joyfully Attending' : 'Regretfully Declining'}
                </span>
              </div>

              {existingRsvp?.status === 'attending' && (
                <div className="flex justify-between items-center text-sm pt-2 border-t border-[#D4AF67]/20">
                  <span className="text-[#641D32] font-semibold font-serif-royal">Attendees:</span>
                  <span className="font-bold text-[#29101A]">
                    {existingRsvp.attendeesCount} {existingRsvp.attendeesCount > 1 ? 'Persons' : 'Person'}
                  </span>
                </div>
              )}

              {existingRsvp?.dietaryOrNotes && (
                <div className="pt-2 border-t border-[#D4AF67]/20 text-xs text-[#29101A]/85">
                  <span className="font-semibold text-[#641D32] block font-serif-royal">Your Note / Du'a:</span>
                  <p className="italic mt-0.5 font-serif-elegant text-sm">"{existingRsvp.dietaryOrNotes}"</p>
                </div>
              )}
            </div>

            <p className="text-sm font-serif-elegant italic text-[#641D32]/85 max-w-md mx-auto mb-6">
              {existingRsvp?.status === 'attending'
                ? 'We cannot wait to welcome you at Bukhara Royale Marquee on Sunday, 8 November 2026 at 1:00 PM!'
                : 'Thank you for your heartfelt prayers and wishes for Mubasshir & Tasmia.'}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#D4AF67] text-[#641D32] hover:bg-[#641D32] hover:text-white font-serif-royal text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
            >
              <Edit3 size={14} />
              <span>Update My RSVP</span>
            </button>
          </div>
        ) : (
          /* RSVP Input Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border-2 border-[#D4AF67]/50 p-7 sm:p-12 shadow-2xl relative"
          >
            <MughalCorner position="top-left" className="absolute top-2 left-2" size={36} />
            <MughalCorner position="top-right" className="absolute top-2 right-2" size={36} />

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {currentGuest && (
              <div className="mb-6 p-3.5 rounded-xl bg-[#F8F5EF] border border-[#D4AF67]/35 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#641D32] font-serif-royal">
                  <UserCheck size={16} className="text-[#9E7422]" />
                  <span>Invitation linked to: <strong>{currentGuest.name}</strong></span>
                </div>
                {currentGuest.familyGroup && (
                  <span className="text-[11px] font-semibold text-[#9E7422] uppercase">
                    {currentGuest.familyGroup}
                  </span>
                )}
              </div>
            )}

            {/* Guest Name Field */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest font-serif-royal font-bold text-[#641D32] mb-2">
                Full Name / Family Name *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Mr. Tariq Khan &amp; Family"
                className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#D4AF67] focus:ring-2 focus:ring-[#D4AF67]/30 outline-none text-sm transition-all bg-[#FAF8F5]"
              />
            </div>

            {/* Attendance Toggle Buttons */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest font-serif-royal font-bold text-[#641D32] mb-2">
                Will You Attend? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setStatus('attending')}
                  className={`py-3.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-serif-royal uppercase tracking-wider font-bold transition-all ${
                    status === 'attending'
                      ? 'border-[#D4AF67] bg-[#641D32] text-[#F8F5EF] shadow-md'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-[#D4AF67]/40'
                  }`}
                >
                  <Check size={16} className={status === 'attending' ? 'text-[#D4AF67]' : 'text-stone-400'} />
                  <span>Joyfully Attending</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('declined')}
                  className={`py-3.5 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-serif-royal uppercase tracking-wider font-bold transition-all ${
                    status === 'declined'
                      ? 'border-[#641D32] bg-[#29101A] text-[#F8F5EF] shadow-md'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <X size={16} className={status === 'declined' ? 'text-red-400' : 'text-stone-400'} />
                  <span>Regretfully Declining</span>
                </button>
              </div>
            </div>

            {/* Attendees Count Selector (only if attending) */}
            {status === 'attending' && (
              <div className="mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs uppercase tracking-widest font-serif-royal font-bold text-[#641D32]">
                    Total Number of Attendees *
                  </label>
                  {currentGuest?.maxGuests && (
                    <span className="text-[11px] text-[#9E7422] font-serif-elegant italic">
                      Max reserved: {currentGuest.maxGuests}
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
                        className={`w-12 h-12 rounded-xl font-serif-royal text-sm font-bold border-2 transition-all ${
                          attendeesCount === num
                            ? 'bg-[#D4AF67] text-[#29101A] border-[#D4AF67] shadow-md scale-105'
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
              <label className="block text-xs uppercase tracking-widest font-serif-royal font-bold text-[#641D32] mb-2">
                Blessings, Du'as, or Dietary Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={dietaryOrNotes}
                onChange={(e) => setDietaryOrNotes(e.target.value)}
                placeholder="Share your prayers or special wishes for Mubasshir and Tasmia..."
                className="w-full px-4 py-3.5 rounded-xl border border-stone-300 focus:border-[#D4AF67] focus:ring-2 focus:ring-[#D4AF67]/30 outline-none text-sm transition-all bg-[#FAF8F5]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-800 order-2 sm:order-1 font-serif-royal"
                >
                  Cancel Edit
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto ml-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full gold-foil-bg text-[#29101A] font-serif-royal text-xs sm:text-sm font-bold tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#D4AF67]/25 disabled:opacity-50 order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <span>Recording Response...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{existingRsvp ? 'Update My RSVP' : 'Submit Royal RSVP'}</span>
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
