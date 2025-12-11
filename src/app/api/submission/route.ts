// src/app/api/submission/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const subdomain = searchParams.get("subdomain");
    const round = searchParams.get("round");

    if (!domain || !round) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get application
    const application = await prisma.application.findUnique({
      where: { email: session.user.email },
      include: {
        domainSubmissions: true,
      },
    });

    if (!application) {
      return NextResponse.json({
        success: true,
        submission: null,
      });
    }

    // Find the specific submission
    const subdomainValue = subdomain === "none" ? null : subdomain;
    const submission = application.domainSubmissions.find(
      (sub) =>
        sub.domain === domain &&
        sub.subdomain === subdomainValue &&
        sub.round === round
    );

    if (!submission) {
      return NextResponse.json({
        success: true,
        submission: null,
      });
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        domain: submission.domain,
        subdomain: submission.subdomain,
        round: submission.round,
        answers: submission.answers,
        submissionUrl: submission.submissionUrl,
        submittedAt: submission.submittedAt,
        isPassed: submission.isPassed,
        feedback: submission.feedback,
      },
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}
