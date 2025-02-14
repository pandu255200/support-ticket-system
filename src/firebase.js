import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // ✅ Import Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyCD5EE2VUVK0McZPXVIw4o1N5G3t5VdmXc",
  authDomain: "support-tickets-c4bd8.firebaseapp.com",
  projectId: "support-tickets-c4bd8",
  storageBucket: "support-tickets-c4bd8.firebasestorage.app",
  messagingSenderId: "199318638817",
  appId: "1:199318638817:web:f004b29323339cf00ee7a0",
  measurementId: "G-L2W034B5DP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // ✅ Export Firebase Authentication
