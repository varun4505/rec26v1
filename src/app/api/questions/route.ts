import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const subdomain = searchParams.get("subdomain");
    const round = searchParams.get("round");

    if (!domain || !round) {
      return NextResponse.json(
        { success: false, error: "Domain and round are required" },
        { status: 400 }
      );
    }

    const where: any = {
      active: true,
      domain,
      round,
    };

    // Handle subdomain - if "none", look for null subdomain
    if (subdomain && subdomain !== "none") {
      where.subdomain = subdomain;
    } else if (subdomain === "none") {
      where.subdomain = null;
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        text: true,
        type: true,
        options: true,
        meta: true,
        isOptional: true,
      },
    });

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
