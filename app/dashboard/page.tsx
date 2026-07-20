"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Calendar from "../components/Calendar";
import Menu from "../components/Menu";
import CountdownBanner from "../components/CountdownBanner";

import { listenAuth } from "@/lib/auth";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    const unsubscribe =
      listenAuth((user) => {

        if (!user) {
          router.replace("/login");
        }

      });

    return () => unsubscribe();

  }, [router]);

  return (

    <main className="min-h-screen bg-[#FFFDF7] pb-28">

      <div className="mx-auto max-w-md px-5 pt-5">

        <div className="flex items-center justify-between">

          <Menu />

          <div className="text-xs text-gray-400">
            Mark1
          </div>

        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="mt-4 rounded-3xl border border-[#F5E8BF] bg-white p-6 shadow-sm"
        >

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF3CC] text-3xl">
              🍱
            </div>

            <div>

              <h1 className="text-2xl font-bold text-gray-800">
                Báo cơm
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Đăng ký suất ăn hằng ngày
              </p>

            </div>

          </div>

        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mt-5"
        >

          <CountdownBanner />

        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mt-5"
        >

          <Calendar />

        </motion.div>

      </div>

    </main>

  );

}