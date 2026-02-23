import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/upload-document')({
  component: UploadDocumentComponent,
});

function UploadDocumentComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Upload Document!</h3>
    </div>
  );
}
