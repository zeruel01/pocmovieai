import * as axe from 'axe-core'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { createAppStore } from '../../app/store'
import { server } from '../../test/server'

const axeOptions: axe.RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
}

const renderApplication = () => {
  const user = userEvent.setup()
  const result = render(
    <Provider store={createAppStore()}>
      <App />
    </Provider>,
  )

  return { ...result, user }
}

const expectNoViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, axeOptions)
  expect(results.violations).toEqual([])
}

describe('MovieSearch accessibility', () => {
  it('has no detectable semantic violations in the initial state', async () => {
    const { container } = renderApplication()

    await expectNoViolations(container)
  })

  it('has no detectable semantic violations with results and details', async () => {
    server.use(
      http.get('http://localhost/api/movies', () =>
        HttpResponse.json([
          {
            id: 1,
            title: 'The Matrix',
            genre: 'Action',
            releaseDate: '1999-03-31',
          },
        ]),
      ),
      http.get('http://localhost/api/movies/1', () =>
        HttpResponse.json({
          id: 1,
          title: 'The Matrix',
          genre: 'Action',
          description: 'A hacker discovers that reality is a simulation.',
          releaseDate: '1999-03-31',
          actors: [
            { id: 3, name: 'Carrie-Anne Moss' },
            { id: 1, name: 'Keanu Reeves' },
            { id: 2, name: 'Laurence Fishburne' },
          ],
        }),
      ),
    )
    const { container, user } = renderApplication()

    await user.click(screen.getByRole('button', { name: 'Search' }))
    await user.click(
      await screen.findByRole('button', {
        name: 'View details for The Matrix',
      }),
    )
    await screen.findByRole('heading', { level: 3, name: 'The Matrix' })

    await expectNoViolations(container)
  })
})