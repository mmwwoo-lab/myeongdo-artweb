"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      setProject(data.project);
      setLoading(false);
    }

    if (projectId) loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <main className="page-shell">
        <div className="content"><p>불러오는 중...</p></div>
      </main>
    );
  }

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
          <Link href={`/admin/projects/${projectId}/preview`}>미리보기</Link>
          <Link href="/admin/projects/new">새 프로젝트</Link>
        </nav>
      </aside>

      <div className="content">
        <header className="topbar">
          <div>
            <p className="overline">��집 모드</p>
            <h2>{project?.title || "프로젝트"}</h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href={`/admin/projects/${projectId}/preview`} className="secondary-button">미리보기</Link>
            <button className="primary-button">공개</button>
          </div>
        </header>

        <div className="admin-layout-grid">
          <aside className="panel">
            <div className="section-title">섹션</div>
            <div className="card-list">
              {['기본', '소개', '작품', '전시', '문의'].map((item) => (
                <button type="button" key={item} className="small-button" style={{ width: "100%" }}>{item}</button>
              ))}
            </div>
          </aside>

          <section className="panel">
            <div className="section-title">기본 정보</div>
            <div className="form-grid">
              <div className="field">
                <label>프로젝트명</label>
                <input defaultValue={project?.title || ""} />
              </div>
              <div className="field">
                <label>슬러그</label>
                <input defaultValue={project?.slug || ""} />
              </div>
              <div className="field">
                <label>프로젝트 유형</label>
                <select defaultValue={project?.projectType || "ARTIST"}>
                  <option value="ARTIST">작가</option>
                  <option value="GALLERY">전시관</option>
                  <option value="DIGITAL_LITERARY_MUSEUM">디지털 문학관</option>
                  <option value="POETRY_BOOK">시집 소개</option>
                </select>
              </div>
              <div className="field">
                <label>상태</label>
                <select defaultValue={project?.status || "DRAFT"}>
                  <option value="DRAFT">DRAFT</option>
                  <option value="READY">READY</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <div className="section-title">대표 문구</div>
              <div className="field">
                <label>한 줄 소개</label>
                <input defaultValue={project?.artistProfile?.introduction || "감정을 시각으로 번역하는 작가"} />
              </div>
            </div>
          </section>

          <aside className="preview-box">
            <div className="section-title">미리보기</div>
            <div className="preview-panel">
              <p className="overline">Preview</p>
              <h3 style={{ marginTop: 8, fontSize: 28 }}>{project?.title || "프로젝트명"}</h3>
              <p style={{ marginTop: 8, color: "#5f4d46" }}>{project?.artistProfile?.introduction || "감정을 시각으로 번역하는 작가"}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
