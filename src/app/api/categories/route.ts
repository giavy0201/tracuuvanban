// // app/api/categories/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//   try {
//     const categories = await prisma.categories.findMany({
//       orderBy: {
//         name: 'asc',
//       },
//     });

//     return NextResponse.json(categories);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch categories' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {  name } = await req.json();
    const newCategory = await prisma.categories.create({
      data: {
        id: uuidv4(), 
         name },
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();
    const updatedCategory = await prisma.categories.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.categories.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}


