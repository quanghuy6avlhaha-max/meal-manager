"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/auth";
import { db } from "@/lib/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import FadeIn from "@/app/components/animations/FadeIn";
import ScaleButton from "@/app/components/animations/ScaleButton";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      await login(
        username.trim(),
        password
      );

      const userSnap =
        await getDoc(
          doc(
            db,
            "users",
            username
              .trim()
              .toLowerCase()
          )
        );

      if (!userSnap.exists()) {

        throw new Error(
          "Không tìm thấy thông tin tài khoản"
        );

      }

      const data =
        userSnap.data();

      if (data.role === "admin") {

        router.replace("/admin");

      } else {

        router.replace("/dashboard");

      }

    } catch (error) {

      console.error(error);

      setError(
        "Sai tài khoản hoặc mật khẩu."
      );

    } finally {

      setLoading(false);

    }

  }

  return (
    <FadeIn>
          <main className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-6">

        <div className="w-full max-w-sm">

          <div className="bg-white rounded-3xl shadow-md border border-[#F6E7B5] p-8">

            <div className="flex flex-col items-center">

              <div className="w-20 h-20 rounded-full bg-[#FFF5D9] flex items-center justify-center text-4xl shadow-sm">
                🍱
              </div>

              <h1 className="mt-5 text-3xl font-bold text-gray-800">
                Báo cơm
              </h1>

              <p className="mt-2 text-sm text-gray-500 text-center">
                Hệ thống báo cơm nội bộ
              </p>

            </div>

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>

                <input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase()
                    )
                  }
                  placeholder="Nhập tên đăng nhập"
                  required
                  className="w-full rounded-2xl border border-[#F3E3A3] bg-white px-4 py-3 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Nhập mật khẩu"
                    required
                    className="w-full rounded-2xl border border-[#F3E3A3] bg-white px-4 py-3 pr-14 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
                  />

                  <ScaleButton
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </ScaleButton>

                </div>

              </div>

              {error && (

                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600 text-center">

                  {error}

                </div>

              )}

              <ScaleButton
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#F2D77A] hover:bg-[#EBCB5A] disabled:bg-gray-300 py-3 font-semibold text-gray-800 transition-all"
              >

                {loading
                  ? "Đang đăng nhập..."
                  : "Đăng nhập"}

              </ScaleButton>

            </form>

            <div className="mt-8 text-center text-xs text-gray-400">
              Mark1 • Version 1.0
            </div>

          </div>

        </div>

      </main>
    </FadeIn>
  );
}