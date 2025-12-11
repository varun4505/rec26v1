// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { DOMAIN_CONFIG } from "@/data/domainConfig";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get application with selections and submissions
    const application = await prisma.application.findUnique({
      where: { email: session.user.email },
      include: {
        selections: true,
        domainSubmissions: true,
      },
    });

    console.log('Profile API - User email:', session.user.email);
    console.log('Profile API - Application found:', application ? 'Yes' : 'No');
    console.log('Profile API - Selections count:', application?.selections?.length || 0);

    if (!application) {
      return NextResponse.json({
        success: true,
        applications: [],
      });
    }

    // Build applications array from selections
    const applications = application.selections.map((selection) => {
      const domain = selection.domain;
      const subdomain = selection.subdomain;

      // Find Round 1 submission
      const round1Sub = application.domainSubmissions.find(
        (sub) =>
          sub.domain === domain &&
          sub.subdomain === subdomain &&
          sub.round === "round1"
      );

      // Find Round 2 submission
      const round2Sub = application.domainSubmissions.find(
        (sub) =>
          sub.domain === domain &&
          sub.subdomain === subdomain &&
          sub.round === "round2"
      );

      // Determine statuses
      let round1Status = "Pending";
      let round2Status = null;
      let canAccessRound2 = false;

      if (round1Sub) {
        if (round1Sub.isPassed === true) {
          round1Status = "Passed";
          canAccessRound2 = true;
        } else if (round1Sub.submittedAt) {
          // If submitted but not yet evaluated, show "Submitted"
          round1Status = "Submitted";
        } else if (round1Sub.isPassed === false && !round1Sub.submittedAt) {
          round1Status = "Not Passed";
        } else {
          round1Status = "Under Review";
        }
      }

      if (round2Sub) {
        if (round2Sub.isPassed === true) {
          round2Status = "Passed";
        } else if (round2Sub.submittedAt) {
          // If submitted but not yet evaluated, show "Submitted"
          round2Status = "Submitted";
        } else if (round2Sub.isPassed === false && !round2Sub.submittedAt) {
          round2Status = "Not Passed";
        } else {
          round2Status = "Under Review";
        }
      } else if (canAccessRound2) {
        round2Status = "Pending";
      }

      return {
        domain,
        subdomain,
        round1Status,
        round1Feedback: round1Sub?.feedback || null,
        round2Status,
        round2Feedback: round2Sub?.feedback || null,
        canAccessRound2,
      };
    });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
