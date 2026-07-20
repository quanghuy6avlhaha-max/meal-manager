"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { getUsers, UserData } from "@/lib/users";
import { getAdminMeals, AdminMealData } from "@/lib/adminMeals";
import { listenAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import EditUserModal from "../components/EditUserModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import MealReport from "../components/MealReport";
import MealStatistics from "../components/MealStatistics";
import Menu from "../components/Menu";

export default function Admin() {

  const router = useRouter();

  const [users, setUsers] =
    useState<UserData[]>([]);

  const [filteredUsers, setFilteredUsers] =
    useState<UserData[]>([]);

  const [mealReport, setMealReport] =
    useState<AdminMealData[]>([]);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [editUser, setEditUser] =
    useState<UserData | null>(null);

  const [resetUser, setResetUser] =
    useState<UserData | null>(null);

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
            doc(
              db,
              "users",
              username
            )
          );

        if (
          !userSnap.exists() ||
          userSnap.data().role !== "admin"
        ) {
          router.replace("/dashboard");
          return;
        }

        loadData();

      });

    return () => unsubscribe();

  }, [router]);
    async function loadData() {

    try {

      setLoading(true);

      const usersData =
        await getUsers();

      setUsers(usersData);
      setFilteredUsers(usersData);

      const meals =
        await getAdminMeals();

      setMealReport(meals);

      console.log(
        "MEALS ADMIN:",
        meals
      );

    } catch (error) {

      console.error(error);

      alert(
        "Không thể tải dữ liệu Admin"
      );

    } finally {

      setLoading(false);

    }

  }

  function handleSearch(
    value: string
  ) {

    setSearch(value);

    setFilteredUsers(

      users.filter((user) =>

        user.username
          .toLowerCase()
          .includes(
            value.toLowerCase()
          )

      )

    );

  }

  function getReportByDate() {

    if (!selectedDate) {
      return [];
    }

    const [year, month, day] =
      selectedDate.split("-");

    const firestoreDate =
      `${Number(year)}-${Number(month)}-${Number(day)}`;

    return mealReport
      .map((user) => {

        const meal =
          user.meals.find(
            (item) =>
              item.id === firestoreDate
          );

        return {

          name: user.displayName,

          username: user.username,

          sang: meal?.sang,

          trua: meal?.trua,

          toi: meal?.toi,

        };

      })
      .filter(

        (item) =>

          item.sang ||
          item.trua ||
          item.toi

      );

  }

  async function copyReport() {

    const report =
      getReportByDate();

    const sang =
      report
        .filter((item) => item.sang)
        .map((item) => item.name);

    const trua =
      report
        .filter((item) => item.trua)
        .map((item) => item.name);

    const toi =
      report
        .filter((item) => item.toi)
        .map((item) => item.name);

    const [year, month, day] =
      selectedDate.split("-");

    const text =
`Ngày ${day}/${month}/${year}

Sáng (${sang.length}): ${sang.join(", ") || "Không có"}
Trưa (${trua.length}): ${trua.join(", ") || "Không có"}
Tối (${toi.length}): ${toi.join(", ") || "Không có"}`;

    await navigator.clipboard.writeText(text);

    alert("Đã copy báo cáo.");

  }

  async function deleteUser(
    user: UserData
  ) {

    if (user.role === "admin") {

      alert(
        "Không thể xóa tài khoản admin"
      );

      return;

    }

    const confirm1 =
      window.confirm(
        `Xóa tài khoản ${user.username}?`
      );

    if (!confirm1) return;

    const confirm2 =
      window.confirm(
        "Xác nhận lần cuối?"
      );

    if (!confirm2) return;

    try {

      const res =
        await fetch(
          "/api/users/delete",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: user.id,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok || !data.success) {

        alert(
          data.error ??
          "Không thể xóa tài khoản"
        );

        return;

      }

      await loadData();

    } catch (error) {

      console.error(error);

      alert(
        "Không thể kết nối đến máy chủ"
      );

    }

  }

  function getMonthStatistics() {

    if (!selectedMonth) {
      return [];
    }

    return mealReport.map((user) => {

      let sang = 0;
      let trua = 0;
      let toi = 0;

      user.meals.forEach((meal) => {

        const [year, month] =
          selectedMonth.split("-");

        const monthKey =
          `${year}-${Number(month)}`;

        if (
          meal.id.startsWith(monthKey)
        ) {

          if (meal.sang) sang++;
          if (meal.trua) trua++;
          if (meal.toi) toi++;

        }

      });

      return {

        name: user.displayName,

        username: user.username,

        sang,

        trua,

        toi,

      };

    });

  }
    return (

    <main className="min-h-screen bg-[#FFFDF7]">

      <div className="mx-auto max-w-5xl px-5 py-6">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <Menu />

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                Quản trị hệ thống
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Quản lý tài khoản và báo cáo cơm
              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-[#F5E8BF] bg-[#FFF7DA] px-5 py-3 text-right shadow-sm">

            <div className="text-xs text-gray-500">
              Version
            </div>

            <div className="font-semibold text-gray-800">
              Mark1 1.0
            </div>

          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#F5E8BF] bg-white p-6 shadow-sm"
        >

          <div className="flex flex-col gap-4 md:flex-row">

            <input
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              placeholder="Tìm username..."
              className="flex-1 rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-5 py-3 outline-none transition focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
            />

            <button
              onClick={() =>
                router.push("/admin/create-user")
              }
              className="rounded-2xl bg-[#F2D77A] px-6 py-3 font-semibold text-gray-800 transition hover:bg-[#EBCB5A] active:scale-95"
            >
              + Tạo tài khoản
            </button>

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 rounded-3xl border border-[#F5E8BF] bg-white shadow-sm overflow-hidden"
        >

          <table className="w-full">

            <thead className="bg-[#F2D77A] text-gray-800">

              <tr>

                <th className="p-4 w-16">
                  STT
                </th>

                <th className="p-4 text-left">
                  Username
                </th>

                <th className="p-4 text-left">
                  Họ tên
                </th>

                <th className="p-4 w-40">
                  Thao tác
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user, index) => (

                <tr
                  key={user.id}
                  className="border-b border-[#F7F1DA] hover:bg-[#FFFDF5] transition"
                >

                  <td className="p-4 text-center font-semibold">
                    {index + 1}
                  </td>

                  <td className="p-4 font-medium">
                    {user.username}
                  </td>

                  <td className="p-4">
                    {user.displayName}
                  </td>

                  <td className="p-4">

                    {user.role !== "admin" && (

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            setEditUser(user)
                          }
                          className="rounded-xl bg-[#FFF3CC] px-3 py-2 transition hover:scale-105"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            setResetUser(user)
                          }
                          className="rounded-xl bg-[#FFF3CC] px-3 py-2 transition hover:scale-105"
                        >
                          🔑
                        </button>

                        <button
                          onClick={() =>
                            deleteUser(user)
                          }
                          className="rounded-xl bg-red-50 px-3 py-2 transition hover:scale-105"
                        >
                          🗑️
                        </button>

                      </div>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </motion.div>
                <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-3xl border border-[#F5E8BF] bg-white p-6 shadow-sm"
        >

          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            Báo cáo cơm
          </h2>

          <div className="flex flex-col gap-4 md:flex-row">

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 outline-none focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
            />

            <button
              onClick={copyReport}
              className="rounded-2xl bg-[#F2D77A] px-6 py-3 font-semibold text-gray-800 transition hover:bg-[#EBCB5A] active:scale-95"
            >
              📋 Copy gửi Zalo
            </button>

          </div>

          <div className="mt-6">

            <MealReport
              data={
                getReportByDate()
              }
            />

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-3xl border border-[#F5E8BF] bg-white p-6 shadow-sm"
        >

          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            Thống kê tháng
          </h2>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(
                e.target.value
              )
            }
            className="rounded-2xl border border-[#F3E3A3] bg-[#FFFDF7] px-4 py-3 outline-none focus:border-[#EBCB5A] focus:ring-2 focus:ring-[#F7E7A7]"
          />

          <div className="mt-6">

            <MealStatistics
              month={
                selectedMonth
              }
              data={
                getMonthStatistics()
              }
            />

          </div>

        </motion.div>
              {editUser && (

        <EditUserModal
          user={editUser}
          onClose={() =>
            setEditUser(null)
          }
          onSuccess={() => {

            setEditUser(null);

            loadData();

          }}
        />

      )}

      {resetUser && (

        <ResetPasswordModal
          user={resetUser}
          onClose={() =>
            setResetUser(null)
          }
          onSuccess={() => {

            setResetUser(null);

            alert(
              "Reset mật khẩu thành công"
            );

          }}
        />

      )}

    </div>

  </main>

);
}