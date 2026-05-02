import { api } from "./client"
import type { VerifyNewsRequest, VerifyNewsResponse } from "./types"

export async function verifyNews(claim: string): Promise<VerifyNewsResponse> {
  const body: VerifyNewsRequest = { claim }
  const { data } = await api.post<VerifyNewsResponse>(
    "/api/v1/verify-news",
    body
  )
  return data
}
