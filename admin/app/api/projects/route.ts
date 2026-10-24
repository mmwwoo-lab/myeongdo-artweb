const projectMockData = [
  {
    id: "p-1",
    title: "김예은 작가 웹사이트",
    slug: "kim-ye-eun",
    projectType: "ARTIST",
    status: "DRAFT",
    templateId: "tmpl_artist_v1",
    artistProfile: {
      name: "김예은",
      introduction: "감정을 시각으로 번역하는 작가",
    },
    contactInfo: {
      email: "yeun@example.com",
      phone: "010-1234-5678",
    },
  },
  {
    id: "p-2",
    title: "서울문화전시관",
    slug: "seoul-art-gallery",
    projectType: "GALLERY",
    status: "READY",
    templateId: "tmpl_gallery_v1",
    artistProfile: {
      name: "서울문화전시관",
      introduction: "전시와 감정을 함께하는 공간",
    },
    contactInfo: {
      email: "gallery@example.com",
      phone: "02-333-4444",
    },
  },
  {
    id: "p-3",
    title: "디지털 문학관",
    slug: "digital-literary-museum",
    projectType: "DIGITAL_LITERARY_MUSEUM",
    status: "PUBLISHED",
    templateId: "tmpl_literary_v1",
    artistProfile: {
      name: "디지털 문학관",
      introduction: "문학이 디지털 공간으로 확장되는 곳",
    },
    contactInfo: {
      email: "literature@example.com",
      phone: "02-111-2222",
    },
  },
];

export async function GET() {
  return Response.json({ projects: projectMockData });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newProject = {
    id: `p-${Date.now()}`,
    title: body.title || "새 프로젝트",
    slug: body.slug || "new-project",
    projectType: body.projectType || "ARTIST",
    status: body.status || "DRAFT",
    templateId: body.templateId || "tmpl_artist_v1",
  };

  projectMockData.unshift(newProject);

  return Response.json({ success: true, project: newProject });
}
