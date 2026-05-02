import { requestJson } from "./client"
import type { VerifyNewsRequest, VerifyNewsResponse } from "./types"

export async function verifyNews(claim: string): Promise<VerifyNewsResponse> {
  const body: VerifyNewsRequest = { claim }
  return requestJson<VerifyNewsResponse>("/api/v1/verify-news", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
