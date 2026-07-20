import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzAd1GNWXATSFUdeuWFeFIgIj-t5b4Tbg",
  authDomain: "meal-manager-6cd54-c9377.firebaseapp.com",
  projectId: "meal-manager-6cd54-c9377",
  storageBucket: "meal-manager-6cd54-c9377.firebasestorage.app",
  messagingSenderId: "149526370657",
  appId: "1:149526370657:web:f3b98ab9fe1a5559640d20",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);


// Firebase Authentication (xác thực đăng nhập)
export const auth = getAuth(app);


// Cloud Firestore (cơ sở dữ liệu)
export const db = getFirestore(app);


export default app;