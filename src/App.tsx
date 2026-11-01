import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Guest, WeddingSetting } from './types/wedding';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PersonalizedBanner } from './components/PersonalizedBanner';
import { OurStory } from './components/OurStory';
import { EventDetails } from './components/EventDetails';
import { Countdown } from './components/Countdown';
import { RsvpForm } from './components/RsvpForm';
import { VenueSection } from './components/VenueSection';
import { FaqSection } from './components/FaqSection';
import { MemoriesGallery } from './components/MemoriesGallery';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMemoriesActive, setIsMemoriesActive] = useState(false);

  // Parse invitation token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite') || params.get('token');
    if (token) {
      setInviteToken(token);

      // Fetch guest record matching this token
      const fetchGuest = async () => {
        try {
          const q = query(collection(db, 'guests'), where('invitationToken', '==', token));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const docData = snap.docs[0];
            setCurrentGuest({ id: docData.id, ...(docData.data() as Omit<Guest, 'id'>) });
          }
        } catch (err) {
          console.warn('Could not fetch guest with token', err);
        }
      };

      fetchGuest();
    }
  }, []);

  // Listen to wedding settings (memories gallery activation)
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        doc(db, 'settings', 'main_settings'),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as WeddingSetting;
            setIsMemoriesActive(!!data.memoriesActivated);
          }
        },
        (err) => {
          console.warn('Settings listener error', err);
        }
      );
      return () => unsub();
    } catch {
      // Fallback
    }
  }, []);

  const handleToggleMemories = async (active: boolean) => {
    setIsMemoriesActive(active);
    try {
      await setDoc(
        doc(db, 'settings', 'main_settings'),
        {
          id: 'main_settings',
          memoriesActivated: active,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Failed to persist memories setting', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#29101A] font-sans selection:bg-[#D4AF67]/30 selection:text-[#641D32] relative overflow-x-hidden">
      {/* Cinematic Animated Royal Introduction Overlay */}
      {showIntro && (
        <CinematicIntro
          onComplete={() => setShowIntro(false)}
          guestName={currentGuest?.name}
        />
      )}

      {/* Royal Header Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        guestName={currentGuest?.name}
        isMemoriesActive={isMemoriesActive}
      />

      {/* Main Content */}
      <main>
        {/* Section 1: Hero & Royal Announcement */}
        <Hero
          guestName={currentGuest?.name}
          familyGroup={currentGuest?.familyGroup}
        />

        {/* Section 2: Personalized Guest Greeting & WhatsApp Sharing Banner */}
        <PersonalizedBanner
          currentGuest={currentGuest}
          inviteToken={inviteToken}
        />

        {/* Section 3: Our Story & Journey */}
        <OurStory />

        {/* Section 4: Baraat Event Details, Calendar Sync & Schedule */}
        <EventDetails />

        {/* Section 5: Real-Time Asia/Karachi Countdown */}
        <Countdown />

        {/* Section 6: RSVP Attendance Confirmation */}
        <RsvpForm
          currentGuest={currentGuest}
          inviteToken={inviteToken}
        />

        {/* Section 7: Venue & Travel Guide (Bukhara Royale Marquee) */}
        <VenueSection />

        {/* Section 8: FAQ & Guest Etiquette */}
        <FaqSection />

        {/* Section 9: Wedding Memories & Guest Prayers Wall */}
        <MemoriesGallery
          isMemoriesActive={isMemoriesActive}
          guestName={currentGuest?.name}
        />
      </main>

      {/* Royal Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Private Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isMemoriesActive={isMemoriesActive}
        onToggleMemories={handleToggleMemories}
      />
    </div>
  );
}
