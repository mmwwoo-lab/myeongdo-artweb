import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <span className="brand-mark">명</span>
          <span>명도재</span>
        </div>
        <nav className="landing-nav">
          <a href="#about">소개</a>
          <a href="#services">서비스</a>
          <a href="#templates">템플릿</a>
          <a href="#contact">문의</a>
        </nav>
      </header>

      <section className="hero-box">
        <div>
          <p className="tag">CULTURE & ART WEB</p>
          <h1>예술의 감성을 디지털로 전합니다.</h1>
          <p className="hero-text">
            작가, 전시관, 문학 프로젝트와 시집 소개를 위한 맞춤형 웹사이트 제작을 지원합니다.
          </p>
          <div className="hero-actions">
            <Link href="/admin" className="primary-button">관리자 페이지</Link>
            <a href="#contact" className="secondary-button">상담 신청</a>
          </div>
        </div>

        <div className="hero-preview">
          <div className="browser-bar">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <div className="preview-panel">
            <div className="preview-header">
              <div className="preview-brand">명도재</div>
              <div className="preview-links">홈 / 소개 / 작품 / 문의</div>
            </div>
            <div className="preview-body">
              <div className="preview-copy">
                <h3>문화예술을 온전히 드러내는 웹사이트</h3>
                <p>시선을 오래 머무게 하는 디자인과 문장으로 감성을 전달합니다.</p>
              </div>
              <div className="preview-swatch"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="content-section">
        <h2>제작 서비스</h2>
        <div className="card-grid three-col">
          <div className="info-card">
            <div className="icon">✍️</div>
            <h3>브랜딩 설계</h3>
            <p>예술가와 기관의 정체성을 정리해 강한 세계관을 만듭니다.</p>
          </div>
          <div className="info-card">
            <div className="icon">🎨</div>
            <h3>반응형 웹사이트</h3>
            <p>모바일에서 데스크톱까지 자연스럽게 보여지는 구조를 설계합니다.</p>
          </div>
          <div className="info-card">
            <div className="icon">📚</div>
            <h3>콘텐츠 기획</h3>
            <p>전시, 아카이브, 작품 소개를 읽기 쉽게 구성합니다.</p>
          </div>
        </div>
      </section>

      <section id="templates" className="content-section">
        <h2>템플릿 미리보기</h2>
        <div className="template-grid">
          <TemplateCard title="작가" description="프로필, 연보, 작품, 인터뷰" />
          <TemplateCard title="전시관" description="전시 소개, 행사 일정, 오시는 길" />
          <TemplateCard title="디지털 문학관" description="아카이브, 문학 전시, 시" />
          <TemplateCard title="시집 소개" description="목차, 추천사, 구매 안내" />
        </div>
      </section>

      <section id="contact" className="content-section contact-box">
        <h2>제작 문의</h2>
        <div className="contact-grid">
          <div>
            <p>hello@myeongdojae.com</p>
            <p>02-123-4567</p>
            <p>서울시 종로구 예술로 24</p>
          </div>
          <Link href="/admin/login" className="primary-button">관리자 로그인</Link>
        </div>
      </section>
    </main>
  );
}

function TemplateCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="template-card">
      <div className="template-thumb"></div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
