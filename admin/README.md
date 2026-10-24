# 명도재 관리자 앱

이 디렉터리는 명도재 문화예술 홈페이지 제작소의 관리자 앱입니다.

## 로컬 실행

```bash
cd admin
npm install
npx prisma generate
npm run dev
```

접속:

- http://localhost:3000
- http://localhost:3000/admin/login

## 구조

- `/` : 홍보용 표준 페이지
- `/admin` : 관리 대시보드
- `/admin/projects/new` : 새 프로젝트 생성
- `/admin/projects/[projectId]/edit` : 편집 화면
- `/admin/projects/[projectId]/preview` : 미리보기 화면
- `/[slug]` : 공개 페이지 예시

## 참고

현재 단계는 관리자 앱 구조와 데이터 흐름을 확인할 수 있는 초기 구현입니다. 다음 단계에서 Prisma 실 DB 연결과 실제 이미지 업로드를 연결할 수 있습니다.
