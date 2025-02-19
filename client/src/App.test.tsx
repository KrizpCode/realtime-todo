import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App Component', () => {
  it('should render the app title in h1', () => {
    render(<App />)

    const heading = screen.getByText('Hello World! 👋')

    expect(heading).toBeInTheDocument()
  })
})
