/** Validation error item from FastAPI/Pydantic */
export type ValidationError = {
  loc: (string | number)[]
  msg: string
  type: string
  input?: unknown
  ctx?: Record<string, unknown>
}

export type HTTPValidationError = {
  detail: ValidationError[]
}

export type ExternalSource = {
  title?: string | null
  url?: string | null
  description?: string | null
  score?: number | null
  published_date?: string | null
}

export type VerifyNewsEvaluationDTO = {
  verdict?: string | null
  confidence?: number | null
  needs_external_search?: boolean | null
  evidence_strength?: string | null
  reason?: string | null
}

export type VerifyNewsResultDTO = {
  final_verdict?: string | null
  confidence?: number | null
  justification?: string | null
  sources_used?: string[]
}

export type VerifyNewsRequest = {
  claim: string
}

export type VerifyNewsResponse = {
  claim: string
  evaluation?: VerifyNewsEvaluationDTO
  result?: VerifyNewsResultDTO
  external_sources?: ExternalSource[]
}

export type UploadFileResponse = {
  message: string
  file_title: string
  file_size: number
  file_created_at: string
}

export type FileMetadataDTO = {
  file_id: string
  file_name?: string | null
  file_title?: string | null
  file_size?: number | null
  uploaded_at?: string | null
  /** Appwrite (or storage) URL to open/preview the file in browser */
  view_url?: string | null
  /** Appwrite (or storage) URL to download the file */
  download_url?: string | null
}

export type FilesPageResponse = {
  items: FileMetadataDTO[]
  page: number
  limit: number
  total: number
}

export type DeleteFileResponse = {
  message: string
  file_id: string
}

export type ApiError = {
  name: "ApiError"
  message: string
  status: number
  detail?: HTTPValidationError | unknown
}

export function isApiError(e: unknown): e is ApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "name" in e &&
    (e as ApiError).name === "ApiError"
  )
}
