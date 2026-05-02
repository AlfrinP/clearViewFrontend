import { getApiBaseUrl } from "./config"
import type { ApiError, HTTPValidationError } from "./types"

function createApiError(
  message: string,
  status: number,
  detail?: HTTPValidationError | unknown
): ApiError {
  return {
    name: "ApiError",
    message,
    status,
    detail,
  }
}

function joinUrl(base: string, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

async function parseJsonBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const base = getApiBaseUrl()
  const url = joinUrl(base, path)
  const headers = new Headers(init?.headers)
  if (!headers.has("Content-Type") && init?.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json")
  }
  const response = await fetch(url, { ...init, headers })

  const data = await parseJsonBody(response)

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    if (typeof data === "string") {
      message = data || message
    } else if (data && typeof data === "object" && "detail" in data) {
      const d = (data as HTTPValidationError).detail
      if (Array.isArray(d) && d.length > 0) {
        message = d.map((x) => x.msg).join("; ")
      }
    }
    throw createApiError(message, response.status, data as HTTPValidationError)
  }

  return data as T
}

export async function requestMultipart<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const base = getApiBaseUrl()
  const url = joinUrl(base, path)
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })

  const data = await parseJsonBody(response)

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    if (typeof data === "string") {
      message = data || message
    } else if (data && typeof data === "object" && "detail" in data) {
      const d = (data as HTTPValidationError).detail
      if (Array.isArray(d) && d.length > 0) {
        message = d.map((x) => x.msg).join("; ")
      }
    }
    throw createApiError(message, response.status, data as HTTPValidationError)
  }

  return data as T
}
