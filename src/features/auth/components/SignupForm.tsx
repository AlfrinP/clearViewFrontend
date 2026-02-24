import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useSignup } from '../hooks/useAuth';
import { Link } from '@tanstack/react-router';

export default function SignupForm() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { mutate: signup, isPending } = useSignup();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    console.log('handleSubmit', e);
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    signup({ username, password });
  }

  return (
    <Card className="w-full max-w-md p-8 shadow-xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Clear View</h1>
        <p className="text-gray-600">Create an account to get started</p>
      </div>

      <form onSubmit={e => handleSubmit(e)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isPending}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isPending}
              className="pl-10"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          onClick={() => console.log('clicked')}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          size="lg"
          disabled={isPending || !username.trim() || !password.trim()}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </Card>
  );
}
