import axios, { type AxiosError, type AxiosInstance } from "axios"

import { getApiBaseUrl } from "./config"
import type { ApiError, HTTPValidationError } from "./types"

export function createApiError(
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

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<unknown>
    if (ax.response) {
      const status = ax.response.status
      const resData = ax.response.data
      let message = `Request failed (${status})`
      if (typeof resData === "string") {
        message = resData || message
      } else if (
        resData &&
        typeof resData === "object" &&
        "detail" in resData &&
        Array.isArray((resData as HTTPValidationError).detail)
      ) {
        const d = (resData as HTTPValidationError).detail
        if (d.length > 0) {
          message = d.map((x) => x.msg).join("; ")
        }
      }
      return createApiError(message, status, resData as HTTPValidationError)
    }
    if (ax.code === "ECONNABORTED") {
      return createApiError("Request timed out", 0)
    }
    return createApiError(ax.message || "Network error", 0)
  }
  if (error instanceof Error) {
    return createApiError(error.message, 0)
  }
  return createApiError("Request failed", 0)
}

/**
 * Shared Axios instance for the ClearView API. Use this for custom calls, or
 * rely on `verifyNews` / `listFiles` / etc. in the same folder.
 */
export const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: "application/json",
  },
  timeout: 120_000,
  validateStatus: (status) => status >= 200 && status < 300,
})

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl()
    return config
  },
  (error) => Promise.reject(toApiError(error))
)

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
)
