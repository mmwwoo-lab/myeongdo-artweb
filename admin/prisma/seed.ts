import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" as any },
    update: {},
    create: { name: "ADMIN" as any },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@myeongdojae.com" },
    update: {},
    create: {
      email: "admin@myeongdojae.com",
      passwordHash: "demo-hash",
      name: "관리자",
      roleId: adminRole.id,
    },
  });

  const templates = [
    { id: "tmpl_artist_v1", name: "작가", category: "ARTIST", description: "작가 포트폴리오", version: "1.0.0", isActive: true },
    { id: "tmpl_gallery_v1", name: "전시관", category: "GALLERY", description: "전시관 소개", version: "1.0.0", isActive: true },
    { id: "tmpl_literary_v1", name: "디지털 문학관", category: "DIGITAL_LITERARY_MUSEUM", description: "문학관 웹사이트", version: "1.0.0", isActive: true },
    { id: "tmpl_poetry_v1", name: "시집 소개", category: "POETRY_BOOK", description: "시집 소개 페이지", version: "1.0.0", isActive: true },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }

  const project = await prisma.project.upsert({
    where: { slug: "kim-ye-eun" },
    update: {},
    create: {
      title: "김예은 작가 웹사이트",
      slug: "kim-ye-eun",
      projectType: "ARTIST",
      status: "DRAFT",
      templateId: "tmpl_artist_v1",
      userId: adminUser.id,
      artistProfile: {
        create: {
          name: "김예은",
          introduction: "감정을 시각으로 번역하는 작가",
        },
      },
      contactInfo: {
        create: {
          email: "yeun@example.com",
          phone: "010-1234-5678",
        },
      },
    },
  });

  console.log("seed setup complete", { adminUser, project });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
