import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { withSecurityHeaders } from "@/lib/security/headers";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return withSecurityHeaders(NextResponse.json({ status: "ok", db: "ok", ts: new Date().toISOString() }));
  } catch (error) {
    return withSecurityHeaders(
      NextResponse.json(
        {
          status: "degraded",
          db: "error",
          error: error instanceof Error ? error.message : "unknown",
          ts: new Date().toISOString()
        },
        { status: 503 }
      )
    );
  }
}
