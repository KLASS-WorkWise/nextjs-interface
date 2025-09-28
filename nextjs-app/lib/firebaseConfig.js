import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4lQsAr2_OxOse6R_ZfDAIAkCLNsb60rA",
  authDomain: "economic-e3c75.firebaseapp.com",
  projectId: "economic-e3c75",
  storageBucket: "economic-e3c75.appspot.com",
  messagingSenderId: "1097189893918",
  appId: "1:1097189893918:web:8459347d9cf74609030b0f",
  measurementId: "G-4D6DZV8ZWW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
