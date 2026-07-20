"use client";

import { useEffect, useMemo, useState } from "react";

import MealPopup from "./MealPopup";

import { auth } from "@/lib/firebase";
import { getMeal, saveMeal, MealData } from "@/lib/meals";

import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

type MealKey =
  | "sang"
  | "trua"
  | "toi";


export default function Calendar() {

  const today = new Date();


  const [viewYear, setViewYear] =
    useState(today.getFullYear());

  const [viewMonth, setViewMonth] =
    useState(today.getMonth());


  const [selectedDay, setSelectedDay] =
    useState<number | null>(null);


  const [mealData, setMealData] =
    useState<Record<string, MealData>>({});


  const [userId, setUserId] =
    useState<string | null>(null);



  const daysInMonth =
    new Date(
      viewYear,
      viewMonth + 1,
      0
    ).getDate();



  function key(day: number) {

    return `${viewYear}-${viewMonth + 1}-${day}`;

  }



  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {

          if (user) {
            setUserId(user.uid);
          } else {
            setUserId(null);
          }

        }
      );


    return () => unsubscribe();


  }, []);




  useEffect(() => {


    async function loadMeals() {


      if (!userId) return;


      const data:
        Record<string, MealData> = {};



      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {


        data[key(day)] =
          await getMeal(
            userId,
            key(day)
          );


      }


      setMealData(data);


    }



    loadMeals();



  }, [
    userId,
    viewMonth,
    viewYear
  ]);




  function changeMonth(
    value: number
  ) {


    const next =
      new Date(
        viewYear,
        viewMonth + value,
        1
      );



    setViewYear(
      next.getFullYear()
    );


    setViewMonth(
      next.getMonth()
    );


    setSelectedDay(null);


  }





  const firstDay =
    new Date(
      viewYear,
      viewMonth,
      1
    ).getDay();



  const start =
    firstDay === 0
      ? 6
      : firstDay - 1;




  const cells =
    useMemo(() => {


      const arr:
        (number | null)[] = [];



      for (
        let i = 0;
        i < start;
        i++
      ) {

        arr.push(null);

      }



      for (
        let i = 1;
        i <= daysInMonth;
        i++
      ) {

        arr.push(i);

      }




      while (
        arr.length % 7 !== 0
      ) {

        arr.push(null);

      }



      return arr;



    }, [
      daysInMonth,
      start
    ]);




  function canEdit(day: number) {


    const isPastMonth =
      viewYear < today.getFullYear()
      ||
      (
        viewYear === today.getFullYear()
        &&
        viewMonth < today.getMonth()
      );



    if (isPastMonth) {

      return false;

    }




    const isCurrentMonth =
      viewYear === today.getFullYear()
      &&
      viewMonth === today.getMonth();




    if (isCurrentMonth) {


      if (
        day <= today.getDate()
      ) {

        return false;

      }



      if (
        day === today.getDate() + 1
      ) {

        return today.getHours() < 16;

      }


    }



    return true;


  }
    function getDayMeal(day: number): MealData {

    return (
      mealData[key(day)]
      ||
      {
        sang: false,
        trua: false,
        toi: false
      }
    );

  }



  async function toggle(
    day: number,
    meal: MealKey
  ) {


    if (
      !canEdit(day)
      ||
      !userId
    ) {

      return;

    }



    const current =
      getDayMeal(day);



    const updated = {

      ...current,

      [meal]:
        !current[meal],

    };




    setMealData({

      ...mealData,

      [key(day)]:
        updated,

    });




    await saveMeal(

      userId,

      key(day),

      updated

    );


  }




  return (

    <div>


      <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-[#F5E8BF]">


        <div className="px-5 py-4 border-b border-[#F5E8BF] bg-[#FFFDF7]">


          <div className="flex items-center justify-between">


            <button

              onClick={() => changeMonth(-1)}

              className="text-xl text-gray-500"

            >

              ←

            </button>




            <h2 className="font-bold text-gray-800 text-lg">


              Tháng {viewMonth + 1}/{viewYear}


            </h2>




            <button

              onClick={() => changeMonth(1)}

              className="text-xl text-gray-500"

            >

              →

            </button>


          </div>


        </div>





        <div className="grid grid-cols-7 bg-[#F2D77A] text-gray-800 text-center text-sm font-semibold">


          {[

            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "CN"

          ].map((day) => (


            <div

              key={day}

              className="py-3"

            >

              {day}

            </div>


          ))}


        </div>





        <div className="grid grid-cols-7">


          {cells.map((day, index) => {


            if (!day) {


              return (

                <div

                  key={`empty-${index}`}

                  className="h-20 border border-[#F5E8BF] bg-[#FFFDF7]"

                />

              );


            }




            const meal =
              getDayMeal(day);




            const isToday =

              viewYear === today.getFullYear()

              &&

              viewMonth === today.getMonth()

              &&

              day === today.getDate();





            const isPastMonth =

              viewYear < today.getFullYear()

              ||

              (

                viewYear === today.getFullYear()

                &&

                viewMonth < today.getMonth()

              );





            const bg =

              isPastMonth

                ? "bg-gray-100"

                : isToday

                ? "bg-[#FFF6D8]"

                : "bg-white";





            return (


              <motion.button


                key={`day-${day}`}


                whileTap={{ scale: 0.95 }}


                transition={{

                  type: "spring",

                  stiffness: 450,

                  damping: 30,

                }}



                onClick={() =>

                  setSelectedDay(day)

                }



                className={`

                  h-20

                  border

                  border-[#F5E8BF]

                  rounded-lg

                  p-2

                  ${bg}

                  transition-all

                  duration-200

                  hover:bg-[#FFF8E8]

                `}


              >


                <div className="font-bold text-gray-700">

                  {day}

                </div>




                <div className="flex justify-center gap-0.5 mt-2 text-[11px] leading-none">


                  {meal.sang && <span>☀️</span>}


                  {meal.trua && <span>🍚</span>}


                  {meal.toi && <span>🌙</span>}


                </div>


              </motion.button>


            );


          })}


        </div>


      </div>





      {selectedDay && (


        <MealPopup


          day={selectedDay}


          open={true}


          data={

            getDayMeal(selectedDay)

          }


          editable={

            canEdit(selectedDay)

          }



          onClose={() =>

            setSelectedDay(null)

          }



          onToggle={(meal) =>

            toggle(

              selectedDay,

              meal

            )

          }


        />


      )}



    </div>


  );


}