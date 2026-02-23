import { createFileRoute } from '@tanstack/react-router';
import { FactCheckingPage } from '../../components/FactCheckingPage';

export const Route = createFileRoute('/dashboard/fact-check')({
  component: FactCheckRouteComponent,
});

function FactCheckRouteComponent() {
  return <FactCheckingPage />;
}

