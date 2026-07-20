import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const username = String(body.username ?? "")
      .trim()
      .toLowerCase();

    const displayName = String(body.displayName ?? "")
      .trim();

    const password = String(body.password ?? "")
      .trim();

    // Kiểm tra dữ liệu
    if (!username || !displayName || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu thông tin tài khoản",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[a-z0-9]+$/.test(username)) {
      return NextResponse.json(
        {
          success: false,
          error: "Username chỉ được gồm chữ thường và số",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[0-9]+$/.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Mật khẩu chỉ được dùng số",
        },
        {
          status: 400,
        }
      );
    }

    const userRef = adminDb.collection("users").doc(username);

    // Kiểm tra Firestore
    const docSnap = await userRef.get();

    if (docSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Username đã tồn tại",
        },
        {
          status: 400,
        }
      );
    }

    const email = `${username}@mealmanager.app`;

    // Kiểm tra Authentication
    try {
      await adminAuth.getUserByEmail(email);

      return NextResponse.json(
        {
          success: false,
          error: "Email đã tồn tại",
        },
        {
          status: 400,
        }
      );
    } catch (err: any) {
      if (err.code !== "auth/user-not-found") {
        throw err;
      }
    }

    // Tạo Authentication
    const authUser = await adminAuth.createUser({
      email,
      password,
      displayName,
    });

    try {
      // Ghi Firestore
      await userRef.set({
        uid: authUser.uid,
        username,
        displayName,
        role: "member",
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch (firestoreError) {
      // Nếu Firestore lỗi thì xóa luôn Authentication
      await adminAuth.deleteUser(authUser.uid);
      throw firestoreError;
    }

    return NextResponse.json(
      {
        success: true,
        uid: authUser.uid,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message ?? "Không thể tạo tài khoản",
        code: error.code ?? null,
      },
      {
        status: 500,
      }
    );
  }
}