import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <>
      <Sidebar
        activePage={''}
        onNavigate={function (page: 'fact-check' | 'upload' | 'history' | 'settings'): void {
          throw new Error('Function not implemented.');
        }}
        onLoadConversation={function (id: string): void {
          throw new Error('Function not implemented.');
        }}
        conversations={[]}
        userName={''}
        onLogout={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <main className="flex-1 transition-all duration-300 md:ml-80">
        <Outlet />
      </main>
    </>
  );
}
