'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, BarChart3, Shield } from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="font-semibold text-lg">FormBuilder</div>
          <div className="flex items-center space-x-3">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">AI-powered form generation</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            The Foundation for your Design System
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            A set of beautifully designed components that you can customize, extend, 
            and build on. Start here then make it your own. Open Source. Open Code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup">
              <Button size="default" className="min-w-[120px]">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="default" className="min-w-[120px]">
                View Components
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Everything you need
            </h2>
            <p className="text-muted-foreground">
              Powerful features to create, manage, and analyze your forms
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-none bg-card/50">
              <CardHeader className="pb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-lg">AI Generation</CardTitle>
                <CardDescription className="text-sm">
                  Describe your form and let AI build it instantly with smart field suggestions.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-none bg-card/50">
              <CardHeader className="pb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Real-time Analytics</CardTitle>
                <CardDescription className="text-sm">
                  Track responses, analyze trends, and get insights with beautiful dashboards.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-none bg-card/50">
              <CardHeader className="pb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Secure & Reliable</CardTitle>
                <CardDescription className="text-sm">
                  Enterprise-grade security with 99.9% uptime and data encryption.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of teams already using FormBuilder
          </p>
          <Link href="/auth/signup">
            <Button size="default">
              Start building for free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 FormBuilder. Built for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}