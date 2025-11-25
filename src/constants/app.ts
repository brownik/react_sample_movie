// 앱 전역 상수
export const APP_NAME = 'OMDb Movie Explorer';

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  API_KEY: 'omdb_api_key',
  SEARCH_HISTORY: 'movie_search_history',
  FAVORITES: 'movie_favorites',
} as const;

// 기본값
// TODO: DEFAULT API KEY 작성
export const DEFAULT_API_KEY = '';

// 페이지당 결과 수
export const RESULTS_PER_PAGE = 10;

// 검색 히스토리 최대 개수
export const MAX_SEARCH_HISTORY = 10;

// 캐시 시간 (밀리초)
export const CACHE_TIME = {
  MOVIE_SEARCH: 5 * 60 * 1000, // 5분
  MOVIE_DETAIL: 10 * 60 * 1000, // 10분
} as const;

// 재시도 횟수
export const RETRY_COUNT = 2;

// 재시도 지연 시간 (밀리초)
export const RETRY_DELAY = 1000; // 1초

// API 타임아웃
export const API_TIMEOUT = 10000; // 10초

// 연도 필터 범위
export const YEAR_RANGE = {
  MIN: 1900,
  MAX: new Date().getFullYear(),
} as const;

