"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { logout, listenAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

export default function Menu() {

  const [open, setOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();

  useEffect(() => {

    const unsubscribe =
      listenAuth(async (user) => {

        if (!user || !user.email) {

          setIsAdmin(false);
          return;

        }

        const username =
          user.email.replace(
            "@mealmanager.app",
            ""
          );

        const userSnap =
          await getDoc(
            doc(
              db,
              "users",
              username
            )
          );

        if (
          userSnap.exists() &&
          userSnap.data().role === "admin"
        ) {

          setIsAdmin(true);

        } else {

          setIsAdmin(false);

        }

      });

    return () => unsubscribe();

  }, []);

  async function handleLogout() {

    await logout();

    router.replace("/login");

  }

  return (

    <>

      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl transition hover:bg-[#FFF3CC] active:scale-95"
      >
        ☰
      </button>

      <AnimatePresence>

        {open && (

          <>

            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
              }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col overflow-hidden rounded-r-3xl bg-[#FFFDF7] shadow-2xl"
            >

              <div className="border-b border-[#F5E8BF] bg-[#F2D77A] p-6">

                <div className="text-3xl">
                  🍱
                </div>

                <h2 className="mt-3 text-xl font-bold text-gray-800">
                  Báo cơm
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Mark1
                </p>

              </div>

              <nav className="flex-1 px-3 py-3 space-y-1">

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-2xl px-4 py-3 transition hover:bg-[#FFF3CC] active:scale-[0.98]"
                >
                  📅
                  <span className="ml-3">
                    Báo cơm
                  </span>
                </Link>

                {isAdmin && (

                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center rounded-2xl px-4 py-3 transition hover:bg-[#FFF3CC] active:scale-[0.98]"
                  >
                    👤
                    <span className="ml-3">
                      Quản lý tài khoản
                    </span>
                  </Link>

                )}

                <Link
                  href="/change-password"
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-2xl px-4 py-3 transition hover:bg-[#FFF3CC] active:scale-[0.98]"
                >
                  🔑
                  <span className="ml-3">
                    Đổi mật khẩu
                  </span>
                </Link>

              </nav>

              <div className="border-t border-[#F5E8BF] p-3">

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-2xl px-4 py-3 text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
                >
                  🚪
                  <span className="ml-3">
                    Đăng xuất
                  </span>
                </button>

              </div>

            </motion.div>

          </>

        )}

      </AnimatePresence>

    </>

  );

}