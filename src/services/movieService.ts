import OMDbRepository from '../api/repositories/omdbRepository';
import type { MovieSearchResponse, MovieDetailResponse } from '../types/api';
import { OMDB_ERRORS, USER_FRIENDLY_ERRORS } from '../constants/omdb';

class MovieService {
  private repository: OMDbRepository;

  constructor() {
    this.repository = new OMDbRepository();
  }

  async searchMovies(
    searchTerm: string,
    page: number,
    apiKey: string,
    year?: string
  ): Promise<MovieSearchResponse> {
    if (!searchTerm.trim()) {
      throw new Error('검색어를 입력해주세요.');
    }

    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    try {
      const response = await this.repository.searchMovies(searchTerm, page, apiKey, year);
      
      // OMDb API는 HTTP 200을 반환하지만 응답 본문에 Error 필드가 있을 수 있음
      if (response.Response === 'False' && response.Error) {
        if (
          response.Error.includes(OMDB_ERRORS.INVALID_API_KEY) ||
          response.Error.includes(OMDB_ERRORS.API_KEY)
        ) {
          throw new Error(USER_FRIENDLY_ERRORS.INVALID_API_KEY);
        }
        throw new Error(response.Error);
      }

      return response;
    } catch (error: any) {
      // 401 에러나 인증 관련 에러 처리
      if (error.isAuthError || error.status === 401) {
        throw new Error(USER_FRIENDLY_ERRORS.INVALID_API_KEY);
      }
      // 서버 에러 처리
      if (error.isServerError) {
        throw new Error(USER_FRIENDLY_ERRORS.SERVER_ERROR);
      }
      // 타임아웃 에러 처리
      if (error.isTimeoutError) {
        throw new Error(USER_FRIENDLY_ERRORS.TIMEOUT_ERROR);
      }
      throw error;
    }
  }

  async getMovieDetail(imdbId: string, apiKey: string): Promise<MovieDetailResponse> {
    if (!imdbId) {
      throw new Error('영화 ID가 필요합니다.');
    }

    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    try {
      const response = await this.repository.getMovieById(imdbId, apiKey);
      
      // OMDb API는 HTTP 200을 반환하지만 응답 본문에 Error 필드가 있을 수 있음
      if (response.Response === 'False' && response.Error) {
        if (
          response.Error.includes(OMDB_ERRORS.INVALID_API_KEY) ||
          response.Error.includes(OMDB_ERRORS.API_KEY)
        ) {
          throw new Error(USER_FRIENDLY_ERRORS.INVALID_API_KEY);
        }
        throw new Error(response.Error);
      }

      return response;
    } catch (error: any) {
      // 401 에러나 인증 관련 에러 처리
      if (error.isAuthError || error.status === 401) {
        throw new Error(USER_FRIENDLY_ERRORS.INVALID_API_KEY);
      }
      // 서버 에러 처리
      if (error.isServerError) {
        throw new Error(USER_FRIENDLY_ERRORS.SERVER_ERROR);
      }
      // 타임아웃 에러 처리
      if (error.isTimeoutError) {
        throw new Error(USER_FRIENDLY_ERRORS.TIMEOUT_ERROR);
      }
      throw error;
    }
  }
}

export default MovieService;

