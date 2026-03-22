const CDN_BASE = "https://cdn.opscorescale.com/demo-images";

export const SERVICE_IMAGES: Record<string, string[]> = {
  "fence-deck": [`${CDN_BASE}/fence-deck-1.jpg`, `${CDN_BASE}/fence-deck-2.jpg`],
  "gyprock": [`${CDN_BASE}/gyprock-1.jpg`, `${CDN_BASE}/gyprock-2.jpg`],
  "door-lock": [`${CDN_BASE}/door-lock-1.jpg`, `${CDN_BASE}/door-lock-2.jpg`],
  "flatpack": [`${CDN_BASE}/flatpack-1.jpg`, `${CDN_BASE}/flatpack-2.jpg`],
  "painting": [`${CDN_BASE}/painting-1.jpg`, `${CDN_BASE}/painting-2.jpg`],
  "silicone": [`${CDN_BASE}/silicone-1.jpg`, `${CDN_BASE}/silicone-2.jpg`],
  "pressure-clean": [`${CDN_BASE}/pressure-clean-1.jpg`, `${CDN_BASE}/pressure-clean-2.jpg`],
  "hanging": [`${CDN_BASE}/hanging-1.jpg`, `${CDN_BASE}/hanging-2.jpg`],
  "cabinet": [`${CDN_BASE}/cabinet-1.jpg`, `${CDN_BASE}/cabinet-2.jpg`],
  "maintenance": [`${CDN_BASE}/maintenance-1.jpg`, `${CDN_BASE}/maintenance-2.jpg`],
  "tiling": [`${CDN_BASE}/tiling-1.jpg`, `${CDN_BASE}/tiling-2.jpg`],
  "outdoor": [`${CDN_BASE}/outdoor-1.jpg`, `${CDN_BASE}/outdoor-2.jpg`],
};

export function getGalleryImages(serviceIds: string[]): { src: string; caption: string }[] {
  const images: { src: string; caption: string }[] = [];
  for (const id of serviceIds) {
    const srcs = SERVICE_IMAGES[id] || [];
    const serviceName = id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    srcs.forEach((src, i) => {
      images.push({ src, caption: `${serviceName} — Project ${i + 1}` });
    });
  }
  return images.slice(0, 6);
}

export function getServiceImage(serviceId: string): string {
  const srcs = SERVICE_IMAGES[serviceId];
  return srcs?.[0] || `${CDN_BASE}/placeholder.jpg`;
}
