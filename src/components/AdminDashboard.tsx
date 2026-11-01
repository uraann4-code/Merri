import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  LogOut,
  Image as ImageIcon,
  MessageCircle,
  Search,
  KeyRound,
  Shield,
  Calendar,
  Settings,
  Film,
} from 'lucide-react';
import { db, auth, loginWithGoogle, logoutUser, ADMIN_EMAIL } from '../lib/firebase';
import { Guest, Rsvp, WeddingEvent, GalleryItem, WebsiteSetting, Invitation } from '../types/wedding';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isMemoriesActive: boolean;
  onToggleMemories: (active: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  isMemoriesActive,
  onToggleMemories,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'rsvps' | 'event' | 'gallery' | 'settings'>('overview');

  // Firestore Collections data states
  const [guests, setGuests] = useState<Guest[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [eventData, setEventData] = useState<WeddingEvent | null>(null);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<WebsiteSetting | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add guest form state
  const [newGuestName, setNewGuestName] = useState('');
  const [newFamilyGroup, setNewFamilyGroup] = useState('');
  const [newMaxGuests, setNewMaxGuests] = useState(2);
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  // Edit Event state
  const [editEventTitle, setEditEventTitle] = useState('Grand Walima Reception');
  const [editEventDate, setEditEventDate] = useState('Sunday, 8 November 2026');
  const [editEventTime, setEditEventTime] = useState('1:00 PM PKT');
  const [editEventVenue, setEditEventVenue] = useState('Bukhara Royale Marquee');
  const [editEventAddress, setEditEventAddress] = useState('Main Expressway, Islamabad, near Gulberg, Pakistan');
  const [eventSavedMsg, setEventSavedMsg] = useState(false);

  // Add Gallery item state
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('Portraits');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [isAddingMedia, setIsAddingMedia] = useState(false);

  // Check auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && (user.email === ADMIN_EMAIL || user.email?.includes('mubasshir'))) {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync all Firestore collections when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Guests collection
    const unsubGuests = onSnapshot(collection(db, 'guests'), (snap) => {
      const list: Guest[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Guest, 'id'>) }));
      setGuests(list);
    });

    // 2. Invitations collection
    const unsubInvitations = onSnapshot(collection(db, 'invitations'), (snap) => {
      const list: Invitation[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Invitation, 'id'>) }));
      setInvitations(list);
    });

    // 3. RSVPs collection
    const unsubRsvps = onSnapshot(collection(db, 'rsvps'), (snap) => {
      const list: Rsvp[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Rsvp, 'id'>) }));
      setRsvps(list);
    });

    // 4. Events collection
    const unsubEvent = onSnapshot(doc(db, 'events', 'main_event'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as WeddingEvent;
        setEventData(data);
        setEditEventTitle(data.title || 'Grand Walima Reception');
        setEditEventDate(data.date || 'Sunday, 8 November 2026');
        setEditEventTime(data.time || '1:00 PM PKT');
        setEditEventVenue(data.venue || 'Bukhara Royale Marquee');
        setEditEventAddress(data.address || 'Main Expressway, Islamabad, near Gulberg, Pakistan');
      }
    });

    // 5. Gallery collection
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      const list: GalleryItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }));
      setGalleryList(list);
    });

    // 6. WebsiteSettings collection
    const unsubSettings = onSnapshot(doc(db, 'websiteSettings', 'main_config'), (snap) => {
      if (snap.exists()) {
        setSiteConfig(snap.data() as WebsiteSetting);
      }
    });

    return () => {
      unsubGuests();
      unsubInvitations();
      unsubRsvps();
      unsubEvent();
      unsubGallery();
      unsubSettings();
    };
  }, [isAuthenticated]);

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const validCodes = ['Bukhara2026', 'Mubasshir2026', 'Tasmia2026', 'Walima2026', 'Admin786'];
    if (validCodes.includes(passcode.trim())) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid passcode. Please enter the authorized wedding passcode or sign in with Google.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError('');
      await loginWithGoogle();
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed');
    }
  };

  // Add Guest & create linked tokenized Invitation document in 'invitations' collection
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    // Generate secure unpredictable random token
    const token = `walima_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
    const guestDocId = `g_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const guestPayload: Guest = {
      id: guestDocId,
      name: newGuestName.trim(),
      familyGroup: newFamilyGroup.trim() || 'General Invite',
      maxGuests: Number(newMaxGuests) || 1,
      phone: newPhone.trim(),
      notes: newNotes.trim(),
      invitationToken: token,
      createdAt: new Date().toISOString(),
    };

    // Linked token document for guest self-access without exposing other guest records
    const invitationPayload: Invitation = {
      id: token,
      guestId: guestDocId,
      guestName: newGuestName.trim(),
      familyGroup: newFamilyGroup.trim() || 'General Invite',
      token: token,
      maxGuests: Number(newMaxGuests) || 1,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Write to 'guests' collection
      await setDoc(doc(db, 'guests', guestDocId), guestPayload);
      // 2. Write to 'invitations' collection keyed by the token
      await setDoc(doc(db, 'invitations', token), invitationPayload);

      setNewGuestName('');
      setNewFamilyGroup('');
      setNewMaxGuests(2);
      setNewPhone('');
      setNewNotes('');
      setIsAddingGuest(false);
    } catch (err) {
      console.error('Failed to add guest to Firestore', err);
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (confirm(`Are you sure you want to delete invitation for ${guest.name}?`)) {
      try {
        await deleteDoc(doc(db, 'guests', guest.id));
        if (guest.invitationToken) {
          await deleteDoc(doc(db, 'invitations', guest.invitationToken));
        }
      } catch (err) {
        console.error('Failed to delete guest', err);
      }
    }
  };

  // Save Event Details into 'events/main_event'
  const handleSaveEventDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: WeddingEvent = {
        id: 'main_event',
        title: editEventTitle,
        eventType: 'Walima',
        date: editEventDate,
        time: editEventTime,
        timezone: 'Asia/Karachi',
        venue: editEventVenue,
        address: editEventAddress,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'events', 'main_event'), payload);
      setEventSavedMsg(true);
      setTimeout(() => setEventSavedMsg(false), 3500);
    } catch (err) {
      console.error('Failed to save event to Firestore', err);
    }
  };

  // Add item to 'gallery' collection
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle.trim()) return;

    const id = `media_${Date.now()}`;
    const payload: GalleryItem = {
      id,
      title: newGalleryTitle.trim(),
      category: newGalleryCategory,
      mediaUrl: newGalleryUrl.trim() || '',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'gallery', id), payload);
      setNewGalleryTitle('');
      setNewGalleryUrl('');
      setIsAddingMedia(false);
    } catch (err) {
      console.error('Failed to add media to gallery', err);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      console.error('Failed to delete gallery item', err);
    }
  };

  const getGuestInvitationUrl = (token: string) => {
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?invite=${token}`;
  };

  const handleCopyLink = (token: string, id: string) => {
    const url = getGuestInvitationUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsAppInvite = (guest: Guest) => {
    const url = getGuestInvitationUrl(guest.invitationToken);
    const message = `✨ *Grand Walima Invitation: Mubasshir & Tasmia Mehfooz* ✨\n\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\n\nDear *${guest.name}*,\n\nTogether with our families, we request the honour of your presence and prayers at the Grand Walima ceremony.\n\n📅 *Date:* Sunday, 8 November 2026\n🕐 *Time:* 1:00 PM PKT\n📍 *Venue:* Bukhara Royale Marquee, Main Expressway, Islamabad (near Gulberg)\n\nWe have reserved ${guest.maxGuests} seats for you. Please view your royal invitation and confirm your RSVP at:\n${url}`;

    const waUrl = guest.phone
      ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(guest.phone)}&text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'Guest Name',
      'Family Group',
      'Max Guests Reserved',
      'RSVP Status',
      'Attendees Count',
      'Phone',
      'Invitation Link',
      'Notes / Diet',
    ];

    const rows = guests.map((g) => {
      const matchedRsvp = rsvps.find((r) => r.guestId === g.id || r.invitationToken === g.invitationToken);
      const status = matchedRsvp?.status || 'Pending';
      const attendees = matchedRsvp?.status === 'attending' ? matchedRsvp.attendeesCount : 0;
      const notes = (matchedRsvp?.dietaryOrNotes || g.notes || '').replace(/,/g, ';');
      const link = getGuestInvitationUrl(g.invitationToken);

      return [
        `"${g.name.replace(/"/g, '""')}"`,
        `"${(g.familyGroup || '').replace(/"/g, '""')}"`,
        g.maxGuests,
        `"${status}"`,
        attendees,
        `"${g.phone || ''}"`,
        `"${link}"`,
        `"${notes.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mubasshir_Tasmia_Walima_Guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Seed sample initial guests in Firestore
  const handleSeedSampleGuests = async () => {
    const sampleList = [
      {
        name: 'Uncle Tariq & Family',
        familyGroup: 'Qayyum Family',
        maxGuests: 4,
        phone: '+92 300 1234567',
        notes: 'VIP Family Table',
      },
      {
        name: 'Dr. Nadeem Mehfooz & Family',
        familyGroup: 'Mehfooz Family',
        maxGuests: 5,
        phone: '+92 333 9876543',
        notes: 'Bride Family Dignitaries',
      },
      {
        name: 'Hamza Malik',
        familyGroup: 'Groom Friends',
        maxGuests: 2,
        phone: '+92 321 5556677',
        notes: 'Groomsman',
      },
    ];

    for (const item of sampleList) {
      const token = `walima_${Math.random().toString(36).substring(2, 9)}`;
      const docId = `g_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      await setDoc(doc(db, 'guests', docId), {
        ...item,
        invitationToken: token,
        createdAt: new Date().toISOString(),
      });
      await setDoc(doc(db, 'invitations', token), {
        id: token,
        guestId: docId,
        guestName: item.name,
        familyGroup: item.familyGroup,
        token: token,
        maxGuests: item.maxGuests,
        createdAt: new Date().toISOString(),
      });
    }
  };

  // Stats
  const totalGuestsCount = guests.length;
  const totalReservedSeats = guests.reduce((sum, g) => sum + (g.maxGuests || 1), 0);
  const attendingRsvps = rsvps.filter((r) => r.status === 'attending');
  const totalAttendingHeadcount = attendingRsvps.reduce((sum, r) => sum + (r.attendeesCount || 1), 0);
  const declinedRsvpsCount = rsvps.filter((r) => r.status === 'declined').length;
  const pendingCount = Math.max(0, totalGuestsCount - (attendingRsvps.length + declinedRsvpsCount));

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.familyGroup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone?.includes(searchQuery)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-md overflow-y-auto select-none">
      <div className="w-full max-w-5xl bg-[#FAF7F2] border-2 border-[#D4AF67] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#2C2621]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#EDE4D5] border-b border-[#D4AF67]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#D4AF67] flex items-center justify-center text-[#845E1B] bg-white shadow-xs">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="font-serif-royal text-base sm:text-lg font-bold text-[#2C2621] tracking-wide">
                Royal Wedding Administrator
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-[#845E1B] uppercase tracking-widest font-serif-royal font-bold">
                <span>Mubasshir &amp; Tasmia</span>
                <span aria-hidden="true">·</span>
                <span>Grand Walima Portal</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  logoutUser();
                  setIsAuthenticated(false);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-red-400 text-red-700 bg-red-50 hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                title="Log Out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 hover:text-[#2C2621] hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-18 h-18 rounded-full border-2 border-[#D4AF67] bg-[#EDE4D5] text-[#845E1B] flex items-center justify-center mb-4 shadow-md">
              <Lock size={30} />
            </div>

            <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#2C2621] mb-1">
              Admin Access Required
            </h3>
            <p className="text-xs text-[#5C4D3C] mb-6 font-sans">
              Sign in with your verified administrator credentials or enter the master passcode.
            </p>

            {authError && (
              <div className="w-full mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-serif-royal">
                {authError}
              </div>
            )}

            <form onSubmit={handlePasscodeLogin} className="w-full space-y-3 mb-6">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Wedding Passcode..."
                className="w-full px-4 py-3.5 rounded-xl border border-[#D4AF67]/60 bg-white text-[#2C2621] placeholder:text-stone-400 text-sm focus:border-[#845E1B] outline-none text-center tracking-widest font-mono shadow-xs"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-widest hover:brightness-105 transition-all shadow-md cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </form>

            <div className="w-full flex items-center gap-3 my-2 text-xs text-stone-400">
              <div className="flex-1 h-[1px] bg-stone-300" />
              <span>OR</span>
              <div className="flex-1 h-[1px] bg-stone-300" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full py-3.5 px-4 rounded-xl border border-[#D4AF67]/50 bg-white hover:bg-[#EDE4D5] text-[#2C2621] font-serif-royal text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer shadow-xs"
            >
              <KeyRound size={16} className="text-[#845E1B]" />
              <span>Sign in with Google Account</span>
            </button>

            <p className="mt-4 text-[11px] text-[#845E1B] font-serif-royal">
              Authorized admin: {ADMIN_EMAIL}
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2.5 bg-[#F8F5EF] border-b border-[#D4AF67]/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { key: 'overview', label: 'Overview & Stats' },
                  { key: 'guests', label: `Guests (${guests.length})` },
                  { key: 'rsvps', label: `RSVPs (${rsvps.length})` },
                  { key: 'event', label: 'Walima Event Info' },
                  { key: 'gallery', label: `Gallery (${galleryList.length})` },
                  { key: 'settings', label: 'Website Settings' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-serif-royal font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.key
                        ? 'bg-[#D4AF67] text-[#2C2621] border border-[#845E1B]/30 shadow-xs'
                        : 'text-stone-600 hover:text-[#2C2621] hover:bg-[#EDE4D5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportCsv}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow cursor-pointer font-serif-royal"
                title="Export complete guest and RSVP attendance to CSV"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white border-2 border-[#D4AF67]/40 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between text-xs text-[#845E1B] uppercase font-bold tracking-wider font-serif-royal">
                        <span>Total Guests</span>
                        <Users size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-[#2C2621] mt-2">
                        {totalGuestsCount}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1 font-sans">
                        Reserved seats: {totalReservedSeats}
                      </div>
                    </div>

                    <div className="bg-white border-2 border-emerald-500/40 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between text-xs text-emerald-700 uppercase font-bold tracking-wider font-serif-royal">
                        <span>Attending (Headcount)</span>
                        <CheckCircle size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-emerald-800 mt-2">
                        {totalAttendingHeadcount}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1 font-sans">
                        From {attendingRsvps.length} confirmations
                      </div>
                    </div>

                    <div className="bg-white border-2 border-stone-300 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between text-xs text-stone-600 uppercase font-bold tracking-wider font-serif-royal">
                        <span>Declined</span>
                        <XCircle size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-stone-700 mt-2">
                        {declinedRsvpsCount}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1 font-sans">
                        Unable to attend
                      </div>
                    </div>

                    <div className="bg-white border-2 border-amber-400/50 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between text-xs text-amber-700 uppercase font-bold tracking-wider font-serif-royal">
                        <span>Pending</span>
                        <Clock size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-amber-800 mt-2">
                        {pendingCount}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1 font-sans">
                        Awaiting response
                      </div>
                    </div>
                  </div>

                  {guests.length === 0 && (
                    <div className="p-6 rounded-2xl border-2 border-[#D4AF67]/50 bg-[#EDE4D5] text-center shadow-xs">
                      <Sparkles size={24} className="text-[#845E1B] mx-auto mb-2" />
                      <h4 className="font-serif-royal text-base font-bold text-[#2C2621]">
                        Guest Database is Ready
                      </h4>
                      <p className="text-xs text-[#5C4D3C] max-w-md mx-auto mt-1 mb-4 font-sans">
                        Add individual guests or preload initial sample families to test personalized links and WhatsApp invitations.
                      </p>
                      <button
                        onClick={handleSeedSampleGuests}
                        className="px-6 py-2 rounded-full gold-foil-bg text-[#2C2621] text-xs font-serif-royal font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-xs"
                      >
                        Seed Initial Guests
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border-2 border-[#D4AF67]/30 rounded-2xl p-6 shadow-xs">
                      <h4 className="font-serif-royal text-sm font-bold text-[#845E1B] uppercase tracking-wider mb-2">
                        Walima Event Live Data (events/main_event)
                      </h4>
                      <ul className="text-xs space-y-2 text-[#2C2621]/90 font-sans">
                        <li><strong>Event:</strong> {eventData?.title || 'Grand Walima Reception'}</li>
                        <li><strong>Date:</strong> {eventData?.date || 'Sunday, 8 November 2026'}</li>
                        <li><strong>Time:</strong> {eventData?.time || '1:00 PM PKT'}</li>
                        <li><strong>Venue:</strong> {eventData?.venue || 'Bukhara Royale Marquee, Islamabad'}</li>
                        <li><strong>Address:</strong> {eventData?.address || 'Main Expressway, Islamabad'}</li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-[#D4AF67]/30 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
                      <div>
                        <h4 className="font-serif-royal text-sm font-bold text-[#845E1B] uppercase tracking-wider mb-2">
                          Memories Gallery Status (websiteSettings/main_config)
                        </h4>
                        <p className="text-xs text-[#5C4D3C] font-sans">
                          {isMemoriesActive
                            ? 'Memories Gallery is LIVE. Guests can view the wedding video highlight and photo album.'
                            : 'Memories Gallery is LOCKED (Pre-Wedding Mode). Turn on after the Walima ceremony to reveal official wedding photographs.'}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#D4AF67]/20 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#2C2621] font-serif-royal">Activation:</span>
                        <button
                          onClick={() => onToggleMemories(!isMemoriesActive)}
                          className={`px-5 py-2 rounded-full text-xs font-serif-royal font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isMemoriesActive
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
                          }`}
                        >
                          {isMemoriesActive ? 'Active (Live)' : 'Locked (Pre-Wedding)'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GUEST LIST MANAGEMENT */}
              {activeTab === 'guests' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search guests, family, phone..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] placeholder:text-stone-400 focus:border-[#845E1B] outline-none shadow-xs"
                      />
                    </div>

                    <button
                      onClick={() => setIsAddingGuest(!isAddingGuest)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>Add New Guest</span>
                    </button>
                  </div>

                  {isAddingGuest && (
                    <form onSubmit={handleAddGuest} className="p-6 rounded-2xl border-2 border-[#D4AF67] bg-[#FAF7F2] space-y-4 animate-fade-in shadow-sm">
                      <h4 className="font-serif-royal text-base font-bold text-[#2C2621] flex items-center gap-2">
                        <Plus size={16} className="text-[#845E1B]" />
                        <span>Add Guest or Family Group (Auto-Generates Secure Token)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#845E1B] font-serif-royal font-bold uppercase mb-1">
                            Guest / Family Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={newGuestName}
                            onChange={(e) => setNewGuestName(e.target.value)}
                            placeholder="e.g. Mr. &amp; Mrs. Tariq"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#845E1B] font-serif-royal font-bold uppercase mb-1">
                            Family Group
                          </label>
                          <input
                            type="text"
                            value={newFamilyGroup}
                            onChange={(e) => setNewFamilyGroup(e.target.value)}
                            placeholder="e.g. Qayyum Relatives"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#845E1B] font-serif-royal font-bold uppercase mb-1">
                            Max Seats Reserved
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={newMaxGuests}
                            onChange={(e) => setNewMaxGuests(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#845E1B] font-serif-royal font-bold uppercase mb-1">
                            WhatsApp / Phone
                          </label>
                          <input
                            type="text"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="+92 300 1234567"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingGuest(false)}
                          className="px-4 py-2 rounded-lg text-xs text-stone-500 hover:text-[#2C2621] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-xs"
                        >
                          Save &amp; Generate Walima Invite Link
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Guests Table */}
                  <div className="border border-[#D4AF67]/30 rounded-2xl overflow-x-auto bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-[#2C2621]">
                      <thead className="bg-[#FAF7F2] text-[#845E1B] uppercase font-serif-royal text-[10px] tracking-wider border-b border-[#D4AF67]/20">
                        <tr>
                          <th className="p-4">Guest / Family</th>
                          <th className="p-4">Group</th>
                          <th className="p-4">Seats</th>
                          <th className="p-4">RSVP Status</th>
                          <th className="p-4">Invitation Link &amp; WhatsApp</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredGuests.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-stone-500">
                              No guests found. Click "Add New Guest" or seed sample guests.
                            </td>
                          </tr>
                        ) : (
                          filteredGuests.map((g) => {
                            const matchedRsvp = rsvps.find(
                              (r) => r.guestId === g.id || r.invitationToken === g.invitationToken
                            );
                            const isAttending = matchedRsvp?.status === 'attending';
                            const isDeclined = matchedRsvp?.status === 'declined';

                            return (
                              <tr key={g.id} className="hover:bg-[#FAF7F2] transition-colors">
                                <td className="p-4 font-semibold text-[#2C2621]">
                                  {g.name}
                                  {g.phone && (
                                    <span className="block text-[10px] text-stone-500 font-mono mt-0.5">
                                      {g.phone}
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-[#5C4D3C]">{g.familyGroup || '—'}</td>
                                <td className="p-4 font-serif-royal font-medium">{g.maxGuests} seats</td>
                                <td className="p-4">
                                  {isAttending ? (
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase font-serif-royal">
                                      Attending ({matchedRsvp.attendeesCount})
                                    </span>
                                  ) : isDeclined ? (
                                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold uppercase font-serif-royal">
                                      Declined
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase font-serif-royal">
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCopyLink(g.invitationToken, g.id)}
                                      className="px-3 py-1.5 rounded-lg border border-[#D4AF67]/60 text-[#845E1B] hover:bg-[#D4AF67] hover:text-[#2C2621] text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer font-serif-royal"
                                      title="Copy unique personalized invitation URL"
                                    >
                                      {copiedId === g.id ? <Check size={12} /> : <Copy size={12} />}
                                      <span>{copiedId === g.id ? 'Copied' : 'Copy Link'}</span>
                                    </button>

                                    <button
                                      onClick={() => handleSendWhatsAppInvite(g)}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer font-serif-royal"
                                      title="Open WhatsApp with pre-composed Walima invite"
                                    >
                                      <MessageCircle size={12} />
                                      <span>WhatsApp</span>
                                    </button>
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDeleteGuest(g)}
                                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Delete guest"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: RSVPS MANAGEMENT */}
              {activeTab === 'rsvps' && (
                <div className="space-y-4">
                  <div className="border border-[#D4AF67]/30 rounded-2xl overflow-x-auto bg-white shadow-xs">
                    <table className="w-full text-left text-xs text-[#2C2621]">
                      <thead className="bg-[#FAF7F2] text-[#845E1B] uppercase font-serif-royal text-[10px] tracking-wider border-b border-[#D4AF67]/20">
                        <tr>
                          <th className="p-4">Guest Name</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Attendees</th>
                          <th className="p-4">Note / Du'a</th>
                          <th className="p-4">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {rsvps.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-stone-500">
                              No RSVP responses submitted yet.
                            </td>
                          </tr>
                        ) : (
                          rsvps.map((r) => (
                            <tr key={r.id} className="hover:bg-[#FAF7F2] transition-colors">
                              <td className="p-4 font-semibold text-[#2C2621]">{r.guestName}</td>
                              <td className="p-4">
                                {r.status === 'attending' ? (
                                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase font-serif-royal">
                                    Joyfully Attending
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold uppercase font-serif-royal">
                                    Declined
                                  </span>
                                )}
                              </td>
                              <td className="p-4 font-bold text-[#2C2621] font-serif-royal">
                                {r.status === 'attending' ? `${r.attendeesCount} Persons` : '0'}
                              </td>
                              <td className="p-4 text-[#5C4D3C] italic max-w-xs truncate">
                                {r.dietaryOrNotes || '—'}
                              </td>
                              <td className="p-4 text-[10px] text-stone-500 font-mono">
                                {new Date(r.updatedAt || r.submittedAt).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: EVENT MANAGEMENT (events collection) */}
              {activeTab === 'event' && (
                <div className="max-w-2xl bg-white border-2 border-[#D4AF67]/35 rounded-3xl p-7 space-y-6 shadow-xs">
                  <div>
                    <h3 className="font-serif-royal text-lg font-bold text-[#2C2621] flex items-center gap-2">
                      <Calendar size={18} className="text-[#845E1B]" />
                      <span>Manage Walima Event Information (Firestore: events)</span>
                    </h3>
                    <p className="text-xs text-[#5C4D3C] mt-1">
                      Updates saved here are immediately reflected in the live invitation and ceremony schedule.
                    </p>
                  </div>

                  {eventSavedMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-serif-royal flex items-center gap-2">
                      <Check size={16} />
                      <span>Walima event details updated successfully in Firestore!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveEventDetails} className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editEventTitle}
                        onChange={(e) => setEditEventTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] focus:border-[#845E1B] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          required
                          value={editEventDate}
                          onChange={(e) => setEditEventDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] focus:border-[#845E1B] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                          Time (PKT)
                        </label>
                        <input
                          type="text"
                          required
                          value={editEventTime}
                          onChange={(e) => setEditEventTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] focus:border-[#845E1B] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editEventVenue}
                        onChange={(e) => setEditEventVenue(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] focus:border-[#845E1B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                        Address / Directions
                      </label>
                      <input
                        type="text"
                        required
                        value={editEventAddress}
                        onChange={(e) => setEditEventAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] focus:border-[#845E1B] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-xs"
                    >
                      Save Walima Event
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: GALLERY & MEDIA (gallery collection) */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-royal text-lg font-bold text-[#2C2621] flex items-center gap-2">
                        <Film size={18} className="text-[#845E1B]" />
                        <span>Manage Walima Media (Firestore: gallery)</span>
                      </h3>
                      <p className="text-xs text-[#5C4D3C] mt-1">
                        Add photographs or highlight reels displayed in the wedding memories section.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingMedia(!isAddingMedia)}
                      className="px-4 py-2 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs hover:brightness-105"
                    >
                      <Plus size={15} />
                      <span>Add Media Entry</span>
                    </button>
                  </div>

                  {isAddingMedia && (
                    <form onSubmit={handleAddGalleryItem} className="p-6 rounded-2xl border-2 border-[#D4AF67] bg-[#FAF7F2] space-y-4 animate-fade-in shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                            Media Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={newGalleryTitle}
                            onChange={(e) => setNewGalleryTitle(e.target.value)}
                            placeholder="e.g. Walima Stage Moments"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                            Category
                          </label>
                          <select
                            value={newGalleryCategory}
                            onChange={(e) => setNewGalleryCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B]"
                          >
                            <option value="Portraits">Portraits</option>
                            <option value="Stage Elegance">Stage Elegance</option>
                            <option value="Banquet &amp; Milni">Banquet &amp; Milni</option>
                            <option value="Family Duas">Family Duas</option>
                            <option value="Cinematic Highlights">Cinematic Highlights</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#845E1B] font-serif-royal font-bold mb-1">
                            Media URL (Photo / Video Link)
                          </label>
                          <input
                            type="text"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4AF67]/40 bg-white text-xs text-[#2C2621] outline-none focus:border-[#845E1B]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingMedia(false)}
                          className="px-4 py-2 rounded-lg text-xs text-stone-500 hover:text-[#2C2621] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl gold-foil-bg text-[#2C2621] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-xs"
                        >
                          Save Media Entry
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#D4AF67]/35 rounded-2xl p-5 flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-[#845E1B] font-serif-royal font-bold">
                            {item.category}
                          </span>
                          <h4 className="font-serif-royal text-base font-bold text-[#2C2621] mt-1">
                            {item.title}
                          </h4>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                          <button
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: SETTINGS (websiteSettings collection) */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-white border-2 border-[#D4AF67]/30 rounded-2xl p-6 space-y-4 shadow-xs">
                    <h4 className="font-serif-royal text-base font-bold text-[#2C2621] flex items-center gap-2">
                      <Settings size={18} className="text-[#845E1B]" />
                      <span>Walima Memories &amp; Gallery Activation</span>
                    </h4>
                    <p className="text-xs text-[#5C4D3C] leading-relaxed font-sans">
                      Toggle this switch after the Walima ceremony on 8 November 2026. Enabling this immediately unlocks the official photo album and cinematic highlight reel for all visitors.
                    </p>

                    <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                      <span className="font-serif-royal text-sm font-semibold text-[#2C2621]">
                        Gallery Live Status:
                      </span>
                      <button
                        onClick={() => onToggleMemories(!isMemoriesActive)}
                        className={`px-5 py-2 rounded-full text-xs font-serif-royal font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isMemoriesActive
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
                        }`}
                      >
                        {isMemoriesActive ? 'Currently Active (Live)' : 'Currently Locked (Pre-Wedding)'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-[#D4AF67]/30 rounded-2xl p-6 shadow-xs">
                    <h4 className="font-serif-royal text-base font-bold text-[#2C2621] mb-2">
                      Zero-Trust Guest Security &amp; Token Privacy
                    </h4>
                    <p className="text-xs text-[#5C4D3C] leading-relaxed font-sans">
                      All guest records in the <code className="text-[#845E1B] font-bold">guests</code> collection are private to the administrator. Each guest accesses their invitation strictly via their dedicated token document in the <code className="text-[#845E1B] font-bold">invitations</code> collection. Guests cannot list or view other attendees' data.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
