import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Dashboard!</h3>
    </div>
  );
}
