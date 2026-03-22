import { NextRequest, NextResponse } from "next/server";
import { getDemo, deleteDemo } from "@/lib/blob";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const demo = await getDemo(slug);
  if (!demo) {
    return NextResponse.json({ error: "Demo not found" }, { status: 404 });
  }
  return NextResponse.json(demo);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deleted = await deleteDemo(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Demo not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
