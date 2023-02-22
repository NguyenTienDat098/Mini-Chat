// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATBPCifBh18zBg3AuQ5XMefnsYXf3U07s",
  authDomain: "chat-app-d2acd.firebaseapp.com",
  projectId: "chat-app-d2acd",
  storageBucket: "chat-app-d2acd.appspot.com",
  messagingSenderId: "322016970595",
  appId: "1:322016970595:web:c5cdf330d66cd1cfa0b556",
  measurementId: "G-2TKRDB50W0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8000);
  connectStorageEmulator(storage, "localhost", 9199);
}
export { auth, db, storage };
