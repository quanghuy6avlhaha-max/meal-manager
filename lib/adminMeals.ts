import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export type AdminMealData = {
  userId: string;
  username: string;
  displayName: string;
  role: string;

  meals: {
    id: string;
    sang?: boolean;
    trua?: boolean;
    toi?: boolean;
  }[];
};



export async function getAdminMeals(): Promise<AdminMealData[]> {

  const usersSnap = await getDocs(
    collection(db, "users")
  );


  const result: AdminMealData[] = [];


  for (const userDoc of usersSnap.docs) {

    const userData = userDoc.data();


    const uid =
      userData.uid ?? userDoc.id;


    const mealsSnap = await getDocs(
      collection(
        db,
        "meals",
        uid,
        "days"
      )
    );


    const meals =
      mealsSnap.docs.map((mealDoc)=>{

        const data = mealDoc.data();

        return {
          id: mealDoc.id,

          sang:
            data.sang ?? false,

          trua:
            data.trua ?? false,

          toi:
            data.toi ?? false,
        };

      });



    result.push({

      userId: uid,

      username:
        userData.username ?? "",

      displayName:
        userData.displayName ?? "",

      role:
        userData.role ?? "member",

      meals,

    });

  }


  return result;

}