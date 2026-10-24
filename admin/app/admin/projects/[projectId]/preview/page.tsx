"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PreviewProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    async function loadProject() {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      setProject(data.project);
    }

    if (projectId) loadProject();
  }, [projectId]);

  if (!project) {
    return <main className="page-shell"><div className="content"><p>불러오는 중...</p></div></main>;
  }

  return (
    <main className="page-shell">
      <div className="content" style={{ maxWidth: 980, margin: "0 auto" }}>
        <header className="topbar">
          <div>
            <p className="overline">Preview</p>
            <h2>{project.title}</h2>
          </div>
          <Link href={`/admin/projects/${projectId}/edit`} className="secondary-button">편집으로 돌아가기</Link>
        </header>

        <section className="panel" style={{ padding: 24 }}>
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
              <div>
                <p className="overline">작가</p>
                <h3 style={{ fontSize: 46, marginTop: 12 }}>{project.artistProfile?.name || project.title}</h3>
                <p style={{ marginTop: 10, fontSize: 20, color: "#5f4d46" }}>{project.artistProfile?.introduction || "감정을 시각으로 번역하는 작가"}</p>
              </div>
              <div style={{ borderRadius: 24, background: "linear-gradient(135deg, #e9d7ca, #f5e6d8)", minHeight: 220 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
              <div className="stat-card">
                <p>프로필</p>
                <strong style={{ display: "block", marginTop: 12, fontSize: 24 }}>작가 소개</strong>
              </div>
              <div className="stat-card">
                <p>작품</p>
                <strong style={{ display: "block", marginTop: 12, fontSize: 24 }}>공기 속의 기억</strong>
              </div>
              <div className="stat-card">
                <p>문의</p>
                <strong style={{ display: "block", marginTop: 12, fontSize: 24 }}>연락처</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
