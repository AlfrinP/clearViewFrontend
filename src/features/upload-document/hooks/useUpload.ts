import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query';
import { uploadDocumentApi, getIngestStatusApi, ingestDocumentApi } from '../api/uploadApi';
import type { IngestRequest, IngestResponse } from '../../../types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface UseUploadDocumentOptions {
  onSuccess?: (data: IngestResponse) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

/**
 * Hook to upload and ingest a document
 */
export const useUploadDocument = (options?: UseUploadDocumentOptions) => {
  return useMutation<IngestResponse, AxiosError, File>({
    mutationFn: (file: File) => uploadDocumentApi(file),
    onSuccess: data => {
      if (data.status === 'success') {
        toast.success(
          `Document uploaded successfully! ${data.documents_ingested} documents ingested.`,
        );
      } else {
        toast.warning(data.message || 'Document uploaded with warnings');
      }

      // Call custom success handler if provided
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError) => {
      console.error('Upload error:', error);

      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        (error as any).message ||
        'Failed to upload document. Please try again.';

      toast.error(errorMessage);

      // Call custom error handler if provided
      options?.onError?.(error as Error);
    },
  });
};

/**
 * Hook to ingest a document from file path
 */
export const useIngestDocument = (options?: UseUploadDocumentOptions) => {
  return useMutation<IngestResponse, AxiosError, IngestRequest>({
    mutationFn: (request: IngestRequest) => ingestDocumentApi(request),
    onSuccess: data => {
      if (data.status === 'success') {
        toast.success(
          `Document ingested successfully! ${data.documents_ingested} documents processed.`,
        );
      } else {
        toast.warning(data.message || 'Document ingested with warnings');
      }

      options?.onSuccess?.(data);
    },
    onError: error => {
      console.error('Ingest error:', error);

      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        (error as any).message ||
        'Failed to ingest document. Please try again.';

      toast.error(errorMessage);

      options?.onError?.(error as Error);
    },
  });
};

/**
 * Hook to get ingestion status
 */
export const useIngestStatus = () => {
  return useQuery({
    queryKey: ['ingest-status'],
    queryFn: getIngestStatusApi,
    refetchInterval: false, // Only fetch when explicitly requested
    retry: 1,
  });
};

/**
 * Mutation options type for custom usage
 */
export type UploadDocumentMutationOptions = UseMutationOptions<IngestResponse, AxiosError, File>;
