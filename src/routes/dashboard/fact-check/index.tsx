import { createFileRoute } from '@tanstack/react-router';
import { FactCheckingPage } from '../../../features/fact-check/components/FactCheckingPage';

export const Route = createFileRoute('/dashboard/fact-check/')({
  component: FactCheckRouteComponent,
});

function FactCheckRouteComponent() {
  return <FactCheckingPage />;
}
