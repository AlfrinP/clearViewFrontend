import { requestJson, requestMultipart } from "./client"
import type {
  DeleteFileResponse,
  FilesPageResponse,
  UploadFileResponse,
} from "./types"

export async function listFiles(
  page = 1,
  limit = 10
): Promise<FilesPageResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  return requestJson<FilesPageResponse>(`/api/v1/files?${params.toString()}`, {
    method: "GET",
  })
}

export async function uploadFile(
  file: File,
  fileTitle: string
): Promise<UploadFileResponse> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("file_title", fileTitle)
  return requestMultipart<UploadFileResponse>("/api/v1/upload-file", formData)
}

export async function deleteFile(fileId: string): Promise<DeleteFileResponse> {
  return requestJson<DeleteFileResponse>(`/api/v1/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
  })
}
