import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const subdomain = searchParams.get("subdomain");
    const round = searchParams.get("round");

    if (!domain || !round) {
      return NextResponse.json(
        { success: false, error: "domain and round are required" },
        { status: 400 }
      );
    }

    const whereClause: any = {
      domain,
      round,
      active: true,
    };

    // Handle subdomain: if "none", search for null; otherwise, match the value
    if (subdomain === "none") {
      whereClause.subdomain = null;
    } else if (subdomain) {
      whereClause.subdomain = subdomain;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch tasks";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
