import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const hasConsent = cookieStore.has("cookie-consent");
  return NextResponse.json({ hasConsent });
}
