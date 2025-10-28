'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, BarChart3, Shield, Star, Rocket } from 'lucide-react';



export default function HomePage() {
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent"></div>
      {/* <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.06), transparent 40%)`
        }}
      ></div> */}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              QuiryAI
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
      <section className="relative z-10 pt-40 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Announcement Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 px-3 py-1.5 rounded-full text-xs mb-6 backdrop-blur-sm hover:from-primary/15 hover:to-primary/10 transition-all duration-300 cursor-pointer group">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <Sparkles className="w-3 h-3 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-foreground font-medium">AI-powered form generation</span>
            <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.1]">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Build forms like a team of
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent relative">
              hundreds today
              {/* <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-40 animate-pulse"></div> */}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-xl mx-auto leading-relaxed">
            Create beautiful, intelligent forms with AI assistance. Collect responses in real-time,
            analyze data with powerful insights, and scale your business effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center mb-6">
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="min-w-[130px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Rocket className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Start building for free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                variant="ghost"
                size="sm"
                className="min-w-[130px] border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 backdrop-blur-sm"
              >
                View pricing plans
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full border-2 border-background"></div>
                ))}
              </div>
              <span>Trusted by 10,000+ teams</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Everything you need to build
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> amazing forms</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Powerful features designed for modern teams who want to move fast and build better
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4">
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
                className="group relative border bg-card hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-2 p-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>


        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-1 bg-muted px-2 py-1 rounded-full text-xs mb-2">
              <Star className="w-2.5 h-2.5 text-primary fill-current" />
              <span className="text-muted-foreground font-medium">Testimonials</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Loved by developers worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Main Testimonial */}
            <Card className="border bg-card shadow-sm md:col-span-2">
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-base md:text-lg font-medium text-foreground mb-3 leading-relaxed">
                  "QuiryAI reduced our development time by 80% and helped us launch our product 3 months earlier.
                  The AI generation is incredibly accurate."
                </blockquote>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-xs">SC</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground text-sm">Sarah Chen</div>
                    <div className="text-xs text-muted-foreground">CTO at TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side Testimonials */}
            <Card className="border bg-card">
              <CardContent className="p-3">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-3 leading-relaxed text-sm">
                  "The AI form generation is a game-changer. What used to take hours now takes minutes."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <span className="text-blue-500 text-xs font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-xs">Mike Johnson</div>
                    <div className="text-xs text-muted-foreground">Lead Developer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardContent className="p-3">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-3 leading-relaxed text-sm">
                  "Best form builder I've used. The analytics dashboard is incredibly detailed."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-xs font-semibold">AR</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-xs">Alex Rodriguez</div>
                    <div className="text-xs text-muted-foreground">Product Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border bg-card p-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Rocket className="w-5 h-5 text-primary" />
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Ready to build something
              <span className="text-primary"> amazing?</span>
            </h2>

            <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
              Join thousands of teams already building with QuiryAI. Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4">
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 min-w-[140px]"
                >
                  Start building for free
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="min-w-[140px]"
                >
                  View demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 QuiryAI. Built for developers who want to move fast.
          </p>
        </div>
      </footer>
    </div>
  );
}