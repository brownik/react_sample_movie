# 🎬 OMDb Movie Explorer

OMDb(Open Movie Database) API를 이용해 영화 검색, 페이징, 상세 정보 확인, API 키 관리 등을 제공하는 React 웹 애플리케이션입니다. Layered Architecture와 Repository/Service 패턴, React Query 등을 활용해 확장성과 유지보수성을 고려했습니다.

---

## ✨ 주요 기능
- **영화 검색**: 제목 기준 검색, 최소 3자 입력 시 정확도 향상
- **페이징**: OMDb API(페이지당 10건)에 맞춘 페이지 네이션
- **상세 페이지**: 포스터, 기본 정보, 출연진, 평점, 수상 내역 등
- **API 키 관리**: 헤더의 ⚙️ 버튼으로 키 조회/수정, 로컬스토리지 저장
- **기본 포스터 제공**: 이미지가 없거나 로딩 실패 시 대체 이미지 사용

---

## 🧱 아키텍처 & 패턴
| 레이어 | 설명 |
| --- | --- |
| `api/` | Axios 클라이언트와 Repository. OMDb 호출 로직을 캡슐화 |
| `services/` | 비즈니스 규칙, 파라미터/에러 처리. UI는 단순히 결과만 소비 |
| `hooks/` | React Query를 감싼 커스텀 훅. 캐싱/로딩/에러 상태 일관 관리 |
| `components/` | 프레젠테이션 컴포넌트. 상태 없이 UI만 담당 |
| `pages/` | 라우트 엔드포인트. 훅과 컴포넌트를 조합해 화면 구성 |
| `contexts/` | API 키 전역 상태 관리 (Context API) |

**주요 패턴**
- Repository + Service 패턴
- Custom Hook + React Query
- Presentational / Container 분리
- Context API for global config

대안으로는 Feature-Based 구조, Zustand/Recoil, SWR 등이 있으나 이번 프로젝트 규모와 요구사항에 맞춰 위 구조를 선택했습니다.

---

## 📁 폴더 구조
```
src/
├─ api/
│  ├─ client/            # Axios 인스턴스 및 인터셉터
│  └─ repositories/      # OMDb API 호출 정의
├─ assets/               # 노출 이미지 (기본 포스터 등)
├─ components/           # 재사용 UI 컴포넌트
├─ contexts/             # ApiKeyContext
├─ hooks/                # useMovieSearch, useMovieDetail
├─ pages/                # MovieSearchPage, MovieDetailPage
├─ services/             # MovieService
├─ types/                # API Response 타입
├─ App.tsx               # Router & Provider 결합
└─ main.tsx              # React Query Client, StrictMode 진입점
```

---

## 🧩 기술 스택
- **React 19 + TypeScript + Vite**
- **React Router 7** – SPA 라우팅
- **React Query** – 서버 상태 관리/캐싱/재시도
- **Axios** – HTTP 클라이언트
- **Context API** – API 키 전역 상태
- **CSS** – 컴포넌트 단위 스타일

---

## 🚀 실행 방법
```bash
npm install
npm run dev
# http://localhost:5173 접속
```

### 환경 요구 사항
- Node.js 18+
- 브라우저 콘솔에서 API 키 로그 확인 가능 (DEV 모드)

---

## 🔑 OMDb API 사용 방법
1. https://www.omdbapi.com/apikey.aspx 에서 키 발급
2. 앱 헤더의 “⚙️ API 키 관리” 버튼 클릭
3. 키 입력 후 저장 → 로컬스토리지에 보관
4. 검색 시마다 `http://www.omdbapi.com/?apikey=YOUR_KEY&...` 형식으로 호출

API가 `Response: "False"` 와 `Error`를 반환하면 서비스 레이어가 메시지를 사용자 친화적으로 전달합니다. (예: Invalid API key, Too many results 등)

---

## 📌 개발시 유용한 정보
- 개발 모드에서 모든 OMDb 요청 URL을 콘솔(`[OMDb][GET] ...`)에 출력합니다.
- 포스터 이미지가 없거나 로딩 실패 시 `src/assets/no-poster.svg`로 대체합니다.
- URL 쿼리(`?q=검색어&page=2`)와 UI 상태를 동기화하여 새로고침/공유에 대응합니다.
- `npm run lint` 로 ESLint 검사 가능.

---

## 📄 라이선스
이 프로젝트는 학습 및 데모 용도로 제작되었습니다. OMDb API와 제공 이미지 사용 시 [OMDb 이용 약관](https://www.omdbapi.com/)과 각 리소스 저작권을 준수하세요.

---

필요한 기능이나 개선 아이디어가 있다면 자유롭게 Issue/PR로 공유해주세요! 😊
