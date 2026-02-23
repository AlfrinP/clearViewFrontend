import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/history')({
  component: HistoryComponent,
});

function HistoryComponent() {
  return (
    <div className="p-2">
      <h3>Welcome History!</h3>
    </div>
  );
}
