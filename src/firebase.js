import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Replace with your Firebase project config:
// console.firebase.google.com → Project Settings → Your apps → Web app
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'AIzaSyB6Dfa8i8ZJPC-pdWCTudj1d-jLkZf5G18',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'portfolio-c3f83.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'portfolio-c3f83',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'portfolio-c3f83.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| '875888557337',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:875888557337:web:63fc46e1a4bab6cbb09988',
}

const app     = initializeApp(firebaseConfig)
export const db      = getFirestore(app)
export const storage = getStorage(app)
