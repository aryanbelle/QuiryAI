'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, BarChart3, Shield, Star, Users, Rocket } from 'lucide-react';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.06), transparent 40%)`
        }}
      ></div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              FormBuilder
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-all duration-300">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 px-4 py-2 rounded-full text-sm mb-8 backdrop-blur-sm hover:from-primary/15 hover:to-primary/10 transition-all duration-300 cursor-pointer group">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <Sparkles className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-foreground font-medium">AI-powered form generation</span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Build forms like a team of
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent relative">
              hundreds today
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-40 animate-pulse"></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Create beautiful, intelligent forms with AI assistance. Collect responses in real-time,
            analyze data with powerful insights, and scale your business effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="min-w-[160px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-primary/30 transition-all duration-500 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Rocket className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Start building for free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[160px] border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm"
              >
                View pricing plans
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-7 h-7 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border-2 border-background"></div>
                ))}
              </div>
              <span>Trusted by 10,000+ teams</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
              <span className="ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to build
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> amazing forms</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern teams who want to move fast and build better
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Generation",
                description: "Describe your form in plain English and watch AI build it instantly with smart field suggestions and validation rules."
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Track responses, analyze trends, and get actionable insights with beautiful dashboards and automated reports."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-grade security with end-to-end encryption, GDPR compliance, and 99.9% uptime guarantee."
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="group relative border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
              >
                <CardHeader className="relative z-10 pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>


        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-sm mb-4">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="text-primary font-medium">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by developers worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Main Testimonial */}
            <Card className="border-0 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl shadow-xl md:col-span-2">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 leading-relaxed">
                  "FormBuilder reduced our development time by 80% and helped us launch our product 3 months earlier.
                  The AI generation is incredibly accurate."
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">SC</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">CTO at TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side Testimonials */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  "The AI form generation is a game-changer. What used to take hours now takes minutes."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-500 text-sm font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">Mike Johnson</div>
                    <div className="text-xs text-muted-foreground">Lead Developer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">
                  "Best form builder I've used. The analytics dashboard is incredibly detailed."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500/30 to-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-sm font-semibold">AR</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">Alex Rodriguez</div>
                    <div className="text-xs text-muted-foreground">Product Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-6 ">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-card/60 to-card/40 rounded-2xl p-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to build something
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> amazing?</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teams already building with FormBuilder. Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-primary/30 transition-all duration-500 relative group overflow-hidden min-w-[180px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  Start building for free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm min-w-[180px]"
                >
                  View demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 backdrop-blur-xl bg-background/80 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 FormBuilder. Built for developers who want to move fast.
          </p>
        </div>
      </footer>
    </div>
  );
}