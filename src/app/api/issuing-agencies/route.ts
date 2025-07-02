// app/api/activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const issuingAgency = await prisma.issuing_agency.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(issuingAgency);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}