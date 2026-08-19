import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
import type {
  MovieDetails,
  MovieSearchCriteria,
  MovieSummary,
  ProblemDetails,
} from '../features/movies/types'

const defaultApiBaseUrl = import.meta.env.MODE === 'test' ? 'http://localhost/api' : '/api'
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? defaultApiBaseUrl

const createSearchParams = (criteria: MovieSearchCriteria) => {
  const params: Record<string, string> = {}

  for (const [key, value] of Object.entries(criteria)) {
    if (value) {
      params[key] = value
    }
  }

  return params
}

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    headers: {
      Accept: 'application/json',
    },
  }),
  endpoints: (builder) => ({
    searchMovies: builder.query<MovieSummary[], MovieSearchCriteria>({
      query: (criteria) => ({
        url: 'movies',
        params: createSearchParams(criteria),
      }),
    }),
    getMovieById: builder.query<MovieDetails, number>({
      query: (id) => `movies/${id}`,
    }),
  }),
})

export const { useGetMovieByIdQuery, useLazySearchMoviesQuery } = moviesApi

export const getApiErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
) => {
  if (!error) {
    return 'An unexpected error occurred.'
  }

  if ('status' in error) {
    const details = error.data as ProblemDetails | undefined
    return details?.detail ?? details?.title ?? 'The movie service could not complete the request.'
  }

  return error.message ?? 'The movie service could not complete the request.'
}