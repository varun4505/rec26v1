import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'
import { validateAnswersList, type AnswersList } from '@/lib/domainAnswers'
import type { Prisma } from '@prisma/client'

interface BasicInfo {
  name: string;
  registrationNumber: string;
  mobileNumber: string;
}

interface DomainData {
  domain: 'technical' | 'management' | 'design'
  subdomain?: string
  round: 'round1' | 'round2'
  data: {
    // Ordered list of Q&A items. Each item: { id?: string, question?: string, answer: string|number|boolean|string[] }
    answers?: AnswersList | unknown
    submissionUrl?: string // For task submissions
    selectedTaskId?: string // For task selection (when choosing between multiple tasks)
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
  const regNoRegex = /^2[2-5][A-Z]{3}\d{4}$/;
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

    // Find existing application (if any). We allow adding domain/subdomain submissions
    const existing = await prisma.application.findUnique({ where: { email: session.user.email } })

    // Validate domain answers and prepare create payload
    const seenDomains = new Set<string>()
    const domainCreates: { domain: string; subdomain?: string; round: string; answers: AnswersList; submissionUrl?: string; selectedTaskId?: string }[] = []
    for (const domainItem of domains) {
      if (!domainItem?.domain || !domainItem?.data || !domainItem?.round) {
        return NextResponse.json(
          { success: false, error: 'Each domain must include a domain key, round, and data' },
          { status: 400 }
        )
      }
      const key = `${domainItem.domain}::${String(domainItem.subdomain ?? '')}::${domainItem.round}`
      if (seenDomains.has(key)) {
        return NextResponse.json(
          { success: false, error: `Duplicate domain/subdomain/round provided: ${domainItem.domain}${domainItem.subdomain ? '/' + domainItem.subdomain : ''}/${domainItem.round}` },
          { status: 400 }
        )
      }
      seenDomains.add(key)

      try {
        // For task submissions, use submissionUrl; for question rounds, use answers
        const submissionUrl = domainItem.data.submissionUrl
        const selectedTaskId = domainItem.data.selectedTaskId
        let validated: AnswersList = []
        
        if (submissionUrl) {
          // Task submission - create a single answer entry with the URL
          validated = [{ answer: submissionUrl }]
        } else if (domainItem.data.answers) {
          // Question submission
          validated = validateAnswersList(domainItem.data.answers)
        }
        
        // For mixed rounds, allow both answers and submissionUrl
        if (domainItem.data.answers && submissionUrl) {
          validated = validateAnswersList(domainItem.data.answers)
        }
        
        if (!submissionUrl && (!domainItem.data.answers || validated.length === 0)) {
          throw new Error('Either answers or submissionUrl is required')
        }
        
        domainCreates.push({ 
          domain: domainItem.domain, 
          subdomain: domainItem.subdomain, 
          round: domainItem.round,
          answers: validated,
          submissionUrl: submissionUrl,
          selectedTaskId: selectedTaskId
        })
      } catch (err) {
        return NextResponse.json(
          { success: false, error: `Invalid data for domain ${domainItem.domain}: ${String(err)}` },
          { status: 400 }
        )
      }
    }
    // If application exists, add or update domain/subdomain/round submissions
    if (existing) {
      // For each create item, check if submission exists and update it, or create new
      for (const item of domainCreates) {
        // find any existing submissions for this applicationId+domain+subdomain+round
        type DSRow = { id: string; applicationId: string; domain: string; subdomain?: string | null; round: string; answers: unknown }
        const candidates = await prisma.domainSubmission.findMany({ 
          where: { 
            applicationId: existing.id, 
            domain: item.domain,
            round: item.round
          } 
        })
        const existingSubmission = (candidates as unknown as DSRow[]).find(
          (c) => c.subdomain === (item.subdomain ?? null) && c.round === item.round
        )
        
        if (existingSubmission) {
          // Update existing submission (allow resubmission)
          await prisma.domainSubmission.update({
            where: { id: existingSubmission.id },
            data: {
              answers: item.answers as unknown as Prisma.InputJsonValue,
              submissionUrl: item.submissionUrl ?? undefined,
              selectedTaskId: item.selectedTaskId ?? undefined,
              submittedAt: new Date(), // Update submission time
              // Reset evaluation status on resubmission
              isPassed: false,
              feedback: null,
              evaluatedAt: null,
              evaluatedBy: null,
            }
          })
        } else {
          // Create new submission
          await prisma.domainSubmission.create({ 
            data: ({ 
              applicationId: existing.id, 
              domain: item.domain, 
              subdomain: item.subdomain ?? undefined, 
              round: item.round,
              answers: item.answers as unknown as Prisma.InputJsonValue,
              submissionUrl: item.submissionUrl ?? undefined,
              selectedTaskId: item.selectedTaskId ?? undefined
            } as Prisma.DomainSubmissionUncheckedCreateInput) 
          })
        }
      }

      const fresh = await prisma.application.findUnique({ where: { id: existing.id }, include: { domainSubmissions: true } })
      return NextResponse.json({ success: true, data: fresh })
    }

    // No existing application: create a new application with nested domainSubmissions
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
  } catch (err) {
    // Map known Prisma unique constraint error to 409
    const message = err instanceof Error ? err.message : 'Failed to submit application'
    const isConflict = message.includes('Unique') || message.includes('unique') || message.includes('duplicate')
    console.error('Submission error:', err)
    return NextResponse.json(
      { success: false, error: message },
      { status: isConflict ? 409 : 500 }
    )
  }
}
