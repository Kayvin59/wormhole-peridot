import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { consent } = await request.json();
  const cookieStore = await cookies();
  cookieStore.set("cookie-consent", consent ? "accepted" : "declined", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // maxAge: 60, // Change cookie maxAge
    path: "/",
  });

  return NextResponse.json({ success: true, consent });
}
