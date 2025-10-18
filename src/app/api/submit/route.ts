import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { validateAnswersList, type AnswersList } from '@/lib/domainAnswers'

interface BasicInfo {
  name: string;
  registrationNumber: string;
  mobileNumber: string;
}

interface DomainData {
  domain: 'technical' | 'management' | 'design'
  data: {
    // Ordered list of Q&A items. Each item: { id?: string, question?: string, answer: string|number|boolean|string[] }
    answers: AnswersList | unknown
  }
}

interface SubmissionRequest {
  basicInfo: BasicInfo;
  domains: DomainData[];
}

// Quick check to see if already submitted
export async function GET() {
  try {
  const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const existingApplication = await prisma.application.findUnique({ where: { email: session.user.email } })

    return NextResponse.json({
      success: true,
      hasSubmitted: !!existingApplication,
    });
  } catch (error) {
    console.error("Error checking submission status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check submission status" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
  const session = await getServerSession(authOptions)
    if (!session?.user?.email?.endsWith("@vitstudent.ac.in")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Only VIT students can submit applications.",
        },
        { status: 401 },
      );
    }

    const body = (await req.json()) as SubmissionRequest
    const { basicInfo, domains } = body

    // Validate basic info
    if (
      !basicInfo.name ||
      !basicInfo.registrationNumber ||
      !basicInfo.mobileNumber
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required basic information" },
        { status: 400 },
      );
    }

    // Validate registration number format
    const regNoRegex = /^2[2-5][A-Z]{3}\d{4}$/; //TODO: Verify!!
    if (!regNoRegex.test(basicInfo.registrationNumber)) {
      return NextResponse.json(
        { success: false, error: "Invalid registration number format" },
        { status: 400 },
      );
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(basicInfo.mobileNumber)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number" },
        { status: 400 },
      );
    }

    // Validate domain answers and prepare create payload
    if (!Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one domain submission is required' },
        { status: 400 }
      )
    }

    // Prevent duplicate submission
    const existing = await prisma.application.findUnique({ where: { email: session.user.email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Application already submitted for this account' },
        { status: 409 }
      )
    }

    // Validate domain answers and prepare create payload
    const seenDomains = new Set<string>()
    const domainCreates: { domain: string; answers: AnswersList }[] = []
    for (const domainItem of domains) {
      if (!domainItem?.domain || !domainItem?.data) {
        return NextResponse.json(
          { success: false, error: 'Each domain must include a domain key and data.answers' },
          { status: 400 }
        )
      }
      if (seenDomains.has(domainItem.domain)) {
        return NextResponse.json(
          { success: false, error: `Duplicate domain provided: ${domainItem.domain}` },
          { status: 400 }
        )
      }
      seenDomains.add(domainItem.domain)

      try {
        const validated = validateAnswersList(domainItem.data.answers)
        domainCreates.push({ domain: domainItem.domain, answers: validated })
      } catch (err) {
        return NextResponse.json(
          { success: false, error: `Invalid answers for domain ${domainItem.domain}: ${String(err)}` },
          { status: 400 }
        )
      }
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        name: basicInfo.name,
        regNo: basicInfo.registrationNumber,
        email: session.user.email,
        phone: basicInfo.mobileNumber,
        domainSubmissions: { create: domainCreates },
      },
      include: { domainSubmissions: true },
    })

    return NextResponse.json({ success: true, data: application });
  } catch (error: any) {
    // Map known Prisma unique constraint error to 409
    const message = typeof error?.message === 'string' ? error.message : 'Failed to submit application'
    const isConflict = message.includes('Unique') || message.includes('unique') || message.includes('duplicate')
    console.error('Submission error:', error)
    return NextResponse.json(
      { success: false, error: message },
      { status: isConflict ? 409 : 500 }
    )
  }
}
