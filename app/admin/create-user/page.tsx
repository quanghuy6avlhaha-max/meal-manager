"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { listenAuth } from "@/lib/auth";
import ScaleButton from "@/app/components/animations/ScaleButton";
export default function CreateUserPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [displayName, setDisplayName] =
    useState("");

  const [password, setPassword] =
    useState("123456");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {

    const unsubscribe =
      listenAuth(async (firebaseUser) => {

        if (!firebaseUser) {
          router.replace("/login");
          return;
        }

        const username =
          firebaseUser.email?.replace(
            "@mealmanager.app",
            ""
          );

        if (!username) {
          router.replace("/dashboard");
          return;
        }

        const userSnap =
          await getDoc(
            doc(db, "users", username)
          );

        if (
          !userSnap.exists() ||
          userSnap.data().role !== "admin"
        ) {

          router.replace("/dashboard");
          return;

        }

      });

    return () =>
      unsubscribe();

  }, [router]);

  function removeVietnamese(str: string) {

    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  }

  function handleUsername(value: string) {

    const clean =
      removeVietnamese(value)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    setUsername(clean);

  }

  async function createUser() {

    setMessage("");

    if (!username.trim()) {
      setMessage("Vui lòng nhập Username");
      return;
    }

    if (!displayName.trim()) {
      setMessage("Vui lòng nhập Họ tên");
      return;
    }

    if (!password.trim()) {
      setMessage("Vui lòng nhập Mật khẩu");
      return;
    }

    if (!/^[0-9]+$/.test(password)) {
      setMessage("Mật khẩu chỉ được dùng số");
      return;
    }

    try {

      setLoading(true);

      const res =
        await fetch(
          "/api/users/create",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              username: username.trim(),
              displayName: displayName.trim(),
              password: password.trim(),
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok || !data.success) {

        setMessage(
          data.error ||
          "Tạo tài khoản thất bại"
        );

        return;

      }

      setMessage(
        "✅ Tạo tài khoản thành công"
      );

      setUsername("");
      setDisplayName("");
      setPassword("123456");

    } catch (error) {

      console.error(error);

      setMessage(
        "Không thể kết nối đến máy chủ"
      );

    } finally {

      setLoading(false);

    }

  }
    return (

    <main className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-5">

      <div className="w-full max-w-md">

        <div className="rounded-3xl border border-[#F5E8BF] bg-white p-8 shadow-sm">

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF6DA] text-4xl shadow-sm">
              👤
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-800">
              Tạo tài khoản
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Chỉ quản trị viên mới có quyền tạo tài khoản.
            </p>

          </div>

          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                value={username}
                onChange={(e) =>
                  handleUsername(e.target.value)
                }
                placeholder="vd: nguyenvana"
                disabled={loading}
                className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Họ tên
              </label>

              <input
                value={displayName}
                onChange={(e) =>
                  setDisplayName(e.target.value)
                }
                placeholder="Nguyễn Văn A"
                disabled={loading}
                className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>

              <input
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                inputMode="numeric"
                placeholder="123456"
                disabled={loading}
                className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
              />

            </div>

            {message && (

              <div
                className={`rounded-2xl border px-4 py-3 text-center text-sm ${
                  message.includes("thành công")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>

            )}

            <ScaleButton
              onClick={createUser}
              disabled={loading}
              className="w-full rounded-2xl bg-[#F2D77A] py-3 font-semibold text-gray-800 transition hover:bg-[#EBCB5A] disabled:bg-gray-300"
            >

              {loading
                ? "Đang tạo..."
                : "Tạo tài khoản"}

            </ScaleButton>

            <button
              onClick={() => router.back()}
              className="w-full rounded-2xl border border-[#F3E3A3] py-3 font-medium text-gray-700 transition hover:bg-[#FFF8E6]"
            >
              Quay lại
            </button>

          </div>

        </div>

      </div>

    </main>

  );

}