import ApiClient from '../client/apiClient';
import type { MovieSearchResponse, MovieDetailResponse } from '../../types/api';
import { OMDB_API_BASE_URL } from '../../constants/omdb';

class OMDbRepository {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(OMDB_API_BASE_URL);
  }

  async searchMovies(
    searchTerm: string,
    page: number = 1,
    apiKey: string,
    year?: string
  ): Promise<MovieSearchResponse> {
    const params = new URLSearchParams({
      apikey: apiKey,
      s: searchTerm,
      page: page.toString(),
      type: 'movie',
    });

    if (year) {
      params.append('y', year);
    }

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

