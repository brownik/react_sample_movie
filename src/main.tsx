import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // 서버 에러나 네트워크 에러는 재시도
        if (error?.isNetworkError || error?.isServerError || error?.isTimeoutError) {
          return failureCount < 2; // 최대 2번 재시도
        }
        // 인증 에러는 재시도하지 않음
        if (error?.isAuthError || error?.status === 401) {
          return false;
        }
        // 기타 에러는 1번만 재시도
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => {
        // 지수 백오프: 1초, 2초, 4초...
        return Math.min(1000 * Math.pow(2, attemptIndex), 5000);
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
