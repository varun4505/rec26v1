import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, name, registrationNumber, content } = await request.json();
    if (!email || !name || !registrationNumber || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Optionally: sanitize input here
    try {
      const submission = await prisma.ctfsubmission.create({
        data: {
          email,
          name,
          registrationNumber,
          content,
        },
      });
      return NextResponse.json({ success: true, submission });
    } catch (dbError) {
      return NextResponse.json({ error: 'Database error', details: dbError }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit', details: error }, { status: 500 });
  }
}
