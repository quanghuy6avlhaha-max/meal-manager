import { NextResponse } from "next/server";
import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu ID tài khoản",
        },
        {
          status: 400,
        }
      );
    }

    const userRef = adminDb
      .collection("users")
      .doc(id);

    const userDoc = await userRef.get();

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

    if (data.role === "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Không thể xóa tài khoản Admin",
        },
        {
          status: 403,
        }
      );
    }

    const email =
      `${data.username}@mealmanager.app`;

    // Xóa Authentication (nếu tồn tại)
    try {
      const authUser =
        await adminAuth.getUserByEmail(email);

      await adminAuth.deleteUser(
        authUser.uid
      );
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        throw error;
      }
    }

    // Xóa Firestore
    await userRef.delete();

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
      "DELETE USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ??
          "Không thể xóa tài khoản",
        code:
          error.code ?? null,
      },
      {
        status: 500,
      }
    );
  }
}