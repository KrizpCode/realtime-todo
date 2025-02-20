import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import RegisterPage from '.'

describe('Register Page', () => {
  it('should render the Register page', () => {
    render(<RegisterPage />)

    screen.debug()

    const form = screen.getByRole('form')

    expect(within(form).getByLabelText(/name/i)).toBeInTheDocument()
    expect(within(form).getByLabelText(/email/i)).toBeInTheDocument()
    expect(within(form).getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(
      within(form).getByLabelText(/^confirm password$/i)
    ).toBeInTheDocument()

    const submitButton = within(form).getByRole('button', { name: /register/i })

    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeEnabled()
  })
})
