// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";


// const firebaseConfig = {
//   apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
//   authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
//   appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
//   measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
//   messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGE_SENDER_ID
// };

  

// const app = initializeApp(firebaseConfig);

// // Only initialize auth and db in the browser
// export const auth = typeof window !== "undefined" ? getAuth(app) : undefined;
// export const db = typeof window !== "undefined" ? getFirestore(app) : undefined;
// export const storage = typeof window !== "undefined" ? getStorage(app) : undefined;

// if (typeof window !== "undefined" && auth) {
//   // safe to use auth and RecaptchaVerifier
// }
// src/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Create mock objects for SSR
class MockAuth {
  currentUser = null;
  onAuthStateChanged = (callback: any) => {
    callback(null);
    return () => {};
  };
  signOut = async () => {};
}

class MockFirestore {}
class MockStorage {}

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Make auth and other Firebase services work on the server
const app = typeof window !== 'undefined' 
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : {} as any;

const auth = typeof window !== 'undefined' 
  ? getAuth(app) 
  : new MockAuth() as any;

const db = typeof window !== 'undefined' 
  ? getFirestore(app) 
  : new MockFirestore() as any;
  
const storage = typeof window !== 'undefined' 
  ? getStorage(app) 
  : new MockStorage() as any;

export { app, auth, db, storage };