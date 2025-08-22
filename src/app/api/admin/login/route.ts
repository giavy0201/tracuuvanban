import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // Hoặc dùng jsonwebtoken nếu bạn chọn Cách 1
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-very-secure-secret-key-1234567890"
);

export async function POST(req: Request) {
  try {
    console.log("POST /api/admin/login called");
    console.log("JWT_SECRET in API route:", process.env.JWT_SECRET || "your-very-secure-secret-key-1234567890");
    const { username, password } = await req.json();

    const admin = await prisma.admins.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ message: "Người dùng không tồn tại" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ message: "Sai mật khẩu" }, { status: 401 });
    }

    const token = await new SignJWT({ id: admin.id, username: admin.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(JWT_SECRET);

    const res = NextResponse.json({ message: "Đăng nhập thành công" });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 2 * 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("Cookie set:", res.cookies.get("admin_token"));
    return res;
  } catch (err) {
    console.error("Error in login:", err);
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 });
  }
}