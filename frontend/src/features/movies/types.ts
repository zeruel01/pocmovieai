export interface MovieSearchCriteria {
  title: string
  genre: string
  actor: string
}

export interface MovieSummary {
  id: number
  title: string
  genre: string
  releaseDate: string
}

export interface Actor {
  id: number
  name: string
}

export interface MovieDetails extends MovieSummary {
  description: string
  actors: Actor[]
}

export interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}

export const createEmptySearchCriteria = (): MovieSearchCriteria => ({
  title: '',
  genre: '',
  actor: '',
})