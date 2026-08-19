import { describe, expect, it } from 'vitest'
import { getApiErrorMessage } from './moviesApi'

describe('getApiErrorMessage', () => {
  it('returns the unexpected-error fallback when no error is available', () => {
    expect(getApiErrorMessage(undefined)).toBe('An unexpected error occurred.')
  })

  it('uses an HTTP problem title when no detail is provided', () => {
    expect(
      getApiErrorMessage({
        status: 503,
        data: { title: 'Service unavailable' },
      }),
    ).toBe('Service unavailable')
  })

  it('uses the service fallback for an HTTP error without problem details', () => {
    expect(getApiErrorMessage({ status: 500, data: null })).toBe(
      'The movie service could not complete the request.',
    )
  })

  it('preserves a serialized network error message', () => {
    expect(getApiErrorMessage({ message: 'Network connection failed.' })).toBe(
      'Network connection failed.',
    )
  })
})