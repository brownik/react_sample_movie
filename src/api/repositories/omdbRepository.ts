import ApiClient from '../client/apiClient';
import type { MovieSearchResponse, MovieDetailResponse } from '../../types/api';

class OMDbRepository {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient('http://www.omdbapi.com');
  }

  async searchMovies(
    searchTerm: string,
    page: number = 1,
    apiKey: string
  ): Promise<MovieSearchResponse> {
    const params = new URLSearchParams({
      apikey: apiKey,
      s: searchTerm,
      page: page.toString(),
      type: 'movie',
    });

    return this.apiClient.get<MovieSearchResponse>(`/?${params.toString()}`);
  }

  async getMovieById(imdbId: string, apiKey: string): Promise<MovieDetailResponse> {
    const params = new URLSearchParams({
      apikey: apiKey,
      i: imdbId,
      plot: 'full',
    });

    return this.apiClient.get<MovieDetailResponse>(`/?${params.toString()}`);
  }
}

export default OMDbRepository;

