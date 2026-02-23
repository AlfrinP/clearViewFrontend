import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '../../../components/SettingsPage';

export const Route = createFileRoute('/dashboard/settings/')({
  component: SettingsRouteComponent,
});

function SettingsRouteComponent() {
  // Replace with real user info when auth is wired up
  return <SettingsPage userName="User" userEmail="user@example.com" />;
}
