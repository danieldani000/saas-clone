import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const workspace = await db.workspace.create({
    data: {
      name: body.name
    }
  });

  return NextResponse.json({ data: workspace }, { status: 201 });
}
