export interface AdminUser {
  email: string;
  role: 'admin';
  createdAt?: string;
}

export interface Guest {
  id: string;
  name: string;
  familyGroup?: string;
  invitationToken: string;
  maxGuests: number;
  phone?: string;
  notes?: string;
  createdAt: string;
}

export interface Invitation {
  id: string; // Token acts as document ID
  guestId: string;
  guestName: string;
  familyGroup?: string;
  token: string;
  maxGuests: number;
  createdAt: string;
}

export interface Rsvp {
  id: string;
  guestId: string;
  invitationToken: string;
  guestName: string;
  status: 'attending' | 'declined' | 'pending';
  attendeesCount: number;
  dietaryOrNotes?: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  eventType: string; // "Walima"
  date: string; // "Sunday, 8 November 2026"
  time: string; // "1:00 PM PKT"
  timezone: string; // "Asia/Karachi"
  venue: string; // "Bukhara Royale Marquee"
  address: string; // "Main Expressway, Islamabad, near Gulberg, Pakistan"
  mapUrl?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  mediaUrl?: string;
  caption?: string;
  createdAt?: string;
}

export interface WebsiteSetting {
  id: string;
  eventTitle: string;
  memoriesActivated: boolean;
  announcement?: string;
  updatedAt?: string;
}
