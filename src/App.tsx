import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ApiKeyProvider } from './contexts/ApiKeyContext'
import { MovieSearchPage } from './pages/MovieSearchPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import './App.css'

function App() {
  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieSearchPage />} />
          <Route path="/movie/:imdbId" element={<MovieDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ApiKeyProvider>
  )
}

export default App
