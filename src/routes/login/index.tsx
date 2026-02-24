import { createFileRoute } from '@tanstack/react-router';
import { FileCheck } from 'lucide-react';
import LoginForm from '../../features/auth/components/LoginForm';

export const Route = createFileRoute('/login/')({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <FileCheck className="size-10 text-white" />
          </div>
          <h1 className="mb-2">Clear View</h1>
          <p className="text-gray-600">
            Verify claims with trusted sources and AI-powered analysis
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
