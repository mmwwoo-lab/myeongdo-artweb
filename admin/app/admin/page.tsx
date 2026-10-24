import Link from "next/link";

const mockProjects = [
  { id: "p-1", name: "김예은 작가 웹사이트", type: "작가", status: "DRAFT" },
  { id: "p-2", name: "서울문화전시관", type: "전시관", status: "READY" },
  { id: "p-3", name: "디지털 문학관", type: "디지털 문학관", status: "PUBLISHED" },
  { id: "p-4", name: "시집 소개 페이지", type: "시집 소개", status: "DRAFT" },
];

export default function AdminDashboardPage() {
  return (
    <main className="page-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">명</div>
          <div>
            <p className="overline">관리자</p>
            <h1>명도재</h1>
          </div>
        </div>

        <nav className="nav-list">
          <Link href="/admin">대시보드</Link>
          <Link href="/admin/projects/new">새 프로젝트</Link>
          <Link href="/admin/login">로그아웃</Link>
        </nav>
      </aside>

      <div className="content">
        <header className="topbar">
          <div>
            <p className="overline">관리자 센터</p>
            <h2>문화예술 웹사이트 제작 대시보드</h2>
          </div>
          <Link href="/admin/projects/new" className="primary-button">
            새 프로젝트 생성
          </Link>
        </header>

        <section className="card-grid three-col" style={{ marginBottom: 28 }}>
          <StatCard label="총 프로젝트" value="24" />
          <StatCard label="공개 중" value="18" />
          <StatCard label="이번 주 작업" value="12" />
        </section>

        <section className="panel">
          <div className="topbar" style={{ marginBottom: 16 }}>
            <h3>최근 프로젝트</h3>
            <Link href="/admin/projects/new">더 보기</Link>
          </div>

          <div className="card-list">
            {mockProjects.map((project) => (
              <div key={project.id} className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                <div>
                  <p className="overline" style={{ fontSize: 10 }}>{project.type}</p>
                  <h4 style={{ marginTop: 8 }}>{project.name}</h4>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="small-button" style={{ background: "#f6e6d7", color: "#8f4f32" }}>{project.status}</span>
                  <Link href={`/admin/projects/${project.id}/edit`} className="small-button">수정</Link>
                  <Link href={`/admin/projects/${project.id}/preview`} className="small-button accent">미리보기</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel">
      <p className="subtle">{label}</p>
      <p style={{ fontSize: 32, fontWeight: 800, marginTop: 12 }}>{value}</p>
    </div>
  );
}
