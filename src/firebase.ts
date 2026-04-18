import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBe0fEtQq-nU0LKVE2VB6LFP3jCf0EbG3s",
  authDomain: "beverageshop-1f619.firebaseapp.com",
  projectId: "beverageshop-1f619",
  storageBucket: "beverageshop-1f619.firebasestorage.app",
  messagingSenderId: "490998215059",
  appId: "1:490998215059:web:7012e677ba8b1792357866"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
