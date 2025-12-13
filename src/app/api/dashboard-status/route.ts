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

        // Get application with submissions
        const application = await prisma.application.findUnique({
            where: { email: session.user.email },
            include: {
                domainSubmissions: true,
            },
        });

        if (!application) {
            return NextResponse.json({
                success: true,
                round1Passed: false,
                round2Passed: false,
            });
        }

        // Check if any submission is passed for Round 1 and Round 2
        const round1Passed = application.domainSubmissions.some(
            (sub) => sub.round === "round1" && sub.isPassed
        );

        const round2Passed = application.domainSubmissions.some(
            (sub) => sub.round === "round2" && sub.isPassed
        );

        return NextResponse.json({
            success: true,
            round1Passed,
            round2Passed,
        });
    } catch (error) {
        console.error("Error fetching dashboard status:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch status" },
            { status: 500 }
        );
    }
}
