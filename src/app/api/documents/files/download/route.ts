// app/api/documents/files/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID tài liệu' }, { status: 400 });
    }

    // Lấy dữ liệu từ DB
    const document = await prisma.documents.findUnique({
      where: { id },
    });

    if (!document || !document.file) {
      return NextResponse.json({ error: 'Không tìm thấy tài liệu hoặc file' }, { status: 404 });
    }

    // Tạo đường dẫn tuyệt đối đến file
    const filePath = path.join(process.cwd(), 'public/uploads', document.file);

    // Kiểm tra file có tồn tại không
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File không tồn tại trên máy chủ' }, { status: 404 });
    }

    // Đọc file từ ổ cứng
    const fileData = await fs.readFile(filePath);
    const fileName = path.basename(document.file);

    // Trả file về client
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    console.error('Lỗi khi tải file:', error);
    return NextResponse.json({ error: 'Lỗi server khi tải file' }, { status: 500 });
  }
}
