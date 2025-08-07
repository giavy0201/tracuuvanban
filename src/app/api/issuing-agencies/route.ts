// // app/api/activities/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//   try {
//     const issuingAgency = await prisma.issuing_agency.findMany({
//       orderBy: {
//         name: 'asc',
//       },
//     });

//     return NextResponse.json(issuingAgency);
//   } catch (error) {
//     console.error('Error fetching activities:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch activities' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
export async function GET() {
  try {
    const agencies = await prisma.issuing_agency.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(agencies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agencies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {  name } = await req.json();
    const newAgency = await prisma.issuing_agency.create({
      data: { 
        id: uuidv4(),
         name },
    });
    return NextResponse.json(newAgency);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create agency' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();
    const updatedAgency = await prisma.issuing_agency.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedAgency);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update agency' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.issuing_agency.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Agency deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete agency' }, { status: 500 });
  }
}
