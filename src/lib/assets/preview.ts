import type { Prisma } from "@prisma/client";

export function getPreviewFromMetadata(metadata: Prisma.JsonValue | null | undefined) {
  if (!metadata || typeof metadata !== "object") return { kind: "placeholder" as const };

  const m = metadata as Record<string, unknown>;
  const imageUrl = typeof m.imageUrl === "string" ? m.imageUrl : null;
  const videoUrl = typeof m.videoUrl === "string" ? m.videoUrl : null;
  const imageBase64 = typeof m.imageBase64 === "string" ? m.imageBase64 : null;

  if (videoUrl) return { kind: "video" as const, src: videoUrl };
  if (imageUrl) return { kind: "image" as const, src: imageUrl };
  if (imageBase64) return { kind: "image" as const, src: `data:image/png;base64,${imageBase64}` };

  return { kind: "placeholder" as const };
}
