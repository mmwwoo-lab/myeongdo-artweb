import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "명도재 문화예술 홈페이지 제작소",
  description: "작가, 전시관, 문학관, 시집 소개용 관리 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
