// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { DOMAIN_CONFIG } from "@/data/domainConfig";

// Disable caching for this route to ensure students always see fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        if (round1Sub.isPassed === false) {
          // Failed - regardless of submission status
          round1Status = "Not Passed";
        } else if (round1Sub.isPassed === true) {
          round1Status = "Passed";
          canAccessRound2 = true;
        } else if (round1Sub.submittedAt) {
          // If submitted but not yet evaluated, show "Under Review"
          round1Status = "Under Review";
        } else {
          round1Status = "Pending";
        }
      }

      if (round2Sub) {
        if (round2Sub.isPassed === false) {
          // Failed - regardless of submission status
          round2Status = "Not Passed";
        } else if (round2Sub.isPassed === true) {
          round2Status = "Passed";
        } else if (round2Sub.submittedAt) {
          // If submitted but not yet evaluated, show "Under Review"
          round2Status = "Under Review";
        } else {
          round2Status = "Pending";
        }
      } else if (canAccessRound2) {
        round2Status = "Pending";
      }

      return {
        domain,
        subdomain,
        round1Status,
        round2Status,
        canAccessRound2,
      };
    });

    const response = NextResponse.json({
      success: true,
      applications,
    });
    
    // Set cache control headers to prevent browser caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
