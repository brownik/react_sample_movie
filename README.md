# 🎬 OMDb Movie Explorer

OMDb(Open Movie Database) API를 이용해 영화 검색, 페이징, 상세 정보 확인, API 키 관리 등을 제공하는 React 웹 애플리케이션입니다. Layered Architecture와 Repository/Service 패턴, React Query 등을 활용해 확장성과 유지보수성을 고려했습니다.

---

## ✨ 주요 기능
- **영화 검색**: 제목 기준 검색, 최소 3자 입력 시 정확도 향상
- **검색 히스토리**: 최근 검색어 최대 10개 저장 및 빠른 재검색
- **필터링**: 연도 및 장르 필터로 정확한 검색 결과 제공
- **페이징**: OMDb API(페이지당 10건)에 맞춘 페이지 네이션
- **상세 페이지**: 포스터, 기본 정보, 출연진, 평점, 수상 내역 등
- **API 키 관리**: 헤더의 ⚙️ 버튼으로 키 조회/수정, 로컬스토리지 저장
- **로딩 스켈레톤**: 로딩 중 스켈레톤 UI로 더 나은 사용자 경험
- **에러 처리**: 강화된 에러 처리 및 사용자 친화적 메시지
- **기본 포스터 제공**: 이미지가 없거나 로딩 실패 시 대체 이미지 사용

---

## 🧱 아키텍처

이 프로젝트는 **Layered Architecture(계층형 아키텍처)**를 기반으로 설계되었습니다. 각 레이어는 명확한 책임을 가지며, 의존성은 단방향으로 흐릅니다.

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Pages, Components)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Application Layer               │
│  (Hooks, Contexts)                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Domain Layer                 │
│  (Services)                         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Infrastructure Layer            │
│  (API Client, Repositories)         │
└─────────────────────────────────────┘
```

| 레이어 | 디렉토리 | 역할 |
|--------|---------|------|
| **Presentation** | `pages/`, `components/` | UI 렌더링 및 사용자 인터랙션 처리 |
| **Application** | `hooks/`, `contexts/` | 비즈니스 로직 조합, 상태 관리 |
| **Domain** | `services/` | 비즈니스 규칙, 데이터 변환, 에러 처리 |
| **Infrastructure** | `api/` | 외부 API 통신, 데이터 접근 |

---

## 🎨 디자인 패턴

| 패턴 | 목적 |
|------|------|
| **Repository Pattern** | 데이터 접근 로직을 캡슐화하여 비즈니스 로직과 분리 |
| **Service Pattern** | 비즈니스 규칙, 에러 처리, 데이터 변환을 중앙화 |
| **Custom Hook Pattern** | React Query 로직을 재사용 가능한 훅으로 캡슐화 |
| **Presentational / Container Pattern** | UI 로직과 비즈니스 로직 분리 |
| **Context Pattern** | 전역 상태를 Props drilling 없이 공유 |
| **Error Boundary Pattern** | React 컴포넌트 트리에서 발생한 에러 포착 및 처리 |
| **Code Splitting Pattern** | 초기 번들 크기 감소 및 성능 최적화 |
| **Interceptor Pattern** | HTTP 요청/응답 전후 처리 (에러 처리, 로깅 등) |

---

## 📁 폴더 구조
```
src/
├─ api/
│  ├─ client/            # Axios 인스턴스 및 인터셉터
│  └─ repositories/      # OMDb API 호출 정의
├─ assets/               # 노출 이미지 (기본 포스터 등)
├─ components/           # 재사용 UI 컴포넌트
│  ├─ ErrorBoundary.tsx  # 에러 바운더리
│  ├─ Skeleton.tsx       # 로딩 스켈레톤
│  ├─ SearchHistory.tsx # 검색 히스토리
│  ├─ MovieFilter.tsx   # 필터링 컴포넌트
│  └─ ...
├─ constants/            # 상수 파일
│  ├─ app.ts            # 앱 전역 상수
│  └─ omdb.ts          # OMDb API 관련 상수
├─ contexts/             # ApiKeyContext
├─ hooks/                # 커스텀 훅
│  ├─ useMovieSearch.ts
│  ├─ useMovieDetail.ts
│  ├─ useMovieDetails.ts
│  ├─ useAllMovieSearch.ts
│  ├─ useGenreFilteredMovies.ts
│  └─ useSearchHistory.ts
├─ pages/                # MovieSearchPage, MovieDetailPage
├─ services/             # MovieService
├─ types/                # API Response 타입
├─ App.tsx               # Router & Provider 결합 (코드 스플리팅)
└─ main.tsx              # React Query Client, StrictMode 진입점
```

---

## 🧩 기술 스택

### 프론트엔드 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 및 개발 서버

### 라우팅
- **React Router 7** - SPA 라우팅, 코드 스플리팅 지원

### 상태 관리
- **React Query (TanStack Query)** - 서버 상태 관리, 캐싱, 자동 재시도
- **Context API** - API 키 전역 상태 관리

### HTTP 클라이언트
- **Axios** - HTTP 요청 처리, 인터셉터를 통한 에러 처리

### 스타일링
- **CSS Modules** - 컴포넌트 단위 스타일 관리

### 주요 기능
- **Error Boundary** - 예기치 못한 에러 처리
- **Code Splitting** - React.lazy를 통한 페이지 지연 로딩
- **LocalStorage** - 검색 히스토리 및 API 키 저장

---

## 🚀 실행 방법

### 1. 프로젝트 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
# http://localhost:5173 접속
```

### 3. API 키 설정 (필수)
**⚠️ 중요: 프로젝트 실행 후 반드시 API 키를 설정해야 합니다.**

1. 브라우저에서 앱 접속
2. 헤더의 **"⚙️ API 키 관리"** 버튼 클릭
3. OMDb API 키 입력 후 저장
   - API 키 발급: https://www.omdbapi.com/apikey.aspx
   - 무료 키 사용 가능 (일일 요청 제한 있음)

### 환경 요구 사항
- Node.js 18+
- 브라우저 콘솔에서 API 키 로그 확인 가능 (DEV 모드)

---


## 📄 라이선스
이 프로젝트는 학습 및 데모 용도로 제작되었습니다. OMDb API와 제공 이미지 사용 시 [OMDb 이용 약관](https://www.omdbapi.com/)과 각 리소스 저작권을 준수하세요.

---

## 📝 프로젝트 소개

이 프로젝트는 **Cursor**를 이용하여 작업한 React 학습 프로젝트입니다. 

React 아키텍처와 디자인 패턴을 학습하기 위해 다음과 같은 내용을 실습했습니다:

- **Layered Architecture**: 계층형 아키텍처를 통한 관심사 분리
- **디자인 패턴**: Repository, Service, Custom Hook 등 다양한 패턴 적용
- **상태 관리**: React Query를 활용한 서버 상태 관리
- **에러 처리**: Error Boundary와 인터셉터를 통한 에러 처리
- **성능 최적화**: Code Splitting, 캐싱, 재시도 로직 등

실제 프로덕션 환경에서 사용되는 아키텍처와 패턴을 학습하고 적용하는 것을 목표로 하였습니다.

---

필요한 기능이나 개선 아이디어가 있다면 자유롭게 Issue/PR로 공유해주세요! 😊
