import { NextRequest, NextResponse } from "next/server";
import { saveDemo, listDemos } from "@/lib/blob";
import { demoConfigSchema } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const demos = await listDemos();
  return NextResponse.json(demos);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.slug && body.businessName) {
      body.slug = generateSlug(body.businessName);
    }

    if (!body.tagline && body.businessName && body.suburb) {
      body.tagline = `Reliable ${body.businessName} in ${body.suburb}`;
    }

    body.createdAt = new Date().toISOString();

    const config = demoConfigSchema.parse(body);
    const blobUrl = await saveDemo(config);

    return NextResponse.json({
      slug: config.slug,
      demoUrl: `/demo/${config.slug}`,
      blobUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid config" },
      { status: 400 }
    );
  }
}
