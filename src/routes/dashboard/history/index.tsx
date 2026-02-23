import { createFileRoute } from '@tanstack/react-router';
import { HistoryPage } from '../../../components/HistoryPage';

export const Route = createFileRoute('/dashboard/history/')({
  component: HistoryRouteComponent,
});

function HistoryRouteComponent() {
  // Wire real conversations and load logic later; for now pass empty data
  return (
    <HistoryPage
      conversations={[]}
      onLoadConversation={() => {
        // no-op for now
      }}
    />
  );
}
