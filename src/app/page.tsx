'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, BarChart3, Share2, Shield, Palette } from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    // Check if user is already signed in
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Form Builder</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Create Beautiful Forms
            <span className="text-primary block">in Seconds</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Build dynamic forms with AI assistance, collect responses in real-time, 
            and analyze data with beautiful visualizations. No coding required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started Free
              </Button>
            </Link>
            
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to build forms
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-generated forms to advanced analytics, we&apos;ve got you covered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">AI Form Generation</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Describe your form in plain English and let AI create it instantly
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle className="text-xl text-foreground">Drag & Drop Builder</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Easily customize forms with our intuitive drag-and-drop interface
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl text-foreground">Advanced Analytics</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Visualize responses with charts and get AI-powered insights
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-orange-500" />
                </div>
                <CardTitle className="text-xl text-foreground">Real-time Sharing</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Share forms instantly and collect responses in real-time
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle className="text-xl text-foreground">Secure & Reliable</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your data is protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-indigo-500" />
                </div>
                <CardTitle className="text-xl text-foreground">Beautiful Design</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Clean, modern interface inspired by Apple&apos;s design system
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to build your first form?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Join thousands of users who trust FormBuilder for their form needs.
          </p>
          
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 font-medium">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}