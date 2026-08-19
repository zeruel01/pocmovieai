import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { CalendarDays, Film, UsersRound } from 'lucide-react'
import { getApiErrorMessage, useGetMovieByIdQuery } from '../../../api/moviesApi'

interface MovieDetailsPanelProps {
  movieId: number | null
}

const formatReleaseDate = (releaseDate: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${releaseDate}T00:00:00Z`))

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

export function MovieDetailsPanel({ movieId }: MovieDetailsPanelProps) {
  const {
    currentData: movie,
    isFetching,
    error,
  } = useGetMovieByIdQuery(movieId ?? 0, { skip: movieId === null })

  return (
    <Paper
      component="aside"
      aria-labelledby="details-title"
      elevation={0}
      sx={{
        minHeight: 360,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          color: 'primary.contrastText',
          backgroundColor: 'primary.main',
        }}
      >
        <Typography id="details-title" component="h2" variant="h6" sx={{ fontWeight: 750 }}>
          Movie details
        </Typography>
      </Box>

      {movieId === null ? (
        <Stack
          spacing={1.5}
          sx={{
            minHeight: 300,
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
            p: 3,
          }}
        >
          <Film aria-hidden="true" size={38} strokeWidth={1.4} />
          <Typography>No movie selected</Typography>
        </Stack>
      ) : isFetching ? (
        <Stack role="status" aria-label="Loading movie details" spacing={1.5} sx={{ p: 3 }}>
          <Skeleton variant="text" width="72%" height={44} />
          <Skeleton variant="text" width="45%" />
          <Skeleton variant="rounded" height={96} />
          <Skeleton variant="text" width="35%" />
          <Skeleton variant="rounded" height={132} />
        </Stack>
      ) : error ? (
        <Box sx={{ p: 2.5 }}>
          <Alert severity="error" variant="outlined">
            {getApiErrorMessage(error)}
          </Alert>
        </Box>
      ) : movie ? (
        <Box className="details-enter" sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Typography component="h3" variant="h4" sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
            {movie.title}
          </Typography>

          <Stack
            direction="row"
            sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1.5 }}
          >
            <Chip label={movie.genre} color="secondary" size="small" />
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: 'center', color: 'text.secondary' }}
            >
              <CalendarDays aria-hidden="true" size={17} />
              <Typography variant="body2">{formatReleaseDate(movie.releaseDate)}</Typography>
            </Stack>
          </Stack>

          <Typography color="text.secondary" sx={{ mt: 2.5, lineHeight: 1.75 }}>
            {movie.description}
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <UsersRound aria-hidden="true" size={19} />
            <Typography component="h4" sx={{ fontWeight: 800 }}>
              Cast
            </Typography>
          </Stack>

          <List disablePadding sx={{ mt: 1 }}>
            {movie.actors.map((actor) => (
              <ListItem key={actor.id} disableGutters divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: 'info.main',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {getInitials(actor.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={actor.name}
                  sx={{ '& .MuiListItemText-primary': { fontWeight: 650 } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}
    </Paper>
  )
}