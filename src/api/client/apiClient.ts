import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_TIMEOUT } from '../../constants/app';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // 서버 응답이 있는 경우
          const status = error.response.status;
          const data = error.response.data;
          
          console.error('API Error:', {
            status,
            data,
            url: error.config?.url,
          });

          // 401 Unauthorized 에러 처리
          if (status === 401) {
            const authError = new Error('API 키가 유효하지 않거나 만료되었습니다. API 키 관리에서 올바른 키를 입력해주세요.');
            (authError as any).status = 401;
            (authError as any).isAuthError = true;
            return Promise.reject(authError);
          }

          // 403 Forbidden 에러 처리
          if (status === 403) {
            const forbiddenError = new Error('API 접근이 거부되었습니다. API 키 권한을 확인해주세요.');
            (forbiddenError as any).status = 403;
            return Promise.reject(forbiddenError);
          }

          // 기타 HTTP 에러
          const httpError = new Error(
            data?.Error || data?.message || `서버 오류가 발생했습니다. (${status})`
          );
          (httpError as any).status = status;
          return Promise.reject(httpError);
        } else if (error.request) {
          // 요청은 보냈지만 응답이 없는 경우
          console.error('Network Error:', error.request);
          
          // 타임아웃 에러 확인
          if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            const timeoutError = new Error('요청 시간이 초과되었습니다. OMDb API 서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.');
            (timeoutError as any).isTimeoutError = true;
            (timeoutError as any).isNetworkError = true;
            return Promise.reject(timeoutError);
          }

          // 연결 실패 에러 (서버 과부하, 소켓 버퍼 부족 등)
          if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message.includes('socket')) {
            const serverError = new Error('OMDb API 서버에 연결할 수 없습니다. 서버가 과부하 상태이거나 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
            (serverError as any).isServerError = true;
            (serverError as any).isNetworkError = true;
            return Promise.reject(serverError);
          }

          const networkError = new Error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
          (networkError as any).isNetworkError = true;
          return Promise.reject(networkError);
        } else {
          // 요청 설정 중 오류가 발생한 경우
          console.error('Error:', error.message);
          
          // 소켓 관련 에러 확인
          if (error.message.includes('socket') || error.message.includes('buffer space') || error.message.includes('queue')) {
            const socketError = new Error('OMDb API 서버가 과부하 상태입니다. 서버의 소켓 버퍼가 가득 찼거나 큐가 꽉 찼습니다. 잠시 후 다시 시도해주세요.');
            (socketError as any).isServerError = true;
            return Promise.reject(socketError);
          }
          
          return Promise.reject(error);
        }
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (import.meta.env.DEV) {
      const fullUrl = new URL(url, this.client.defaults.baseURL);
      console.debug('[OMDb][GET]', fullUrl.toString());
    }
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export default ApiClient;

