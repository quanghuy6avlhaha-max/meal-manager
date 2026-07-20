"use client";

import { AnimatePresence, motion } from "framer-motion";

type MealKey = "sang" | "trua" | "toi";

type MealData = {
  sang: boolean;
  trua: boolean;
  toi: boolean;
};

type Props = {
  day: number;
  open: boolean;
  data: MealData;
  editable: boolean;
  onClose: () => void;
  onToggle: (meal: MealKey) => void;
};

export default function MealPopup({
  day,
  open,
  data,
  editable,
  onClose,
  onToggle,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[30px] border-t border-[#F5E8BF] bg-[#FFFDF7] px-6 pt-6 pb-8 shadow-2xl"
            initial={{ y: 400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 30,
            }}
          >
            <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-gray-300" />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Ngày {day}
                </h2>

                {!editable && (
                  <p className="mt-1 text-xs text-gray-500">
                    🔒 Ngày này đã khóa, chỉ có thể xem.
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="text-2xl text-gray-400 transition hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={!editable}
                onClick={() => onToggle("sang")}
                className={`w-full rounded-2xl border px-5 py-4 text-left font-medium transition-all ${
                  data.sang
                    ? "border-[#EBCB5A] bg-[#F2D77A] text-gray-800"
                    : "border-[#F5E8BF] bg-white"
                } ${
                  !editable
                    ? "cursor-not-allowed opacity-70"
                    : "active:scale-[0.98]"
                }`}
              >
                ☀️ Sáng
              </button>

              <button
                type="button"
                disabled={!editable}
                onClick={() => onToggle("trua")}
                className={`w-full rounded-2xl border px-5 py-4 text-left font-medium transition-all ${
                  data.trua
                    ? "border-[#EBCB5A] bg-[#F2D77A] text-gray-800"
                    : "border-[#F5E8BF] bg-white"
                } ${
                  !editable
                    ? "cursor-not-allowed opacity-70"
                    : "active:scale-[0.98]"
                }`}
              >
                🍚 Trưa
              </button>

              <button
                type="button"
                disabled={!editable}
                onClick={() => onToggle("toi")}
                className={`w-full rounded-2xl border px-5 py-4 text-left font-medium transition-all ${
                  data.toi
                    ? "border-[#EBCB5A] bg-[#F2D77A] text-gray-800"
                    : "border-[#F5E8BF] bg-white"
                } ${
                  !editable
                    ? "cursor-not-allowed opacity-70"
                    : "active:scale-[0.98]"
                }`}
              >
                🌙 Tối
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-[#F2D77A] py-4 font-semibold text-gray-800 transition hover:bg-[#EBCB5A]"
            >
              {editable ? "Xong" : "Đóng"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}