import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const brandKit = await db.brandKit.upsert({
    where: { workspaceId: body.workspaceId },
    create: {
      workspaceId: body.workspaceId,
      brandName: body.brandName,
      tone: body.tone,
      forbiddenWords: body.forbiddenWords || [],
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      guidelines: body.guidelines
    },
    update: {
      brandName: body.brandName,
      tone: body.tone,
      forbiddenWords: body.forbiddenWords || [],
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      guidelines: body.guidelines
    }
  });

  return NextResponse.json({ data: brandKit }, { status: 201 });
}
