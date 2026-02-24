import { apiClient } from '../../../services/apiClient';
import type { IngestRequest, IngestResponse } from '../../../types/api';

/**
 * Upload and ingest a document file (PDF)
 */
export const uploadDocumentApi = async (file: File): Promise<IngestResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<IngestResponse>(
    '/api/v1/ingest/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file upload
    }
  );

  return response.data;
};

/**
 * Ingest a document from file path (for server-side files)
 */
export const ingestDocumentApi = async (
  request: IngestRequest
): Promise<IngestResponse> => {
  const response = await apiClient.post<IngestResponse>('/api/v1/ingest', request);

  return response.data;
};

/**
 * Get ingestion status
 */
export const getIngestStatusApi = async (): Promise<Record<string, any>> => {
  const response = await apiClient.get<Record<string, any>>('/api/v1/ingest/status');

  return response.data;
};
