import {
  Alert,
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { ChevronRight, SearchX } from 'lucide-react'
import type { MovieSummary } from '../types'

interface MovieResultsProps {
  movies: MovieSummary[] | undefined
  selectedMovieId: number | null
  isLoading: boolean
  errorMessage: string | null
  onSelect: (id: number) => void
}

export function MovieResults({
  movies,
  selectedMovieId,
  isLoading,
  errorMessage,
  onSelect,
}: MovieResultsProps) {
  if (isLoading) {
    return (
      <Box component="section" aria-labelledby="results-title">
        <Typography id="results-title" component="h2" variant="h5" sx={{ mb: 2 }}>
          Results
        </Typography>
        <Stack role="status" aria-label="Loading movies" spacing={1}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={76} />
          ))}
        </Stack>
      </Box>
    )
  }

  if (errorMessage) {
    return (
      <Box component="section" aria-labelledby="results-title">
        <Typography id="results-title" component="h2" variant="h5" sx={{ mb: 2 }}>
          Results
        </Typography>
        <Alert severity="error" variant="outlined">
          {errorMessage}
        </Alert>
      </Box>
    )
  }

  if (!movies?.length) {
    return (
      <Box component="section" aria-labelledby="results-title">
        <Typography id="results-title" component="h2" variant="h5" sx={{ mb: 2 }}>
          Results
        </Typography>
        <Stack
          role="status"
          spacing={1.5}
          sx={{
            minHeight: 220,
            alignItems: 'center',
            justifyContent: 'center',
            borderBlock: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
          }}
        >
          <SearchX aria-hidden="true" size={34} strokeWidth={1.5} />
          <Typography>No movies found</Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <Box component="section" aria-labelledby="results-title" aria-live="polite">
      <Stack
        direction="row"
        sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: 2 }}
      >
        <Typography id="results-title" component="h2" variant="h5">
          Results
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
        </Typography>
      </Stack>

      <List
        aria-label="Movie search results"
        disablePadding
        sx={{ borderBlock: '1px solid', borderColor: 'divider' }}
      >
        {movies.map((movie) => (
          <ListItem key={movie.id} disablePadding divider>
            <ListItemButton
              selected={selectedMovieId === movie.id}
              aria-label={`View details for ${movie.title}`}
              aria-pressed={selectedMovieId === movie.id}
              onClick={() => onSelect(movie.id)}
              sx={{
                minHeight: 76,
                px: { xs: 1.5, sm: 2 },
                gap: 1.5,
                borderLeft: '3px solid transparent',
                '&.Mui-selected': {
                  borderLeftColor: 'secondary.main',
                  backgroundColor: 'rgba(214, 83, 63, 0.08)',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'rgba(214, 83, 63, 0.12)',
                },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 750 }}>
                  {movie.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.75 }}>
                  <Chip label={movie.genre} size="small" variant="outlined" />
                  <Typography variant="body2" color="text.secondary">
                    {movie.releaseDate.slice(0, 4)}
                  </Typography>
                </Stack>
              </Box>
              <ChevronRight aria-hidden="true" size={20} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}