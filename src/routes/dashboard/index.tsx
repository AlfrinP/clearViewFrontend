import { Navigate, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndexComponent,
});

function DashboardIndexComponent() {
  return <Navigate to="/dashboard/fact-check" />;
}
