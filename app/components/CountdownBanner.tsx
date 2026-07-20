"use client";

import { useEffect, useMemo, useState } from "react";

export default function CountdownBanner() {

  const [now, setNow] =
    useState<Date | null>(null);


  useEffect(() => {

    setNow(new Date());


    const timer =
      setInterval(() => {

        setNow(new Date());

      }, 1000);


    return () =>
      clearInterval(timer);


  }, []);



  const message =
    useMemo(() => {


      if (!now) {

        return {
          color:
            "bg-yellow-100 border-yellow-500 text-yellow-800",

          text:
            "⏰ Đang kiểm tra thời gian báo cơm..."
        };

      }



      const current =
        new Date();



      const deadline =
        new Date();


      deadline.setHours(
        16,
        0,
        0,
        0
      );



      if (
        current >= deadline
      ) {

        return {

          color:
            "bg-red-100 border-red-500 text-red-700",

          text:
            "⛔ Đã hết thời gian báo cơm ngày mai.",

        };

      }



      const diff =
        deadline.getTime()
        -
        current.getTime();



      const hours =
        Math.floor(
          diff /
          (1000 * 60 * 60)
        );



      const minutes =
        Math.floor(
          (diff %
            (1000 * 60 * 60))
          /
          (1000 * 60)
        );



      const seconds =
        Math.floor(
          (diff %
            (1000 * 60))
          /
          1000
        );



      return {

        color:
          "bg-yellow-100 border-yellow-500 text-yellow-800",

        text:
          `⏰ Còn ${hours} giờ ${minutes} phút ${seconds} giây để báo cơm ngày mai.`,

      };


    }, [now]);



  return (

    <div
      className={`mb-4 rounded-xl border px-4 py-3 font-medium ${message.color}`}
    >

      {message.text}

    </div>

  );

}