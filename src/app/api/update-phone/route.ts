// src/app/api/update-phone/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

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
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate phone number format (Indian 10-digit number starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Get or create application
    let application = await prisma.application.findUnique({
      where: { email: session.user.email },
    });

    if (!application) {
      // Create application if doesn't exist
      application = await prisma.application.create({
        data: {
          name: session.user.name || "",
          email: session.user.email,
          regNo: session.user.email.split("@")[0].toUpperCase(),
          phone: phoneNumber,
        },
      });
    } else {
      // Update existing application
      application = await prisma.application.update({
        where: { email: session.user.email },
        data: { phone: phoneNumber },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Phone number updated successfully",
      phone: application.phone,
    });
  } catch (error) {
    console.error("Error updating phone number:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update phone number" },
      { status: 500 }
    );
  }
}

// GET - Check if user has provided phone number
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { email: session.user.email },
      select: { phone: true },
    });

    const hasPhone = application && 
      application.phone && 
      application.phone !== "0000000000" && 
      /^[6-9]\d{9}$/.test(application.phone);

    return NextResponse.json({
      success: true,
      hasPhone,
      phone: hasPhone ? application.phone : null,
    });
  } catch (error) {
    console.error("Error checking phone number:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check phone number" },
      { status: 500 }
    );
  }
}
