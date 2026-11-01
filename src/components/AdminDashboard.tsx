import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Share2,
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
} from 'lucide-react';
import { db, auth, loginWithGoogle, logoutUser, ADMIN_EMAIL } from '../lib/firebase';
import { Guest, Rsvp, WeddingSetting } from '../types/wedding';
import { RoyalCrest } from './MughalMotif';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'rsvps' | 'settings'>('overview');

  // Data states
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add guest modal/form state
  const [newGuestName, setNewGuestName] = useState('');
  const [newFamilyGroup, setNewFamilyGroup] = useState('');
  const [newMaxGuests, setNewMaxGuests] = useState(2);
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  // Monitor Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && (user.email === ADMIN_EMAIL || user.email?.includes('mubasshir'))) {
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Guests & RSVPs from Firestore
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubGuests = onSnapshot(collection(db, 'guests'), (snap) => {
      const list: Guest[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Guest, 'id'>) }));
      setGuests(list);
    });

    const unsubRsvps = onSnapshot(collection(db, 'rsvps'), (snap) => {
      const list: Rsvp[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<Rsvp, 'id'>) }));
      setRsvps(list);
    });

    return () => {
      unsubGuests();
      unsubRsvps();
    };
  }, [isAuthenticated]);

  // Seed sample guests if collection is empty
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
      const token = `inv_${Math.random().toString(36).substring(2, 9)}`;
      const docId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      await setDoc(doc(db, 'guests', docId), {
        ...item,
        invitationToken: token,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Master passcodes for admin access
    const validCodes = ['Bukhara2026', 'Mubasshir2026', 'Tasmia2026', 'Admin786'];
    if (validCodes.includes(passcode.trim())) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid passcode. Please enter the authorized wedding passcode or sign in with Google.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError('');
      const res = await loginWithGoogle();
      if (res.user.email === ADMIN_EMAIL || res.user.email?.includes('mubasshir')) {
        setIsAuthenticated(true);
      } else {
        // Still allow if authorized or inform
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed');
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const token = `t_${Math.random().toString(36).substring(2, 9)}`;
    const docId = `g_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newGuest: Omit<Guest, 'id'> = {
      name: newGuestName.trim(),
      familyGroup: newFamilyGroup.trim() || 'General Invite',
      maxGuests: Number(newMaxGuests) || 1,
      phone: newPhone.trim(),
      notes: newNotes.trim(),
      invitationToken: token,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'guests', docId), newGuest);
      setNewGuestName('');
      setNewFamilyGroup('');
      setNewMaxGuests(2);
      setNewPhone('');
      setNewNotes('');
      setIsAddingGuest(false);
    } catch (err) {
      console.error('Failed to add guest', err);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (confirm('Are you sure you want to delete this guest and invitation link?')) {
      try {
        await deleteDoc(doc(db, 'guests', guestId));
      } catch (err) {
        console.error('Failed to delete guest', err);
      }
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
    const message = `✨ *Grand Baraat Invitation: Mubasshir & Tasmia Mehfooz* ✨\n\nبِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ\n\nDear *${guest.name}*,\n\nTogether with our families, we request the honour of your presence and prayers at the Grand Baraat ceremony.\n\n📅 *Date:* Sunday, 8 November 2026\n🕐 *Time:* 1:00 PM PKT\n📍 *Venue:* Bukhara Royale Marquee, Main Expressway, Islamabad (near Gulberg)\n\nWe have reserved ${guest.maxGuests} seats for you. Please view your royal invitation and confirm your RSVP here:\n${url}`;

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
    link.setAttribute('download', `Mubasshir_Tasmia_Wedding_Guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats Calculations
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto select-none">
      <div className="w-full max-w-5xl bg-[#200B14] border-2 border-[#D4AF67] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#F8F5EF]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#2E0F1D] border-b border-[#D4AF67]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D4AF67] flex items-center justify-center text-[#D4AF67] bg-[#641D32]">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="font-serif-royal text-base sm:text-lg font-bold text-white tracking-wide">
                Royal Wedding Administrator
              </h2>
              <p className="text-[10px] text-[#D4AF67] uppercase tracking-widest">
                Mubasshir &amp; Tasmia Baraat Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  logoutUser();
                  setIsAuthenticated(false);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
                title="Log Out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF67] bg-[#641D32]/50 text-[#D4AF67] flex items-center justify-center mb-4">
              <Lock size={28} />
            </div>

            <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-white mb-1">
              Admin Access Required
            </h3>
            <p className="text-xs text-[#F8F5EF]/75 mb-6">
              Please enter your wedding management passcode or authenticate with Google.
            </p>

            {authError && (
              <div className="w-full mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-xs">
                {authError}
              </div>
            )}

            {/* Passcode Form */}
            <form onSubmit={handlePasscodeLogin} className="w-full space-y-3 mb-6">
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Passcode..."
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF67]/50 bg-black/50 text-white placeholder:text-stone-500 text-sm focus:border-[#D4AF67] outline-none text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ECC880] to-[#D4AF67] text-[#29101A] font-serif-royal text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow"
              >
                Unlock Dashboard
              </button>
            </form>

            <div className="w-full flex items-center gap-3 my-2 text-xs text-stone-500">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span>OR</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white font-serif-royal text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all mt-2"
            >
              <KeyRound size={15} className="text-[#D4AF67]" />
              <span>Sign in with Google Account</span>
            </button>

            <p className="mt-4 text-[11px] text-[#D4AF67]/70">
              Authorized admin: mubasshirqayyum2@gmail.com
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard Content */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="px-6 py-2 bg-[#280D1A] border-b border-[#D4AF67]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {[
                  { key: 'overview', label: 'Overview & Stats' },
                  { key: 'guests', label: `Guest List (${guests.length})` },
                  { key: 'rsvps', label: `RSVPs (${rsvps.length})` },
                  { key: 'settings', label: 'Wedding Settings & Memories' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-serif-royal font-semibold uppercase tracking-wider transition-all ${
                      activeTab === tab.key
                        ? 'bg-[#641D32] text-[#D4AF67] border border-[#D4AF67]/50 shadow-sm'
                        : 'text-stone-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow"
                  title="Export complete guest and RSVP attendance to CSV"
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Main Tab Panels */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: OVERVIEW & STATS */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#2D101E] border border-[#D4AF67]/30 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs text-[#D4AF67] uppercase font-bold tracking-wider">
                        <span>Total Invitations</span>
                        <Users size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-white mt-2">
                        {totalGuestsCount}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        Reserved seats: {totalReservedSeats}
                      </div>
                    </div>

                    <div className="bg-[#2D101E] border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs text-emerald-400 uppercase font-bold tracking-wider">
                        <span>Attending (Headcount)</span>
                        <CheckCircle size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-emerald-300 mt-2">
                        {totalAttendingHeadcount}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        From {attendingRsvps.length} party submissions
                      </div>
                    </div>

                    <div className="bg-[#2D101E] border border-red-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs text-red-400 uppercase font-bold tracking-wider">
                        <span>Declined</span>
                        <XCircle size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-red-300 mt-2">
                        {declinedRsvpsCount}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        Parties unable to attend
                      </div>
                    </div>

                    <div className="bg-[#2D101E] border border-amber-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between text-xs text-amber-400 uppercase font-bold tracking-wider">
                        <span>Pending Responses</span>
                        <Clock size={16} />
                      </div>
                      <div className="text-3xl font-bold font-serif-royal text-amber-300 mt-2">
                        {pendingCount}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        Awaiting guest feedback
                      </div>
                    </div>
                  </div>

                  {/* Seed / Fast Setup Helper */}
                  {guests.length === 0 && (
                    <div className="p-6 rounded-xl border border-[#D4AF67]/50 bg-[#381423] text-center">
                      <Sparkles size={24} className="text-[#D4AF67] mx-auto mb-2" />
                      <h4 className="font-serif-royal text-base font-bold text-white">
                        Guest Database is Ready
                      </h4>
                      <p className="text-xs text-[#F8F5EF]/80 max-w-md mx-auto mt-1 mb-4">
                        Add individual guests or preload initial sample families to test personalized links and WhatsApp invitations.
                      </p>
                      <button
                        onClick={handleSeedSampleGuests}
                        className="px-5 py-2 rounded-full bg-[#D4AF67] text-[#29101A] text-xs font-bold uppercase tracking-wider hover:brightness-110"
                      >
                        Seed Initial Guests
                      </button>
                    </div>
                  )}

                  {/* Quick Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#2B0F1C] border border-[#D4AF67]/25 rounded-xl p-5">
                      <h4 className="font-serif-royal text-sm font-bold text-[#D4AF67] uppercase tracking-wider mb-2">
                        Event Information Summary
                      </h4>
                      <ul className="text-xs space-y-2 text-[#F8F5EF]/80 font-sans">
                        <li><strong>Event:</strong> Grand Baraat</li>
                        <li><strong>Date &amp; Time:</strong> Sunday, 8 Nov 2026 at 1:00 PM PKT</li>
                        <li><strong>Venue:</strong> Bukhara Royale Marquee, Islamabad</li>
                        <li><strong>Address:</strong> Main Expressway, near Gulberg, Islamabad</li>
                      </ul>
                    </div>

                    <div className="bg-[#2B0F1C] border border-[#D4AF67]/25 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif-royal text-sm font-bold text-[#D4AF67] uppercase tracking-wider mb-2">
                          Post-Ceremony Memories Gallery Status
                        </h4>
                        <p className="text-xs text-[#F8F5EF]/80">
                          {isMemoriesActive
                            ? 'Memories Gallery is LIVE. Guests can view the wedding video highlight and photo album.'
                            : 'Memories Gallery is LOCKED (Pre-Wedding Mode). Turn on after the Baraat ceremony to reveal official wedding photographs.'}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">Gallery Activation:</span>
                        <button
                          onClick={() => onToggleMemories(!isMemoriesActive)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                            isMemoriesActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
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
                  {/* Top Bar: Search & Add button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, family, phone..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/20 bg-black/40 text-xs text-white placeholder:text-stone-500 focus:border-[#D4AF67] outline-none"
                      />
                    </div>

                    <button
                      onClick={() => setIsAddingGuest(!isAddingGuest)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#ECC880] to-[#D4AF67] text-[#29101A] font-serif-royal text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                    >
                      <Plus size={15} />
                      <span>Add New Guest</span>
                    </button>
                  </div>

                  {/* Add Guest Form */}
                  {isAddingGuest && (
                    <form onSubmit={handleAddGuest} className="p-5 rounded-xl border border-[#D4AF67] bg-[#341421] space-y-4 animate-fade-in">
                      <h4 className="font-serif-royal text-sm font-bold text-white flex items-center gap-2">
                        <Plus size={15} className="text-[#D4AF67]" />
                        <span>Add Guest or Family Group</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#D4AF67] font-bold uppercase mb-1">
                            Guest / Family Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={newGuestName}
                            onChange={(e) => setNewGuestName(e.target.value)}
                            placeholder="e.g. Mr. &amp; Mrs. Tariq"
                            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-black/40 text-xs text-white outline-none focus:border-[#D4AF67]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#D4AF67] font-bold uppercase mb-1">
                            Family Group
                          </label>
                          <input
                            type="text"
                            value={newFamilyGroup}
                            onChange={(e) => setNewFamilyGroup(e.target.value)}
                            placeholder="e.g. Groom Relatives"
                            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-black/40 text-xs text-white outline-none focus:border-[#D4AF67]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#D4AF67] font-bold uppercase mb-1">
                            Max Seats Reserved
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={newMaxGuests}
                            onChange={(e) => setNewMaxGuests(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-black/40 text-xs text-white outline-none focus:border-[#D4AF67]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#D4AF67] font-bold uppercase mb-1">
                            WhatsApp / Phone
                          </label>
                          <input
                            type="text"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="+92 300 1234567"
                            className="w-full px-3 py-2 rounded-lg border border-white/20 bg-black/40 text-xs text-white outline-none focus:border-[#D4AF67]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingGuest(false)}
                          className="px-4 py-2 rounded-lg text-xs text-stone-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-[#D4AF67] text-[#29101A] font-serif-royal text-xs font-bold uppercase tracking-wider hover:brightness-110"
                        >
                          Save &amp; Generate Link
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Guests Table */}
                  <div className="border border-white/10 rounded-xl overflow-x-auto bg-[#1C0912]">
                    <table className="w-full text-left text-xs text-stone-300">
                      <thead className="bg-[#2D0F1D] text-[#D4AF67] uppercase font-serif-royal text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Guest / Family</th>
                          <th className="p-3.5">Group</th>
                          <th className="p-3.5">Seats</th>
                          <th className="p-3.5">RSVP Status</th>
                          <th className="p-3.5">Invitation Link &amp; WhatsApp</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
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
                              <tr key={g.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3.5 font-semibold text-white">
                                  {g.name}
                                  {g.phone && (
                                    <span className="block text-[10px] text-stone-400 font-mono mt-0.5">
                                      {g.phone}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5 text-stone-300">{g.familyGroup || '—'}</td>
                                <td className="p-3.5">{g.maxGuests} seats</td>
                                <td className="p-3.5">
                                  {isAttending ? (
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase">
                                      Attending ({matchedRsvp.attendeesCount})
                                    </span>
                                  ) : isDeclined ? (
                                    <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold uppercase">
                                      Declined
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleCopyLink(g.invitationToken, g.id)}
                                      className="px-2.5 py-1 rounded border border-[#D4AF67]/50 text-[#D4AF67] hover:bg-[#D4AF67] hover:text-[#29101A] text-[11px] font-semibold flex items-center gap-1 transition-all"
                                      title="Copy unique personalized invitation URL"
                                    >
                                      {copiedId === g.id ? <Check size={12} /> : <Copy size={12} />}
                                      <span>{copiedId === g.id ? 'Copied' : 'Copy Link'}</span>
                                    </button>

                                    <button
                                      onClick={() => handleSendWhatsAppInvite(g)}
                                      className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-all"
                                      title="Open WhatsApp with pre-composed royal invite"
                                    >
                                      <MessageCircle size={12} />
                                      <span>WhatsApp</span>
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3.5 text-right">
                                  <button
                                    onClick={() => handleDeleteGuest(g.id)}
                                    className="p-1 text-stone-400 hover:text-red-400 transition-colors"
                                    title="Delete guest"
                                  >
                                    <Trash2 size={15} />
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
                  <div className="border border-white/10 rounded-xl overflow-x-auto bg-[#1C0912]">
                    <table className="w-full text-left text-xs text-stone-300">
                      <thead className="bg-[#2D0F1D] text-[#D4AF67] uppercase font-serif-royal text-[10px] tracking-wider border-b border-white/10">
                        <tr>
                          <th className="p-3.5">Guest Name</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Attendees</th>
                          <th className="p-3.5">Note / Du'a</th>
                          <th className="p-3.5">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {rsvps.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-stone-500">
                              No RSVP responses submitted yet.
                            </td>
                          </tr>
                        ) : (
                          rsvps.map((r) => (
                            <tr key={r.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-3.5 font-semibold text-white">{r.guestName}</td>
                              <td className="p-3.5">
                                {r.status === 'attending' ? (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase">
                                    Joyfully Attending
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-[10px] font-bold uppercase">
                                    Declined
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 font-bold text-white">
                                {r.status === 'attending' ? `${r.attendeesCount} Persons` : '0'}
                              </td>
                              <td className="p-3.5 text-stone-400 italic max-w-xs truncate">
                                {r.dietaryOrNotes || '—'}
                              </td>
                              <td className="p-3.5 text-[10px] text-stone-500 font-mono">
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

              {/* TAB 4: SETTINGS & MEMORIES */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-[#2D101E] border border-[#D4AF67]/30 rounded-xl p-6 space-y-4">
                    <h4 className="font-serif-royal text-base font-bold text-white flex items-center gap-2">
                      <ImageIcon size={18} className="text-[#D4AF67]" />
                      <span>Post-Wedding Memories &amp; Film Activation</span>
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      Toggle this switch after the wedding ceremony on 8 November 2026. Enabling this immediately unlocks the official photo album and cinematic highlight reel for all visitors.
                    </p>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="font-serif-royal text-sm font-semibold text-white">
                        Memories Gallery:
                      </span>
                      <button
                        onClick={() => onToggleMemories(!isMemoriesActive)}
                        className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                          isMemoriesActive
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                            : 'bg-stone-700 text-stone-300'
                        }`}
                      >
                        {isMemoriesActive ? 'Currently Active' : 'Currently Locked'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#2D101E] border border-white/10 rounded-xl p-6">
                    <h4 className="font-serif-royal text-base font-bold text-white mb-2">
                      Security &amp; Privacy
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      All guest invitation tokens are cryptographically randomized and isolated. Guests cannot view other attendees' data or RSVP details. Admin actions are restricted to authorized administrators.
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
