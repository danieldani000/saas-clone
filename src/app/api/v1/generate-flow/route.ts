import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api/response";
import { executeAgent } from "@/lib/providers/engine";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const brief = String(body.brief || "").trim();
  if (!brief) return fail("brief is required", 400);

  const [text, image, video] = await Promise.all([
    executeAgent("ugc-script", { productName: brief, usps: ["fast", "high-converting"], provider: body.textProvider }),
    executeAgent("product-image", { productName: brief, style: "ad creative", provider: body.imageProvider }),
    executeAgent("kling-video", { brief, duration: "8s", provider: body.videoProvider })
  ]);

  return ok({ text: text.data, image: image.data, video: video.data });
}
