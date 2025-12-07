import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1xlQaOX-GlrpJjBa5Yz0Yt3HUOQLM3HM",
  authDomain: "wiskter.firebaseapp.com",
  projectId: "wiskter",
  storageBucket: "wiskter.firebasestorage.app",
  messagingSenderId: "385663995150",
  appId: "1:385663995150:web:124c9727d37bbdc18d5b5f",
  measurementId: "G-E2G8QVDJQT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
