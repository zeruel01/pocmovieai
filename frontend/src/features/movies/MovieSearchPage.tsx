import { lazy, Suspense, useEffect } from 'react'
import { Box, Container, Skeleton, Stack, Typography } from '@mui/material'
import { Film } from 'lucide-react'
import {
  getApiErrorMessage,
  useLazySearchMoviesQuery,
} from '../../api/moviesApi'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { movieSelected } from './moviesSlice'
import { MovieSearchForm } from './components/MovieSearchForm'

const MovieResults = lazy(async () => {
  const module = await import('./components/MovieResults')
  return { default: module.MovieResults }
})
const MovieDetailsPanel = lazy(async () => {
  const module = await import('./components/MovieDetailsPanel')
  return { default: module.MovieDetailsPanel }
})

export function MovieSearchPage() {
  const dispatch = useAppDispatch()
  const { submittedCriteria, selectedMovieId, searchRevision } = useAppSelector(
    (state) => state.movies,
  )
  const hasSearched = submittedCriteria !== null
  const [searchMovies, {
    currentData: movies,
    isFetching,
    error,
  }] = useLazySearchMoviesQuery()

  useEffect(() => {
    if (submittedCriteria) {
      void searchMovies(submittedCriteria, false)
    }
  }, [searchMovies, searchRevision, submittedCriteria])

  return (
    <Box sx={{ minHeight: '100svh' }}>
      <Box component="header" sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box>
              <Typography component="p" variant="overline" sx={{ color: '#f0a897', mb: 0.5 }}>
                FrameFinder
              </Typography>
              <Typography
                component="h1"
                variant="h1"
                sx={{ fontSize: { xs: '2.4rem', sm: '3.2rem' }, lineHeight: 1 }}
              >
                Movie Search
              </Typography>
            </Box>
            <Box
              aria-hidden="true"
              sx={{
                display: { xs: 'none', sm: 'grid' },
                placeItems: 'center',
                width: 72,
                height: 72,
                border: '1px solid rgba(255, 255, 255, 0.32)',
                borderRadius: '50%',
                color: '#f0a897',
              }}
            >
              <Film size={34} strokeWidth={1.5} />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="lg"
        className="app-enter"
        sx={{ py: { xs: 2.5, sm: 4 } }}
      >
        <MovieSearchForm isSearching={isFetching} hasSearched={hasSearched} />

        {hasSearched && (
          <Box
            className="workspace-enter"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.35fr) minmax(340px, 0.65fr)' },
              alignItems: 'start',
              gap: { xs: 3, lg: 4 },
              mt: { xs: 3, sm: 4 },
            }}
          >
            <Suspense
              fallback={
                <Skeleton
                  role="status"
                  aria-label="Loading movies"
                  variant="rounded"
                  height={300}
                />
              }
            >
              <MovieResults
                movies={movies}
                selectedMovieId={selectedMovieId}
                isLoading={isFetching}
                errorMessage={error ? getApiErrorMessage(error) : null}
                onSelect={(id) => dispatch(movieSelected(id))}
              />
            </Suspense>
            <Suspense
              fallback={
                <Skeleton
                  role="status"
                  aria-label="Loading movie details panel"
                  variant="rounded"
                  height={360}
                />
              }
            >
              <MovieDetailsPanel movieId={selectedMovieId} />
            </Suspense>
          </Box>
        )}
      </Container>
    </Box>
  )
}