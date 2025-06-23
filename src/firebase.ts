import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Only initialize auth and db in the browser
export const auth = typeof window !== "undefined" ? getAuth(app) : undefined;
export const db = typeof window !== "undefined" ? getFirestore(app) : undefined;

if (typeof window !== "undefined" && auth) {
  // safe to use auth and RecaptchaVerifier
}