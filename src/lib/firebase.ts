import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { WeddingEvent, WebsiteSetting, GalleryItem, Invitation, Rsvp } from '../types/wedding';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'mubasshirqayyum2@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Bootstrap initial database records if empty (Events, WebsiteSettings, Admins)
export async function initializeFirestoreDatabase() {
  try {
    // 1. Check & bootstrap event record (WALIMA)
    const eventRef = doc(db, 'events', 'main_event');
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      const defaultEvent: WeddingEvent = {
        id: 'main_event',
        title: 'Grand Walima Reception',
        eventType: 'Walima',
        date: 'Sunday, 8 November 2026',
        time: '1:00 PM PKT',
        timezone: 'Asia/Karachi',
        venue: 'Bukhara Royale Marquee',
        address: 'Main Expressway, Islamabad, near Gulberg, Pakistan',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(eventRef, defaultEvent);
    }

    // 2. Check & bootstrap website settings
    const settingsRef = doc(db, 'websiteSettings', 'main_config');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      const defaultSettings: WebsiteSetting = {
        id: 'main_config',
        eventTitle: 'Mubasshir & Tasmia Mehfooz — Grand Walima',
        memoriesActivated: false,
        announcement: 'Celebrating the sacred Walima union of Mubasshir and Tasmia Mehfooz.',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(settingsRef, defaultSettings);
    }
  } catch (err) {
    console.warn('Database initialization note:', err);
  }
}
initializeFirestoreDatabase();

export async function loginWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error('Google Sign In Error', err);
    throw err;
  }
}

export async function logoutUser() {
  return await signOut(auth);
}
