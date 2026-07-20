import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = String(body.id ?? "").trim();
    const displayName = String(body.displayName ?? "").trim();

    if (!id || !displayName) {
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

    await userRef.update({
      displayName,
    });

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message ?? "Không thể cập nhật tài khoản",
        code: error.code ?? null,
      },
      {
        status: 500,
      }
    );
  }
}