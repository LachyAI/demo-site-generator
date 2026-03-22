import { put, list, del } from "@vercel/blob";
import { DemoConfig, demoConfigSchema } from "./types";

const BLOB_PREFIX = "demos/";

export async function saveDemo(config: DemoConfig): Promise<string> {
  const validated = demoConfigSchema.parse(config);
  const json = JSON.stringify(validated, null, 2);
  const blob = await put(`${BLOB_PREFIX}${config.slug}.json`, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function getDemo(slug: string): Promise<DemoConfig | null> {
  try {
    // List all demos and find by slug (more reliable than prefix matching)
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    const target = blobs.find(
      (b) => b.pathname === `${BLOB_PREFIX}${slug}.json`
    );
    if (!target) return null;
    const response = await fetch(target.url, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    return demoConfigSchema.parse(data);
  } catch (e) {
    console.error("getDemo error:", e);
    return null;
  }
}

export async function listDemos(): Promise<
  { slug: string; url: string; createdAt: string }[]
> {
  const { blobs } = await list({ prefix: BLOB_PREFIX });
  return blobs.map((blob) => ({
    slug: blob.pathname.replace(BLOB_PREFIX, "").replace(".json", ""),
    url: blob.url,
    createdAt: blob.uploadedAt.toISOString(),
  }));
}

export async function deleteDemo(slug: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.json` });
    if (blobs.length === 0) return false;
    await del(blobs[0].url);
    return true;
  } catch {
    return false;
  }
}
