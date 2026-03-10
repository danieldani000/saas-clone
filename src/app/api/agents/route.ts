export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const agents = await db.agent.findMany({ where: { active: true } });
  return NextResponse.json({ data: agents });
}
