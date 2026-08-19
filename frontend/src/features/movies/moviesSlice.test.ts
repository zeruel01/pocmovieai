import { describe, expect, it } from 'vitest'
import moviesReducer, {
  criterionChanged,
  movieSelected,
  searchCleared,
  searchSubmitted,
} from './moviesSlice'

describe('moviesSlice', () => {
  it('trims submitted criteria and clears the previous selection', () => {
    let state = moviesReducer(undefined, { type: 'initial' })
    state = moviesReducer(
      state,
      criterionChanged({ field: 'title', value: '  Matrix  ' }),
    )
    state = moviesReducer(
      state,
      criterionChanged({ field: 'actor', value: ' Keanu ' }),
    )
    state = moviesReducer(state, movieSelected(7))

    state = moviesReducer(state, searchSubmitted())

    expect(state.submittedCriteria).toEqual({
      title: 'Matrix',
      genre: '',
      actor: 'Keanu',
    })
    expect(state.selectedMovieId).toBeNull()
    expect(state.searchRevision).toBe(1)

    state = moviesReducer(state, searchSubmitted())

    expect(state.searchRevision).toBe(2)
  })

  it('clears draft criteria, submitted criteria, and selection', () => {
    let state = moviesReducer(undefined, { type: 'initial' })
    state = moviesReducer(
      state,
      criterionChanged({ field: 'genre', value: 'Action' }),
    )
    state = moviesReducer(state, searchSubmitted())
    state = moviesReducer(state, movieSelected(1))

    state = moviesReducer(state, searchCleared())

    expect(state.criteria).toEqual({ title: '', genre: '', actor: '' })
    expect(state.submittedCriteria).toBeNull()
    expect(state.selectedMovieId).toBeNull()
  })
})