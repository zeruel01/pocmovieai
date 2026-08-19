import type { FormEvent } from 'react'
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  Clapperboard,
  LoaderCircle,
  RotateCcw,
  Search,
  Tags,
  UserRound,
} from 'lucide-react'
import { moviesApi } from '../../../api/moviesApi'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  criterionChanged,
  searchCleared,
  searchSubmitted,
} from '../moviesSlice'

interface MovieSearchFormProps {
  isSearching: boolean
  hasSearched: boolean
}

export function MovieSearchForm({
  isSearching,
  hasSearched,
}: MovieSearchFormProps) {
  const dispatch = useAppDispatch()
  const criteria = useAppSelector((state) => state.movies.criteria)
  const hasInput = Object.values(criteria).some((value) => value.length > 0)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(searchSubmitted())
  }

  const handleClear = () => {
    dispatch(searchCleared())
    dispatch(moviesApi.util.resetApiState())
  }

  return (
    <Paper
      component="form"
      aria-labelledby="search-form-title"
      aria-busy={isSearching}
      elevation={0}
      onSubmit={handleSubmit}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderTop: '4px solid',
        borderTopColor: 'secondary.main',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Typography
        id="search-form-title"
        component="h2"
        variant="h5"
        sx={{ mb: 2.5, fontFamily: '"Newsreader Variable", serif', fontWeight: 600 }}
      >
        Search criteria
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          id="movie-title"
          label="Movie title"
          value={criteria.title}
          onChange={(event) =>
            dispatch(
              criterionChanged({ field: 'title', value: event.target.value }),
            )
          }
          slotProps={{
            htmlInput: { maxLength: 200 },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Clapperboard aria-hidden="true" size={19} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth
          id="movie-genre"
          label="Genre"
          value={criteria.genre}
          onChange={(event) =>
            dispatch(
              criterionChanged({ field: 'genre', value: event.target.value }),
            )
          }
          slotProps={{
            htmlInput: { maxLength: 100 },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Tags aria-hidden="true" size={19} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth
          id="movie-actor"
          label="Actor name"
          value={criteria.actor}
          onChange={(event) =>
            dispatch(
              criterionChanged({ field: 'actor', value: event.target.value }),
            )
          }
          slotProps={{
            htmlInput: { maxLength: 200 },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <UserRound aria-hidden="true" size={19} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.25}
        sx={{ justifyContent: 'flex-end', mt: 2.5 }}
      >
        <Button
          type="button"
          variant="outlined"
          color="primary"
          startIcon={<RotateCcw aria-hidden="true" size={18} />}
          disabled={!hasInput && !hasSearched}
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSearching}
          startIcon={
            isSearching ? (
              <LoaderCircle aria-hidden="true" className="spin-icon" size={18} />
            ) : (
              <Search aria-hidden="true" size={18} />
            )
          }
          sx={{ minWidth: 132 }}
        >
          {isSearching ? 'Searching' : 'Search'}
        </Button>
      </Stack>
    </Paper>
  )
}