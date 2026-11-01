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

export interface Rsvp {
  id: string; // guestId or unique rsvp id
  guestId: string;
  invitationToken: string;
  guestName: string;
  status: 'attending' | 'declined' | 'pending';
  attendeesCount: number;
  dietaryOrNotes?: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface GuestWish {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
}

export interface WeddingSetting {
  id: string;
  memoriesActivated: boolean;
  welcomeMessage?: string;
  musicEnabled: boolean;
  updatedAt: string;
  photos?: string[];
}
