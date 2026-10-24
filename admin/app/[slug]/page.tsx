import Link from "next/link";

const mockProjects = {
  "kim-ye-eun": {
    title: "김예은 작가 웹사이트",
    type: "ARTIST",
    hero: { title: "감정을 시각으로 번역하는 작가", subtitle: "시와 이미지가 만나는 순간을 기록합니다." },
    artist: { name: "김예은", intro: "감정을 시각으로 번역하는 작가" },
  },
  "seoul-art-gallery": {
    title: "서울문화전시관",
    type: "GALLERY",
    hero: { title: "전시와 감정을 함께하는 공간", subtitle: "감성을 담은 전시 경험" },
    artist: { name: "서울문화전시관", intro: "전시와 감정을 함께하는 공간" },
  },
};

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = mockProjects[params.slug as keyof typeof mockProjects];

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f7f1ea] p-10 text-[#2d241f]">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black">페이지를 찾을 수 없습니다.</h1>
          <Link href="/admin" className="primary-button" style={{ display: "inline-flex", marginTop: 16 }}>
            관리자 페이지로 이동
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1ea] p-10 text-[#2d241f]">
      <div className="mx-auto max-w-5xl">
        <p className="overline">{project.type}</p>
        <h1 style={{ fontSize: 54, marginTop: 12 }}>{project.hero.title}</h1>
        <p style={{ fontSize: 20, marginTop: 16 }}>{project.hero.subtitle}</p>
        <div style={{ marginTop: 30, display: "grid", gap: 18, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div className="panel">
            <p className="subtle">프로필</p>
            <h3 style={{ marginTop: 10 }}>{project.artist.name}</h3>
          </div>
          <div className="panel">
            <p className="subtle">작품</p>
            <h3 style={{ marginTop: 10 }}>공기 속의 기억</h3>
          </div>
          <div className="panel">
            <p className="subtle">문의</p>
            <h3 style={{ marginTop: 10 }}>연락처</h3>
          </div>
        </div>
      </div>
    </main>
  );
}
