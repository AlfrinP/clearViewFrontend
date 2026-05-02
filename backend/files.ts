import { api } from "./client"
import type {
  DeleteFileResponse,
  FilesPageResponse,
  UploadFileResponse,
} from "./types"

export async function listFiles(
  page = 1,
  limit = 10
): Promise<FilesPageResponse> {
  const { data } = await api.get<FilesPageResponse>("/api/v1/files", {
    params: { page, limit },
  })
  return data
}

export async function uploadFile(
  file: File,
  fileTitle: string
): Promise<UploadFileResponse> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("file_title", fileTitle)
  const { data } = await api.post<UploadFileResponse>(
    "/api/v1/upload-file",
    formData
  )
  return data
}

export async function deleteFile(fileId: string): Promise<DeleteFileResponse> {
  const { data } = await api.delete<DeleteFileResponse>(
    `/api/v1/files/${encodeURIComponent(fileId)}`
  )
  return data
}
