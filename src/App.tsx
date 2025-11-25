import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MovieListSkeleton } from './components/Skeleton';
import './App.css';

// 코드 스플리팅 - 페이지 지연 로딩
const MovieSearchPage = lazy(() =>
  import('./pages/MovieSearchPage').then((module) => ({
    default: module.MovieSearchPage,
  }))
);

const MovieDetailPage = lazy(() =>
  import('./pages/MovieDetailPage').then((module) => ({
    default: module.MovieDetailPage,
  }))
);

function App() {
  return (
    <ErrorBoundary>
      <ApiKeyProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <MovieListSkeleton count={5} />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<MovieSearchPage />} />
              <Route path="/movie/:imdbId" element={<MovieDetailPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ApiKeyProvider>
    </ErrorBoundary>
  );
}

export default App;
