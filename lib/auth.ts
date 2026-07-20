import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "./firebase";

/**
 * Đăng nhập
 */
export async function login(
  username: string,
  password: string
) {
  const email =
    `${username.trim().toLowerCase()}@mealmanager.app`;

  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

/**
 * Đăng xuất
 */
export async function logout() {
  return await signOut(auth);
}

/**
 * Lắng nghe trạng thái đăng nhập
 */
export function listenAuth(
  callback: (
    user: User | null
  ) => void
) {
  return onAuthStateChanged(
    auth,
    callback
  );
}

/**
 * Lấy User hiện tại
 */
export function currentUser() {
  return auth.currentUser;
}