import { Navigate, createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: IndexRouteComponent,
});

function IndexRouteComponent() {
  return <Navigate to="/dashboard" />;
}
