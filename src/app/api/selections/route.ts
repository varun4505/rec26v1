import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

// GET - Fetch user's current selections
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get application with selections
    const application = await prisma.application.findUnique({
      where: { email: session.user.email },
      include: { 
        selections: true,
        domainSubmissions: true 
      },
    });

    if (!application) {
      return NextResponse.json({
        success: true,
        selections: [],
        selectionCount: 0,
        maxSelections: 3,
      });
    }

    // Get recruitment config for deadlines
    const config = await prisma.recruitmentConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    const now = new Date();
    const canModifySelections = config 
      ? now < new Date(config.selectionDeadline)
      : true; // Allow if no config exists

    return NextResponse.json({
      success: true,
      selections: application.selections,
      selectionCount: application.selections.length,
      maxSelections: config?.maxSelections || 3,
      canModifySelections,
      deadlines: config ? {
        selection: config.selectionDeadline,
        round1: config.round1Deadline,
        round2: config.round2Deadline,
      } : null,
      submissions: application.domainSubmissions,
    });
  } catch (error) {
    console.error("Error fetching selections:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch selections" },
      { status: 500 }
    );
  }
}

// POST - Add or update domain selection
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { domain, subdomain } = body;

    if (!domain) {
      return NextResponse.json(
        { success: false, error: "Domain is required" },
        { status: 400 }
      );
    }

    // Check if selection deadline has passed
    const config = await prisma.recruitmentConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    if (config && new Date() > new Date(config.selectionDeadline)) {
      return NextResponse.json(
        { success: false, error: "Selection deadline has passed" },
        { status: 403 }
      );
    }

    const maxSelections = config?.maxSelections || 3;

    // Get or create application
    let application = await prisma.application.findUnique({
      where: { email: session.user.email },
      include: { selections: true },
    });

    if (!application) {
      // Create application if doesn't exist
      application = await prisma.application.create({
        data: {
          name: session.user.name || "",
          email: session.user.email,
          regNo: session.user.email.split("@")[0].toUpperCase(),
          phone: "0000000000", // Placeholder
        },
        include: { selections: true },
      });
    }

    // Check if selection already exists
    const existingSelection = application.selections.find(
      (sel: any) =>
        sel.domain === domain &&
        (subdomain ? sel.subdomain === subdomain : sel.subdomain === null)
    );

    if (existingSelection) {
      return NextResponse.json({
        success: true,
        message: "Selection already exists",
        selection: existingSelection,
      });
    }

    // Check max selections limit
    if (application.selections.length >= maxSelections) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${maxSelections} domain/subdomain selections allowed`,
        },
        { status: 400 }
      );
    }

    // Create new selection
    const selection = await prisma.domainSelection.create({
      data: {
        applicationId: application.id,
        domain,
        subdomain: subdomain || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Selection added successfully",
      selection,
      selectionCount: application.selections.length + 1,
    });
  } catch (error) {
    console.error("Error adding selection:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add selection" },
      { status: 500 }
    );
  }
}

// DELETE - Remove domain selection
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const subdomain = searchParams.get("subdomain");

    if (!domain) {
      return NextResponse.json(
        { success: false, error: "Domain is required" },
        { status: 400 }
      );
    }

    // Check if selection deadline has passed
    const config = await prisma.recruitmentConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    if (config && new Date() > new Date(config.selectionDeadline)) {
      return NextResponse.json(
        { success: false, error: "Selection deadline has passed" },
        { status: 403 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { email: session.user.email },
      include: { 
        selections: true,
        domainSubmissions: true 
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if user has already submitted for this domain/subdomain
    const hasSubmission = application.domainSubmissions.some(
      (sub: any) =>
        sub.domain === domain &&
        (subdomain === "none" || !subdomain
          ? sub.subdomain === null
          : sub.subdomain === subdomain)
    );

    if (hasSubmission) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot remove selection after submission. Contact admin to change.",
        },
        { status: 400 }
      );
    }

    // Find and delete the selection
    const selection = application.selections.find(
      (sel: any) =>
        sel.domain === domain &&
        (subdomain === "none" || !subdomain
          ? sel.subdomain === null
          : sel.subdomain === subdomain)
    );

    if (!selection) {
      return NextResponse.json(
        { success: false, error: "Selection not found" },
        { status: 404 }
      );
    }

    await prisma.domainSelection.delete({
      where: { id: selection.id },
    });

    return NextResponse.json({
      success: true,
      message: "Selection removed successfully",
      selectionCount: application.selections.length - 1,
    });
  } catch (error) {
    console.error("Error removing selection:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove selection" },
      { status: 500 }
    );
  }
}
