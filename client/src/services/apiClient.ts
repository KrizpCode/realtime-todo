const VITE_API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'
).replace(/\/$/, '')

const getUrl = (urlPath: string) => {
  const normalizedPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`
  return `${VITE_API_BASE_URL}${normalizedPath}`
}

export const apiClient = {
  get: async <T>(urlPath: string): Promise<T> => {
    const response = await fetch(getUrl(urlPath), {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`GET ${urlPath} failed: ${response.statusText}`)
    }

    return response.json()
  },

  post: async <T>(urlPath: string, body?: unknown): Promise<T> => {
    const response = await fetch(getUrl(urlPath), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      throw new Error(`POST ${urlPath} failed: ${response.statusText}`)
    }

    return response.json()
  },

  put: async <T>(urlPath: string, body: unknown): Promise<T> => {
    const response = await fetch(getUrl(urlPath), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`PUT ${urlPath} failed: ${response.statusText}`)
    }

    return response.json()
  },

  delete: async (urlPath: string) => {
    const response = await fetch(getUrl(urlPath), {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error(`DELETE ${urlPath} failed: ${response.statusText}`)
    }

    return response.json()
  }
}
