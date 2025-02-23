export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.statusText}`)
    }

    return response.json()
  },

  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.statusText}`)
    }

    return response.json()
  },

  put: async <T>(url: string, body: unknown): Promise<T> => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`PUT ${url} failed: ${response.statusText}`)
    }

    return response.json()
  }
}
