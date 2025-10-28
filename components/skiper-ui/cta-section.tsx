import React from 'react';
import { ArrowRight, Shield, Zap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA
}) => {
  return (
    <section className="py-24 bg-gray-900 dark:bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Rocket className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href={primaryCTA.href}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold rounded-full min-w-[200px]"
            >
              {primaryCTA.text}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href={secondaryCTA.href}>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-600 hover:border-purple-400 text-white hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold rounded-full min-w-[200px] transition-all duration-300"
            >
              {secondaryCTA.text}
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Setup in 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};