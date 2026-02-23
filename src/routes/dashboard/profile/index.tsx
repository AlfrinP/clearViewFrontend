import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
});

function ProfileComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
