// // app/api/documents/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//   try {
//     const documents = await prisma.documents.findMany({
//       include: {
//         categories: true,
//         issuing_agency: true,
//         activities: true,
//       },
//       orderBy: {
//         created_at: 'desc',
//       },
//     });

//     return NextResponse.json(documents);
//   } catch (error) {
//     console.error('Error fetching documents:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch documents' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';

// Tắt bodyParser cho xử lý FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: any): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filename: (name, ext, part) => {
        const timestamp = Date.now();
        return `${timestamp}_${part.originalFilename}`;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// GET - Lấy danh sách văn bản
export async function GET(request: NextRequest) {
  try {
    const documents = await prisma.documents.findMany({
      include: {
        categories: true,
        issuing_agency: true,
        activities: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách văn bản:', error);
    return NextResponse.json({ error: 'Không thể lấy danh sách văn bản' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File;
    const fileName = file.name;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Lưu file vào public/uploads
    const filePath = path.join(process.cwd(), 'public/uploads/', fileName);
    await writeFile(filePath, buffer);
    const savedFilePath = `${fileName}`;

    const newDocument = await prisma.documents.create({
      data: {
        id: crypto.randomUUID(),
        date: new Date(formData.get('date') as string),
        title: formData.get('title') as string,
        code: formData.get('code') as string,
        ref_number: formData.get('ref_number') as string,
        issued_date: new Date(formData.get('issued_date') as string),
        created_at: new Date(),
        summary: formData.get('summary') as string || '',
        urgency: formData.get('urgency') as string,
        confidentiality: formData.get('confidentiality') as string,
        type: formData.get('type') as string || null,
        authority: formData.get('authority') as string || null,
        field: formData.get('field') as string || null,
        signer: formData.get('signer') as string,
        recipients: formData.get('recipients') as string || '',
        file: savedFilePath,
        pages: parseInt(formData.get('pages') as string, 10),
      },
    });

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error('Lỗi khi thêm văn bản:', error);
    return NextResponse.json({ error: 'Không thể thêm văn bản' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 });
    }

    let savedFilePath = formData.get('file') as string;

    // Nếu là File, thì lưu mới
    const maybeFile = formData.get('file');
    if (maybeFile instanceof File) {
      const file = maybeFile;
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(process.cwd(), 'public/uploads/', file.name);
      await writeFile(filePath, buffer);
      savedFilePath = `${file.name}`;
    }

    const updatedDocument = await prisma.documents.update({
      where: { id },
      data: {
        date: new Date(formData.get('date') as string),
        title: formData.get('title') as string,
        code: formData.get('code') as string,
        ref_number: formData.get('ref_number') as string,
        issued_date: new Date(formData.get('issued_date') as string),
        summary: formData.get('summary') as string || '',
        urgency: formData.get('urgency') as string,
        confidentiality: formData.get('confidentiality') as string,
        type: formData.get('type') as string || null,
        authority: formData.get('authority') as string || null,
        field: formData.get('field') as string || null,
        signer: formData.get('signer') as string,
        recipients: formData.get('recipients') as string || '',
        file: savedFilePath,
        pages: parseInt(formData.get('pages') as string, 10),
      },
    });

    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi cập nhật văn bản:', error);
    return NextResponse.json({ error: 'Không thể cập nhật văn bản' }, { status: 500 });
  }
}

// DELETE - Xóa văn bản
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID văn bản' }, { status: 400 });
    }

    await prisma.documents.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Lỗi khi xóa văn bản:', error);
    return NextResponse.json({ error: 'Không thể xóa văn bản' }, { status: 500 });
  }
}
