'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);

      // Handle specific Appwrite errors
      if (error.code === 409) {
        toast.error('An account with this email already exists');
      } else if (error.message?.includes('Invalid email')) {
        toast.error('Please enter a valid email address');
      } else if (error.message?.includes('Password')) {
        toast.error('Password must be at least 8 characters long');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="text-3xl font-bold text-foreground">FormBuilder</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Get started</h1>
          <p className="text-xl text-muted-foreground">Create your account to build amazing forms</p>
        </div>

        <Card className="p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Sign Up</h2>
            <p className="text-lg text-muted-foreground">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-medium text-foreground">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-medium text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-base text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:text-primary/80 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}