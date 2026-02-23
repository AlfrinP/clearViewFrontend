import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Mail, Lock, FileCheck, CheckCircle, Link, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';

export const Route = createFileRoute('/login/')({
  component: LoginComponent,
});

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate with your backend
    // For now, we'll just simulate a successful login
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <FileCheck className="size-10 text-white" />
          </div>
          <h1 className="mb-2">FactCheck Pro</h1>
          <p className="text-gray-600">
            Verify claims with trusted sources and AI-powered analysis
          </p>
        </div>

        {/* Login/Signup Form */}
        <Card className="p-8 shadow-xl">
          <h2 className="mb-6 text-center">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg">
              Sign In <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-indigo-600 hover:text-indigo-800">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <CheckCircle className="size-5 text-green-600 shrink-0" />
            <span>AI-powered fact verification</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <CheckCircle className="size-5 text-green-600 shrink-0" />
            <span>Cross-reference with trusted sources</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <CheckCircle className="size-5 text-green-600 shrink-0" />
            <span>Upload custom policy documents</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <CheckCircle className="size-5 text-green-600 shrink-0" />
            <span>Track your fact-checking history</span>
          </div>
        </div>
      </div>
    </div>
  );
}
