import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received reflection:", body);
  return NextResponse.json({ message: "Reflection received ✅", body });
}
