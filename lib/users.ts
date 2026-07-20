import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export type UserRole = "admin" | "member";


export type UserData = {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
};



export async function getUser(
  uid: string
): Promise<UserData | null> {

  const ref = doc(
    db,
    "users",
    uid
  );

  const snap = await getDoc(ref);


  if (!snap.exists()) {
    return null;
  }


  return {
    id: snap.id,
    ...snap.data(),
  } as UserData;
}



export async function getUsers(): Promise<UserData[]> {

  const ref = collection(
    db,
    "users"
  );

  const snap = await getDocs(ref);


  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UserData[];

}



export async function isAdmin(
  uid: string
): Promise<boolean> {

  const user = await getUser(uid);

  return user?.role === "admin";

}