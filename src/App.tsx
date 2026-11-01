import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Guest, WebsiteSetting } from './types/wedding';
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

  // Parse invitation token from URL on mount & query tokenized document
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite') || params.get('token');
    if (token) {
      setInviteToken(token);

      // Secure single-document fetch on 'invitations/{token}' to protect guest privacy
      const fetchInvitation = async () => {
        try {
          const invRef = doc(db, 'invitations', token);
          const snap = await getDoc(invRef);
          if (snap.exists()) {
            const data = snap.data();
            setCurrentGuest({
              id: data.guestId || token,
              name: data.guestName,
              familyGroup: data.familyGroup,
              invitationToken: token,
              maxGuests: data.maxGuests || 2,
              createdAt: data.createdAt || new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('Could not fetch tokenized invitation document', err);
        }
      };

      fetchInvitation();
    }
  }, []);

  // Listen to website settings from 'websiteSettings/main_config'
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        doc(db, 'websiteSettings', 'main_config'),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as WebsiteSetting;
            setIsMemoriesActive(!!data.memoriesActivated);
          }
        },
        (err) => {
          console.warn('Settings listener note:', err);
        }
      );
      return () => unsub();
    } catch {}
  }, []);

  const handleToggleMemories = async (active: boolean) => {
    setIsMemoriesActive(active);
    try {
      await setDoc(
        doc(db, 'websiteSettings', 'main_config'),
        {
          id: 'main_config',
          eventTitle: 'Mubasshir & Tasmia Mehfooz — Grand Walima',
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

        {/* Section 4: Walima Event Details, Calendar Sync & Schedule */}
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

        {/* Section 9: Walima Memories & Guest Prayers Wall */}
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
