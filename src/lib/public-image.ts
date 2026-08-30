import { existsSync } from "fs";
import path from "path";

/** Public folder image that is actually on disk. */
export function publicImageExists(src: string): boolean {
  const relative = src.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", relative));
}

export function existingImages<T extends { src: string }>(items: T[]): T[] {
  return items.filter((item) => publicImageExists(item.src));
}

export function serviceImageSrc(slug: string, imagePath?: string | null): string | null {
  const candidate = imagePath?.trim() || `/images/services/${slug}.jpg`;
  return publicImageExists(candidate) ? candidate : null;
}
