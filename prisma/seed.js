import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.admins.deleteMany({})  
  // Hash mật khẩu cho admin
  const hashedPassword = await bcrypt.hash("Abc@123", 10);

  // Tạo 1 admin
  await prisma.admins.create({
    data: {
      username: "admin",
      password: hashedPassword,
     
    }
  });

  // Mock data cho issuing_agency
  const agencies = await prisma.issuing_agency.createMany({
    data: [
      { id: "AG01", name: "UBND TP Huế" },
      { id: "AG02", name: "Sở Giáo dục Huế" },
    ],
    skipDuplicates: true,
  });

  // Mock data cho activities
  const acts = await prisma.activities.createMany({
    data: [
      { id: "ACT01", name: "Giáo dục" },
      { id: "ACT02", name: "Y tế" },
    ],
    skipDuplicates: true,
  });

  // Mock data cho categories
  const cats = await prisma.categories.createMany({
    data: [
      { id: "CAT01", name: "Công văn" },
      { id: "CAT02", name: "Quyết định" },
    ],
    skipDuplicates: true,
  });

  // Mock data cho documents
  await prisma.documents.createMany({
    data: [
      {
        id: "DOC01",
        date: new Date(),
        title: "Quyết định về giáo dục",
        code: "QD-GD-01",
        ref_number: "REF001",
        created_at: new Date(),
        issued_date: new Date(),
        summary: "Nội dung quyết định liên quan đến giáo dục",
        urgency: "Bình thường",
        confidentiality: "Công khai",
        type: "CAT02",
        authority: "AG01",
        field: "ACT01",
        signer: "Nguyễn Văn A",
        recipients: "Các trường học",
        file: "qd-giaoduc.pdf",
        pages: 5
      },
      {
        id: "DOC02",
        date: new Date(),
        title: "Công văn về y tế",
        code: "CV-YT-01",
        ref_number: "REF002",
        created_at: new Date(),
        issued_date: new Date(),
        summary: "Nội dung công văn liên quan đến y tế",
        urgency: "Khẩn",
        confidentiality: "Nội bộ",
        type: "CAT01",
        authority: "AG02",
        field: "ACT02",
        signer: "Trần Thị B",
        recipients: "Các bệnh viện",
        file: "cv-yte.pdf",
        pages: 3
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed data completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
