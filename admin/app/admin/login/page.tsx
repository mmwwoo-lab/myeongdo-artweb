"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@myeongdojae.com");
  const [password, setPassword] = useState("admin1234");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f7f1ea] p-6 text-[#2d241f]">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#eadac5] bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="overline">Admin login</p>
          <h1 style={{ fontSize: 32, marginTop: 8 }}>명도재 관리자 로그인</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
          <div className="field">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-button" style={{ width: "100%" }}>
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}
