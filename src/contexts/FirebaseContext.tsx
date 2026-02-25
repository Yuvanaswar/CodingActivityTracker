import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Context interface
interface FirebaseContextType {
  app: FirebaseApp | null;
  db: Firestore | null;
  isInitialized: boolean;
}

// Create context
const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  db: null,
  isInitialized: false
});

// Firebase configuration from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Provider component
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Initialize Firebase
        const firebaseApp = initializeApp(firebaseConfig);

        // Initialize Firestore with settings if needed, or get default instance
        const firestore = getFirestore(firebaseApp);

        // Enable offline persistence
        // Note: This must be done before any data fetching
        const { enableIndexedDbPersistence } = await import('firebase/firestore');

        try {
          // Attempt to enable persistence
          // For newer Firebase SDKs (v9+ modular), sometimes initializeFirestore with cache settings is preferred
          await enableIndexedDbPersistence(firestore);
          console.log('✅ Firestore persistence enabled');
        } catch (err: any) {
          if (err.code == 'failed-precondition') {
            console.warn('Persistence failed: Multiple tabs open');
          } else if (err.code == 'unimplemented') {
            console.warn('Persistence not supported by browser');
          }
        }

        setApp(firebaseApp);
        setDb(firestore);
        setIsInitialized(true);

        console.log('✅ Firebase initialized successfully');
      } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        setIsInitialized(false);
      }
    };

    initFirebase();
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, db, isInitialized }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseContext;