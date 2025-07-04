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

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };