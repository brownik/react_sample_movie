import OMDbRepository from '../api/repositories/omdbRepository';
import type { MovieSearchResponse, MovieDetailResponse } from '../types/api';

class MovieService {
  private repository: OMDbRepository;

  constructor() {
    this.repository = new OMDbRepository();
  }

  async searchMovies(
    searchTerm: string,
    page: number,
    apiKey: string
  ): Promise<MovieSearchResponse> {
    if (!searchTerm.trim()) {
      throw new Error('검색어를 입력해주세요.');
    }

    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    const response = await this.repository.searchMovies(searchTerm, page, apiKey);
    
    // OMDb API는 HTTP 200을 반환하지만 응답 본문에 Error 필드가 있을 수 있음
    if (response.Response === 'False' && response.Error) {
      if (response.Error.includes('Invalid API key') || response.Error.includes('API key')) {
        throw new Error('API 키가 유효하지 않습니다. API 키 관리에서 올바른 키를 입력해주세요.');
      }
      throw new Error(response.Error);
    }

    return response;
  }

  async getMovieDetail(imdbId: string, apiKey: string): Promise<MovieDetailResponse> {
    if (!imdbId) {
      throw new Error('영화 ID가 필요합니다.');
    }

    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    const response = await this.repository.getMovieById(imdbId, apiKey);
    
    // OMDb API는 HTTP 200을 반환하지만 응답 본문에 Error 필드가 있을 수 있음
    if (response.Response === 'False' && response.Error) {
      if (response.Error.includes('Invalid API key') || response.Error.includes('API key')) {
        throw new Error('API 키가 유효하지 않습니다. API 키 관리에서 올바른 키를 입력해주세요.');
      }
      throw new Error(response.Error);
    }

    return response;
  }
}

export default MovieService;

