import { createFileRoute } from '@tanstack/react-router';
import { DocumentUploadPage } from '../../../features/upload-document/components/DocumentUploadPage';

export const Route = createFileRoute('/dashboard/upload-document/')({
  component: UploadDocumentRouteComponent,
});

function UploadDocumentRouteComponent() {
  return <DocumentUploadPage />;
}
