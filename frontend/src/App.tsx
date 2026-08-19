import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './app/theme'
import { MovieSearchPage } from './features/movies/MovieSearchPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MovieSearchPage />
    </ThemeProvider>
  )
}

export default App
