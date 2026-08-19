import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  createEmptySearchCriteria,
  type MovieSearchCriteria,
} from './types'

interface MoviesState {
  criteria: MovieSearchCriteria
  submittedCriteria: MovieSearchCriteria | null
  selectedMovieId: number | null
  searchRevision: number
}

const initialState: MoviesState = {
  criteria: createEmptySearchCriteria(),
  submittedCriteria: null,
  selectedMovieId: null,
  searchRevision: 0,
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    criterionChanged: (
      state,
      action: PayloadAction<{
        field: keyof MovieSearchCriteria
        value: string
      }>,
    ) => {
      state.criteria[action.payload.field] = action.payload.value
    },
    searchSubmitted: (state) => {
      state.submittedCriteria = {
        title: state.criteria.title.trim(),
        genre: state.criteria.genre.trim(),
        actor: state.criteria.actor.trim(),
      }
      state.selectedMovieId = null
      state.searchRevision += 1
    },
    movieSelected: (state, action: PayloadAction<number>) => {
      state.selectedMovieId = action.payload
    },
    searchCleared: (state) => {
      state.criteria = createEmptySearchCriteria()
      state.submittedCriteria = null
      state.selectedMovieId = null
    },
  },
})

export const {
  criterionChanged,
  movieSelected,
  searchCleared,
  searchSubmitted,
} = moviesSlice.actions

export default moviesSlice.reducer