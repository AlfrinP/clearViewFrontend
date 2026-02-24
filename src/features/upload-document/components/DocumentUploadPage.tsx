import { useState } from 'react';
import { Upload, X, CheckCircle, Loader2, FileText, DotIcon, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { DocumentUploadInfo } from '../../../utils/constants';
import { useUploadDocument } from '../hooks/useUpload';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: 'uploading' | 'success' | 'error';
  file: File;
  documentsIngested?: number;
  errorMessage?: string;
}

export function DocumentUploadPage() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { mutate: uploadDocument } = useUploadDocument({
    onSuccess: (data, variables) => {
      // Find the document by file reference
      setDocuments(prev =>
        prev.map(doc => {
          if (doc.file === variables) {
            return {
              ...doc,
              status: 'success' as const,
              documentsIngested: data.documents_ingested,
            };
          }
          return doc;
        })
      );
    },
    onError: (error, variables) => {
      // Find the document by file reference
      setDocuments(prev =>
        prev.map(doc => {
          if (doc.file === variables) {
            return {
              ...doc,
              status: 'error' as const,
              errorMessage: (error as any).message || 'Upload failed',
            };
          }
          return doc;
        })
      );
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // Filter for PDF files only (as per API spec)
    const pdfFiles = fileArray.filter(file => {
      if (file.type !== 'application/pdf') {
        // Show error toast for non-PDF files
        return false;
      }
      return true;
    });

    if (pdfFiles.length === 0) {
      return;
    }

    const newDocs: UploadedDocument[] = pdfFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      status: 'uploading' as const,
      file: file,
    }));

    setDocuments(prev => [...prev, ...newDocs]);

    // Upload each file
    newDocs.forEach(doc => {
      uploadDocument(doc.file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto pt-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Policy Documents</h1>
          <p className="text-gray-600">
            Upload government or medical policy documents (PDF only) to enhance fact-checking accuracy
          </p>
        </div>

        {/* Upload Area */}
        <Card
          className={`p-8 mb-6 shadow-xl transition-all ${
            isDragging ? 'border-indigo-500 border-2 bg-indigo-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
              <Upload className="size-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Drop files here or click to upload</h2>
            <p className="text-gray-600 mb-6">Supported format: PDF only</p>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,application/pdf"
              onChange={e => handleFileSelect(e.target.files)}
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              <Upload className="mr-2 size-5" />
              Select PDF Files
            </Button>
          </div>
        </Card>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <Card className="p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3>Uploaded Documents ({documents.length})</h3>
              {documents.some(doc => doc.status === 'success') && (
                <Badge className="bg-green-100 text-green-800">
                  {documents.filter(doc => doc.status === 'success').length} Processed
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-white rounded-lg">
                      <FileText className="size-6 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {doc.status === 'uploading' && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="size-5 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                    {doc.status === 'success' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="size-5" />
                        <span className="text-sm">
                          {doc.documentsIngested
                            ? `Uploaded (${doc.documentsIngested} docs)`
                            : 'Uploaded'}
                        </span>
                      </div>
                    )}
                    {doc.status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="size-5" />
                        <span className="text-sm" title={doc.errorMessage}>
                          Failed
                        </span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                      disabled={doc.status === 'uploading'}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Section */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About Policy Documents</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {DocumentUploadInfo.map((info: string, index: number) => (
              <li key={index} className="flex items-center justify-start gap-2">
                <DotIcon className="size-5 text-indigo-600" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
