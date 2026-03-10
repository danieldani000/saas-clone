import { NextResponse } from "next/server";
import { withSecurityHeaders } from "@/lib/security/headers";

export function ok(data: unknown, status = 200) {
  return withSecurityHeaders(NextResponse.json({ data }, { status }));
}

export function fail(message: string, status = 400) {
  return withSecurityHeaders(NextResponse.json({ error: message }, { status }));
}
