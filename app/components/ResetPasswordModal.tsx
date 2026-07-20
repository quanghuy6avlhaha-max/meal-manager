"use client";

import { useState } from "react";
import { UserData } from "@/lib/users";
import FadeIn from "@/app/components/animations/FadeIn";
import ScaleButton from "@/app/components/animations/ScaleButton";

interface Props {
  user: UserData;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResetPasswordModal({
  user,
  onClose,
  onSuccess,
}: Props) {
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function resetPassword() {
    if (!password.trim()) {
      alert("Vui lòng nhập mật khẩu");
      return;
    }

    if (!/^[0-9]+$/.test(password)) {
      alert("Mật khẩu chỉ được dùng số");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Không thể reset mật khẩu");
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
        <div className="w-full max-w-sm rounded-3xl border border-[#F5E8BF] bg-white p-6 shadow-xl">

          <div className="mb-6 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF6DA] text-3xl shadow-sm">
              🔑
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              Reset mật khẩu
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tạo mật khẩu mới cho tài khoản
            </p>

          </div>

          <div className="space-y-4">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                value={user.username}
                disabled
                className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  disabled={loading}
                  placeholder="123456"
                  className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 pr-12 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>

            <div className="flex gap-3 pt-2">

              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-2xl border border-[#F3E3A3] py-3 font-medium text-gray-700 transition hover:bg-[#FFF8E6]"
              >
                Hủy
              </button>

              <ScaleButton
                onClick={resetPassword}
                disabled={loading}
                className="flex-1 rounded-2xl bg-[#F2D77A] py-3 font-semibold text-gray-800 transition hover:bg-[#EBCB5A] disabled:bg-gray-300"
              >
                {loading ? "Đang reset..." : "Reset"}
              </ScaleButton>

            </div>

          </div>

        </div>
      </div>
    </FadeIn>
  );
}