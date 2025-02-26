export class ApiError extends Error {
  status: number
  message: string

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
  }
}

const VITE_API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'
).replace(/\/$/, '')

const getUrl = (urlPath: string) => {
  const normalizedPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`
  return `${VITE_API_BASE_URL}${normalizedPath}`
}

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  urlPath: string,
  body?: unknown
): Promise<T> => {
  try {
    const response = await fetch(getUrl(urlPath), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    })

    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData?.message || 'Request failed'
      )
    }

    return responseData
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(500, 'An unexpected error occurred')
  }
}

export const apiClient = {
  get: <T>(urlPath: string) => request<T>('GET', urlPath),
  post: <T>(urlPath: string, body?: unknown) =>
    request<T>('POST', urlPath, body),
  put: <T>(urlPath: string, body: unknown) => request<T>('PUT', urlPath, body),
  delete: <T>(urlPath: string) => request<T>('DELETE', urlPath)
}
