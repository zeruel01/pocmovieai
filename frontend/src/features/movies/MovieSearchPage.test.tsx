import { Provider } from 'react-redux'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { createAppStore } from '../../app/store'
import { server } from '../../test/server'

const matrixResults = [
  {
    id: 1,
    title: 'The Matrix',
    genre: 'Action',
    releaseDate: '1999-03-31',
  },
  {
    id: 2,
    title: 'The Matrix Reloaded',
    genre: 'Action',
    releaseDate: '2003-05-15',
  },
]

const matrixDetails = {
  ...matrixResults[0],
  description: 'A hacker discovers that reality is a simulation.',
  actors: [
    { id: 3, name: 'Carrie-Anne Moss' },
    { id: 1, name: 'Keanu Reeves' },
    { id: 2, name: 'Laurence Fishburne' },
  ],
}

const createDeferred = () => {
  let resolve!: () => void
  const promise = new Promise<void>((complete) => {
    resolve = complete
  })

  return { promise, resolve }
}

const renderApplication = () => {
  const store = createAppStore()
  const user = userEvent.setup()

  render(
    <Provider store={store}>
      <App />
    </Provider>,
  )

  return { store, user }
}

describe('MovieSearchPage', () => {
  it('searches with combined criteria, displays results below the form, and loads details', async () => {
    server.use(
      http.get('http://localhost/api/movies', ({ request }) => {
        const url = new URL(request.url)
        expect(url.searchParams.get('title')).toBe('Matrix')
        expect(url.searchParams.get('genre')).toBe('Action')
        expect(url.searchParams.get('actor')).toBe('Keanu')
        return HttpResponse.json(matrixResults)
      }),
      http.get('http://localhost/api/movies/1', () =>
        HttpResponse.json(matrixDetails),
      ),
    )
    const { user } = renderApplication()
    const form = screen.getByRole('form', { name: 'Search criteria' })

    await user.type(screen.getByLabelText('Movie title'), 'Matrix')
    await user.type(screen.getByLabelText('Genre'), 'Action')
    await user.type(screen.getByLabelText('Actor name'), 'Keanu')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    const results = await screen.findByRole('region', { name: 'Results' })
    expect(screen.getByText('2 movies')).toBeInTheDocument()
    expect(
      form.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    await user.click(
      screen.getByRole('button', { name: 'View details for The Matrix' }),
    )

    expect(
      await screen.findByRole('heading', { level: 3, name: 'The Matrix' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('A hacker discovers that reality is a simulation.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Carrie-Anne Moss')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByLabelText('Movie title')).toHaveValue('')
    expect(screen.queryByRole('region', { name: 'Results' })).not.toBeInTheDocument()
  })

  it('displays a loading state while a search is pending', async () => {
    const searchRequest = createDeferred()
    server.use(
      http.get('http://localhost/api/movies', async () => {
        await searchRequest.promise
        return HttpResponse.json(matrixResults)
      }),
    )
    const { user } = renderApplication()

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(
      await screen.findByRole('status', { name: 'Loading movies' }),
    ).toBeInTheDocument()

    searchRequest.resolve()
    expect(await screen.findByText('2 movies')).toBeInTheDocument()
  })

  it('displays the empty-result state', async () => {
    server.use(
      http.get('http://localhost/api/movies', () => HttpResponse.json([])),
    )
    const { user } = renderApplication()

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('No movies found')).toBeInTheDocument()
  })

  it('supports keyboard selection and displays a details request error', async () => {
    const detailsRequest = createDeferred()
    server.use(
      http.get('http://localhost/api/movies', () =>
        HttpResponse.json(matrixResults),
      ),
      http.get('http://localhost/api/movies/1', async () => {
        await detailsRequest.promise
        return HttpResponse.json(
          { detail: 'Movie details are temporarily unavailable.' },
          { status: 503 },
        )
      }),
    )
    const { user } = renderApplication()

    await user.click(screen.getByRole('button', { name: 'Search' }))
    const firstMovie = await screen.findByRole('button', {
      name: /^View details for The Matrix$/,
    })
    firstMovie.focus()

    expect(firstMovie).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(
      await screen.findByRole('status', { name: 'Loading movie details' }),
    ).toBeInTheDocument()

    detailsRequest.resolve()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Movie details are temporarily unavailable.',
    )
  })

  it('recovers from a details error when another movie is selected', async () => {
    server.use(
      http.get('http://localhost/api/movies', () =>
        HttpResponse.json(matrixResults),
      ),
      http.get('http://localhost/api/movies/:id', ({ params }) => {
        if (params.id === '1') {
          return HttpResponse.json(
            { detail: 'The first movie could not be loaded.' },
            { status: 503 },
          )
        }

        return HttpResponse.json({
          ...matrixResults[1],
          description: 'Neo returns to defend Zion from the machines.',
          actors: [{ id: 1, name: 'Keanu Reeves' }],
        })
      }),
    )
    const { user } = renderApplication()

    await user.click(screen.getByRole('button', { name: 'Search' }))
    await user.click(
      await screen.findByRole('button', {
        name: /^View details for The Matrix$/,
      }),
    )
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The first movie could not be loaded.',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'View details for The Matrix Reloaded',
      }),
    )

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: 'The Matrix Reloaded',
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('clears an in-flight search without restoring stale results', async () => {
    const searchRequest = createDeferred()
    let requestCompleted = false
    server.use(
      http.get('http://localhost/api/movies', async () => {
        await searchRequest.promise
        requestCompleted = true
        return HttpResponse.json(matrixResults)
      }),
    )
    const { user } = renderApplication()

    await user.type(screen.getByLabelText('Movie title'), 'Matrix')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(
      await screen.findByRole('status', { name: 'Loading movies' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByLabelText('Movie title')).toHaveValue('')
    expect(screen.queryByRole('region', { name: 'Results' })).not.toBeInTheDocument()
    searchRequest.resolve()
    await waitFor(() => expect(requestCompleted).toBe(true))
    expect(screen.queryByRole('region', { name: 'Results' })).not.toBeInTheDocument()
  })

  it('enforces the backend-aligned maximum lengths in search fields', async () => {
    const { user } = renderApplication()
    const titleInput = screen.getByLabelText('Movie title')
    const genreInput = screen.getByLabelText('Genre')
    const actorInput = screen.getByLabelText('Actor name')

    await user.click(titleInput)
    await user.paste('x'.repeat(205))
    await user.click(genreInput)
    await user.paste('x'.repeat(105))
    await user.click(actorInput)
    await user.paste('x'.repeat(205))

    expect(titleInput).toHaveValue('x'.repeat(200))
    expect(genreInput).toHaveValue('x'.repeat(100))
    expect(actorInput).toHaveValue('x'.repeat(200))
  })

  it('displays the API problem detail when search fails', async () => {
    let requestCount = 0
    server.use(
      http.get('http://localhost/api/movies', () => {
        requestCount += 1

        if (requestCount === 1) {
          return HttpResponse.json(
            { title: 'Service unavailable', detail: 'Try the search again shortly.' },
            { status: 503 },
          )
        }

        return HttpResponse.json(matrixResults)
      }),
    )
    const { user } = renderApplication()

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Try the search again shortly.',
    )

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('2 movies')).toBeInTheDocument()
    expect(requestCount).toBe(2)
  })
})