import { configureStore } from '@reduxjs/toolkit'
import { moviesApi } from '../api/moviesApi'
import moviesReducer from '../features/movies/moviesSlice'

export const createAppStore = () =>
  configureStore({
    reducer: {
      movies: moviesReducer,
      [moviesApi.reducerPath]: moviesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(moviesApi.middleware),
  })

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']