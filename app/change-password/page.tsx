"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { listenAuth } from "@/lib/auth";
import Menu from "../components/Menu";
import FadeIn from "@/app/components/animations/FadeIn";
import ScaleButton from "@/app/components/animations/ScaleButton";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = listenAuth((firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/login");
        return;
      }

      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleChangePassword() {
    setMessage("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới không trùng khớp");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }

    try {
      setLoading(true);

      if (!user || !user.email) {
        throw new Error("Chưa đăng nhập");
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        newPassword
      );

      setMessage("✅ Đổi mật khẩu thành công");

      setTimeout(() => {
        router.replace("/dashboard");
      }, 1200);
    } catch (error: any) {
      console.error(error);

      if (error.code === "auth/wrong-password") {
        setMessage("Mật khẩu hiện tại không đúng");
      } else {
        setMessage("Không thể đổi mật khẩu");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Menu />

      <FadeIn>
        <main className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-5 py-8">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-[#F5E8BF] bg-white p-8 shadow-sm">
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF6DA] text-4xl shadow-sm">
                  🔑
                </div>

                <h1 className="mt-5 text-3xl font-bold text-gray-800">
                  Đổi mật khẩu
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Nhập mật khẩu hiện tại và mật khẩu mới.
                </p>
              </div>

              <div className="space-y-5">
                              <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mật khẩu hiện tại
                  </label>

                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      placeholder="Nhập mật khẩu hiện tại"
                      disabled={loading}
                      className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 pr-12 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrent(!showCurrent)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showCurrent ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mật khẩu mới
                  </label>

                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Nhập mật khẩu mới"
                      disabled={loading}
                      className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 pr-12 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNew(!showNew)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNew ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu mới
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Nhập lại mật khẩu mới"
                      disabled={loading}
                      className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 pr-12 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirm ? "🙈" : "👁"}
                    </button>
                  </div>
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
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#F2D77A] py-3 font-semibold text-gray-800 transition hover:bg-[#EBCB5A] disabled:bg-gray-300"
                >
                  {loading
                    ? "Đang xử lý..."
                    : "Đổi mật khẩu"}
                </ScaleButton>

                <button
                  onClick={() =>
                    router.push("/dashboard")
                  }
                  className="w-full rounded-2xl border border-[#F3E3A3] py-3 font-medium text-gray-700 transition hover:bg-[#FFF8E6]"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </main>
      </FadeIn>
    </>
  );
}