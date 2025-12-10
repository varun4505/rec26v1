import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { validateDomainSubmission, type DomainType, type RoundType } from "@/data/domainConfig";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
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

    // Validate domain/subdomain/round combination
    const validation = validateDomainSubmission(
      domain as DomainType,
      subdomain === "none" ? null : subdomain,
      round as RoundType
    );

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Find the user's application
    const application = await prisma.application.findUnique({
      where: { email: session.user.email },
      include: { domainSubmissions: true },
    });

    if (!application) {
      // User hasn't submitted anything yet - allow Round 1
      if (round === "round1") {
        return NextResponse.json({
          success: true,
          canAccess: true,
          reason: "Round 1 is open for new applicants",
        });
      } else {
        return NextResponse.json({
          success: true,
          canAccess: false,
          reason: "You must complete Round 1 first",
        });
      }
    }

    // Check if user has already submitted for this specific domain/subdomain/round
    const existingSubmission = application.domainSubmissions.find(
      (sub: any) =>
        sub.domain === domain &&
        (subdomain === "none" ? sub.subdomain === null : sub.subdomain === subdomain) &&
        sub.round === round
    );

    if (existingSubmission) {
      return NextResponse.json({
        success: true,
        canAccess: false,
        reason: "You have already submitted this round",
        submission: {
          isPassed: existingSubmission.isPassed,
          feedback: existingSubmission.feedback,
          submittedAt: existingSubmission.submittedAt,
        },
      });
    }

    // For Round 2, check if Round 1 is passed
    if (round === "round2") {
      const round1Submission = application.domainSubmissions.find(
        (sub: any) =>
          sub.domain === domain &&
          (subdomain === "none" ? sub.subdomain === null : sub.subdomain === subdomain) &&
          sub.round === "round1"
      );

      if (!round1Submission) {
        return NextResponse.json({
          success: true,
          canAccess: false,
          reason: "You must complete Round 1 first",
        });
      }

      if (!round1Submission.isPassed) {
        return NextResponse.json({
          success: true,
          canAccess: false,
          reason: "You must pass Round 1 to access Round 2",
          round1Status: {
            isPassed: false,
            feedback: round1Submission.feedback,
          },
        });
      }

      // Round 1 is passed, allow Round 2
      return NextResponse.json({
        success: true,
        canAccess: true,
        reason: "Round 1 passed - Round 2 is now accessible",
      });
    }

    // For Round 1, always allow access if not already submitted
    return NextResponse.json({
      success: true,
      canAccess: true,
      reason: "Round 1 is accessible",
    });
  } catch (error) {
    console.error("Error checking round access:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check round access" },
      { status: 500 }
    );
  }
}
