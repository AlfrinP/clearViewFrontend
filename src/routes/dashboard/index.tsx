import { useState } from 'react';
import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { Sidebar } from '../../components/Sidebar';

type PageId = 'fact-check' | 'upload' | 'history' | 'settings';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardComponent,
});

function DashboardComponent() {
  const navigate = useNavigate();

  // Simple in-memory conversations list for now
  const [conversations] = useState<
    Array<{ id: string; claim: string; verdict: string; timestamp: Date }>
  >([]);

  const location = useRouterState({ select: s => s.location.pathname });

  const activePage: PageId = location.startsWith('/dashboard/history')
    ? 'history'
    : location.startsWith('/dashboard/upload-document')
      ? 'upload'
      : location.startsWith('/dashboard/settings')
        ? 'settings'
        : 'fact-check';

  const handleNavigate = (page: PageId) => {
    switch (page) {
      case 'fact-check':
        navigate({ to: '/dashboard/fact-check' });
        break;
      case 'upload':
        navigate({ to: '/dashboard/upload-document' });
        break;
      case 'history':
        navigate({ to: '/dashboard/history' });
        break;
      case 'settings':
        navigate({ to: '/dashboard/settings' });
        break;
    }
  };

  const handleLoadConversation = (id: string) => {
    // For now just navigate to history; wiring specific conversation selection
    // can be added later by lifting this state up.
    void id;
    navigate({ to: '/dashboard/history' });
  };

  const handleLogout = () => {
    // Replace with real auth/logout when available
    navigate({ to: '/' });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onLoadConversation={handleLoadConversation}
        conversations={conversations}
        userName="User"
        onLogout={handleLogout}
      />
      <main className="flex-1 transition-all duration-300 md:ml-80">
        <Outlet />
      </main>
    </div>
  );
}
