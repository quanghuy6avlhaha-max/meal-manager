import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

import serviceAccountJson from "../meal-manager-6cd54-c9377-firebase-adminsdk-fbsvc-10e04a2551.json";

const serviceAccount = serviceAccountJson as ServiceAccount;

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);