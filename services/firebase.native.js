import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA74P-qdFd3MCIggqw-ZXdNC2p_Q3i4WY4",
  authDomain: "moviediscoveryapp-5afc1.firebaseapp.com",
  projectId: "moviediscoveryapp-5afc1",
  storageBucket: "moviediscoveryapp-5afc1.firebasestorage.app",
  messagingSenderId: "875858435821",
  appId: "1:875858435821:web:af9bd29c62c9372f3836e4"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

