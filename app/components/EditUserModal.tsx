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

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
}: Props) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!displayName.trim()) {
      alert("Họ tên không được để trống");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          displayName: displayName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Không thể cập nhật tài khoản");
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
              ✏️
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              Sửa thông tin
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Username không thể thay đổi
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
                Họ tên
              </label>

              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
                placeholder="Nhập họ tên"
                className="w-full rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
              />
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
                onClick={save}
                disabled={loading}
                className="flex-1 rounded-2xl bg-[#F2D77A] py-3 font-semibold text-gray-800 transition hover:bg-[#EBCB5A] disabled:bg-gray-300"
              >
                {loading ? "Đang lưu..." : "Lưu"}
              </ScaleButton>

            </div>

          </div>

        </div>
      </div>
    </FadeIn>
  );
}