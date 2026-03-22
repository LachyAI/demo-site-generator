import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { pin } = await request.json();
  const validPin = process.env.ADMIN_PIN || "1234";

  if (pin === validPin) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
}
