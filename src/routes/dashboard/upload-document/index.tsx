import { createFileRoute } from '@tanstack/react-router';
import { DocumentUploadPage } from '../../../components/DocumentUploadPage';

export const Route = createFileRoute('/dashboard/upload-document/')({
  component: UploadDocumentRouteComponent,
});

function UploadDocumentRouteComponent() {
  return <DocumentUploadPage />;
}
