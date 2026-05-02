const DEFAULT_BASE = "http://localhost:8000"

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim()
  if (!url) {
    return DEFAULT_BASE
  }
  return url.replace(/\/$/, "")
}
