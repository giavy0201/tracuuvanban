// // app/api/activities/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//   try {
//     const activities = await prisma.activities.findMany({
//       orderBy: {
//         name: 'asc',
//       },
//     });

//     return NextResponse.json(activities);
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
    const activities = await prisma.activities.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {  name } = await request.json();

    if ( !name) {
      return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
    }

    const newActivity = await prisma.activities.create({
      data: {
        id : uuidv4(),
        name,
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
    }

    const updated = await prisma.activities.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.activities.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Activity deleted' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
