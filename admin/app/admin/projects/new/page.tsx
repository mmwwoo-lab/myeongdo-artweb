"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const templates = [
  { id: "tmpl_artist_v1", type: "ARTIST", name: "작가", desc: "프로필, 연보, 작품, 인터뷰" },
  { id: "tmpl_gallery_v1", type: "GALLERY", name: "전시관", desc: "전시 일정, 소개, 오시는 길" },
  { id: "tmpl_literary_v1", type: "DIGITAL_LITERARY_MUSEUM", name: "디지털 문학관", desc: "아카이브, AR/문학 전시" },
  { id: "tmpl_poetry_v1", type: "POETRY_BOOK", name: "시집 소개", desc: "목차, 추천사, 구매 안내" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    projectType: "ARTIST",
    templateId: "tmpl_artist_v1",
  });

  async function submit() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/admin/projects/${data.project.id}/edit`);
    }
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
          <a href="/admin">대시보드</a>
          <a href="/admin/projects/new">새 프로젝트</a>
        </nav>
      </aside>

      <div className="content">
        <header className="topbar">
          <div>
            <p className="overline">새 프로젝트</p>
            <h2>홈페이지 생성</h2>
          </div>
        </header>

        <div className="panel" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
          <div>
            <div style={{ display: "grid", gap: 18 }}>
              <div className="field">
                <label>프로젝트명</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 김예은 작가 웹사이트"
                />
              </div>

              <div className="field">
                <label>슬러그</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="kim-ye-eun"
                />
              </div>

              <div className="field">
                <label>프로젝트 유형</label>
                <select
                  value={form.projectType}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    const match = templates.find((item) => item.type === nextValue);
                    setForm({
                      ...form,
                      projectType: nextValue,
                      templateId: match?.id || "tmpl_artist_v1",
                    });
                  }}
                >
                  <option value="ARTIST">작가</option>
                  <option value="GALLERY">전시관</option>
                  <option value="DIGITAL_LITERARY_MUSEUM">디지털 문학관</option>
                  <option value="POETRY_BOOK">시집 소개</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 16 }}>템플릿 선택</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setForm({ ...form, templateId: template.id, projectType: template.type })}
                  style={{
                    textAlign: "left",
                    padding: 14,
                    borderRadius: 18,
                    border: form.templateId === template.id ? "1px solid #8f4f32" : "1px solid #eadac5",
                    background: form.templateId === template.id ? "#f9efe7" : "white",
                  }}
                >
                  <div style={{ height: 80, borderRadius: 14, marginBottom: 10, background: "linear-gradient(135deg, #f0d8b7, #f7efe8)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{template.name}</strong>
                    {form.templateId === template.id && <span>✓</span>}
                  </div>
                  <p style={{ marginTop: 8, color: "#6d5b50" }}>{template.desc}</p>
                </button>
              ))}
            </div>

            <button type="button" onClick={submit} className="primary-button" style={{ width: "100%", marginTop: 18 }}>
              프로젝트 생성
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
