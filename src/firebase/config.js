// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAin1VRoE6dV_7yUek2xVInBArbBUtrkhQ",
  authDomain: "planificador-personal-575e4.firebaseapp.com",
  projectId: "planificador-personal-575e4",
  storageBucket: "planificador-personal-575e4.appspot.com",
  messagingSenderId: "488328304040",
  appId: "1:488328304040:web:c26a185f576a71a249b99d",
  measurementId: "G-KT111WDJKV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
