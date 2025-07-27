
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mic, Users, Package, ArrowRight, Bot, Truck, ShieldCheck, LineChart, Handshake, Leaf, Sprout, ShoppingCart, Banknote, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import React from "react";
import { ImageCarousel } from "@/components/image-carousel";


const features = [
  {
    icon: Mic,
    title: "feature_voice_order_title",
    description: "feature_voice_order_desc",
    href: "/voice-order",
  },
  {
    icon: Users,
    title: "feature_supplier_matching_title",
    description: "feature_supplier_matching_desc",
    href: "/supplier-matching",
  },
  {
    icon: ShoppingCart,
    title: "Vendor Collaboration",
    description: "Join forces with other vendors for bulk orders to reduce costs.",
    href: "/group-buy",
  },
  {
    icon: Banknote,
    title: "Micro-Credit & Ledger",
    description: "Access micro-credit and manage your finances with our digital ledger.",
    href: "/micro-credit",
  }
];

const heroImages = [
  {
    url: "/images/Dukaandaar.jpg",
    alt: "Modern agricultural marketplace",
  },
  {
    url: "/images/dukaandar2.jpg", 
    alt: "Smart farming technology",
  },
  {
    url: "/images/dukaandar3.jpg",
    alt: "Community-driven agriculture",
  },
];

const benefits = [
    {
        icon: Handshake,
        title: "Build Trust",
        description: "Connect with reliable, community-vetted suppliers."
    },
    {
        icon: Truck,
        title: "Simplify Logistics",
        description: "Focus on your food, not on sourcing. We handle the connections."
    },
    {
        icon: ShieldCheck,
        title: "Ensure Quality",
        description: "Access fresh, quality ingredients to delight your customers."
    }
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const { t } = useTranslation();

  return (
    <Card className="text-left bg-card flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t(feature.title)}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{t(feature.description)}</CardDescription>
      </CardContent>
      <div className="p-6 pt-0">
        <Button asChild variant="outline">
          <Link href={feature.href}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}


export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center text-foreground">
      {/* Hero Section */}
      <section className="w-full bg-background relative">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center justify-center text-center lg:text-left min-h-[calc(80vh-5rem)] py-20 lg:py-0">
          <div className="z-10 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
                {t('hero_title', 'Empowering India\'s Street Vendors')}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto lg:mx-0">
                {t('hero_subtitle', 'We use technology to connect street food entrepreneurs with suppliers, simplifying their supply chain through voice and AI on WhatsApp.')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg">
                  <Link href="/supplier-matching">{t('get_started', 'Find Suppliers Now')}</Link>
              </Button>
               <Button asChild size="lg" variant="outline">
                  <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] w-full lg:h-[500px]">
             <ImageCarousel 
               images={heroImages}
               autoSlide={true}
               autoSlideInterval={4000}
             />
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="w-full py-20 md:py-32 bg-secondary/10">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                {t('core_features_title', 'The DukaanGPT Advantage')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('core_features_desc', 'Our platform is built with the street vendor in mind, providing simple yet powerful tools to manage and grow their business.')}
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                ))}
            </div>
        </div>
      </section>

       {/* How It Works / Team Section */}
       <section id="how-it-works" className="w-full py-20 md:py-32 bg-background">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                    {t('how_it_works_title', 'Simple Steps to Get Started')}
                </h2>
                <p className="text-lg text-muted-foreground">
                    {t('how_it_works_desc', 'Sourcing materials has never been this easy. Follow our three-step process.')}
                </p>
                <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <benefit.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{benefit.title}</h3>
                            <p className="mt-1 text-muted-foreground">{benefit.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className="relative w-full">
                <div className="bg-card rounded-lg p-8 border">
                    <h3 className="text-2xl font-bold text-primary text-center mb-8">Meet Our Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Anudip Saha */}
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Users className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-foreground">Anudip Saha</h4>
                                <p className="text-sm text-muted-foreground mb-3">Developer</p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="https://www.linkedin.com/in/anudip-saha-76ab33309/" target="_blank" rel="noopener noreferrer">
                                        LinkedIn Profile
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Saroj Sen */}
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Users className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-foreground">Saroj Sen</h4>
                                <p className="text-sm text-muted-foreground mb-3">Developer</p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="https://www.linkedin.com/in/saroj-sen-227549318/" target="_blank" rel="noopener noreferrer">
                                        LinkedIn Profile
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Soumyajit Bag */}
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Users className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-foreground">Soumyajit Bag</h4>
                                <p className="text-sm text-muted-foreground mb-3">Developer</p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="http://www.linkedin.com/in/soumyajit-bag-0b234a322" target="_blank" rel="noopener noreferrer">
                                        LinkedIn Profile
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 bg-secondary/10">
        <div className="container mx-auto text-center">
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                {t('cta_title', 'Ready to Transform Your Business?')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('cta_desc', 'Join the growing network of smart vendors using DukaanGPT to save time and money.')}
              </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/supplier-matching">
                    {t('get_started', 'Find Suppliers Now')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-card border-t">
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">DukaanGPT</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering India's street vendors with AI-powered supply chain solutions through WhatsApp. Simplifying business operations for a better tomorrow.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-foreground">Features</h4>
              <div className="space-y-3">
                <Link href="/voice-order" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mic className="h-3 w-3" />
                  Voice Order Processing
                </Link>
                <Link href="/supplier-matching" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Users className="h-3 w-3" />
                  Smart Supplier Matching
                </Link>
                <Link href="/group-buy" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ShoppingCart className="h-3 w-3" />
                  Group Buying
                </Link>
                <Link href="/micro-credit" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Banknote className="h-3 w-3" />
                  Micro-Credit
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-foreground">Resources</h4>
              <div className="space-y-3">
                <Link href="/learning" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Leaf className="h-3 w-3" />
                  Learning Center
                </Link>
                <Link href="/community" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Users className="h-3 w-3" />
                  Community
                </Link>
                <Link href="/food-safety" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ShieldCheck className="h-3 w-3" />
                  Food Safety
                </Link>
                <Link href="/price-trends" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <LineChart className="h-3 w-3" />
                  Price Trends
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-foreground">Support</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mic className="h-3 w-3 text-primary" />
                  WhatsApp Support
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-3 w-3 text-primary" />
                  24/7 Assistance
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Secure Platform
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Handshake className="h-3 w-3 text-primary" />
                  Trusted Network
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>© 2025 DukaanGPT.</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-muted-foreground">Built with ❤️ in India</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
