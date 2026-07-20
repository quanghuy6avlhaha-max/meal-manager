import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export type MealData = {
  sang: boolean;
  trua: boolean;
  toi: boolean;
};



const defaultMeal: MealData = {
  sang: false,
  trua: false,
  toi: false,
};



// Lấy dữ liệu 1 ngày của user
export async function getMeal(
  userId: string,
  day: string
): Promise<MealData> {

  const ref = doc(
    db,
    "meals",
    userId,
    "days",
    day
  );


  const snap = await getDoc(ref);


  if (!snap.exists()) {
    return defaultMeal;
  }


  return snap.data() as MealData;

}



// Lưu báo cơm
export async function saveMeal(
  userId: string,
  day: string,
  data: MealData
) {

  const ref = doc(
    db,
    "meals",
    userId,
    "days",
    day
  );


  await setDoc(
    ref,
    data
  );

}



// Admin đọc toàn bộ dữ liệu 1 user
export async function getUserMeals(
  userId: string
) {

  const ref = collection(
    db,
    "meals",
    userId,
    "days"
  );


  const snap = await getDocs(ref);


  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

}



// Admin đọc dữ liệu tất cả user
export async function getAllMeals() {

  const usersRef = collection(
    db,
    "users"
  );


  const usersSnap = await getDocs(usersRef);


  const result: any[] = [];


  for (const userDoc of usersSnap.docs) {

    const userId = userDoc.id;


    const meals = await getUserMeals(
      userId
    );


    result.push({
      userId,
      ...userDoc.data(),
      meals,
    });

  }


  return result;

}