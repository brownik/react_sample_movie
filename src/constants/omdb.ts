// OMDb API 관련 상수
export const OMDB_API_BASE_URL = 'http://www.omdbapi.com';

// OMDb API 에러 메시지
export const OMDB_ERRORS = {
  INVALID_API_KEY: 'Invalid API key',
  API_KEY: 'API key',
  MOVIE_NOT_FOUND: 'Movie not found!',
  TOO_MANY_RESULTS: 'Too many results.',
} as const;

// 사용자 친화적 에러 메시지
export const USER_FRIENDLY_ERRORS = {
  INVALID_API_KEY: 'API 키가 유효하지 않습니다. API 키 관리에서 올바른 키를 입력해주세요.',
  NO_RESULTS: '검색 결과가 없습니다. 다른 검색어를 시도해보세요.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 연결을 확인해주세요.',
  SERVER_ERROR: 'OMDb API 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  TIMEOUT_ERROR: '요청 시간이 초과되었습니다. OMDb API 서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

// 영화 타입
export const MOVIE_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
  EPISODE: 'episode',
} as const;

// 장르 목록 (OMDb에서 자주 사용되는 장르)
export const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Drama',
  'Family',
  'Fantasy',
  'Film-Noir',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Thriller',
  'War',
  'Western',
] as const;

