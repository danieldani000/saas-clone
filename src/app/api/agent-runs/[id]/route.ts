import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const run = await db.agentRun.findUnique({
    where: { id: params.id },
    include: { steps: true, outputs: true }
  });

  if (!run) return NextResponse.json({ error: "Run not found" }, { status: 404 });

  return NextResponse.json({ data: run });
}
