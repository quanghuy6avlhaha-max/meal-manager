import { NextResponse } from "next/server";
import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = String(body.id ?? "").trim();
    const password = String(body.password ?? "").trim();

    if (!id || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu thông tin",
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

    const userDoc = await adminDb
      .collection("users")
      .doc(id)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Tài khoản không tồn tại",
        },
        {
          status: 404,
        }
      );
    }

    const data = userDoc.data();

    if (!data?.username) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu Username",
        },
        {
          status: 500,
        }
      );
    }

    const email =
      `${data.username}@mealmanager.app`;

    const authUser =
      await adminAuth.getUserByEmail(email);

    await adminAuth.updateUser(
      authUser.uid,
      {
        password,
      }
    );

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ??
          "Không thể đổi mật khẩu",
        code:
          error.code ?? null,
      },
      {
        status: 500,
      }
    );
  }
}