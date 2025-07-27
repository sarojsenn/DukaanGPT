"use client";

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translateText } from '@/ai/flows/translate-text';

// Define the shape of the context
interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
  isTranslating: boolean;
  t: (key: string, defaultText?: string) => string;
}

// Create the context with a default value
export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Define default English translations
const defaultStrings: Record<string, string> = {
    // Nav
    nav_home: 'Home',
    nav_find_suppliers: 'Find Suppliers',
    nav_inventory: 'Inventory',
    nav_surplus_alerts: 'Surplus Alerts',
    nav_ledger: 'Ledger',
    nav_learning: 'Learning',
    // Home Page
    hero_title: 'Empowering India\'s Street Vendors with AI',
    hero_subtitle: 'We use technology to connect street food entrepreneurs with suppliers, simplifying their supply chain through voice and AI on WhatsApp.',
    get_started: 'Get Started',
    core_features_title: 'The DukaanGPT Advantage',
    core_features_desc: 'Our platform is built with the street vendor in mind, providing simple yet powerful tools to manage and grow their business.',
    feature_voice_order_title: 'Voice Order Processing',
    feature_voice_order_desc: 'Translate voice notes in local languages into structured orders instantly.',
    feature_supplier_matching_title: 'Smart Supplier Matching',
    feature_supplier_matching_desc: 'AI finds the best local suppliers based on price, proximity, and trust score.',
    feature_inventory_updates_title: 'Simple Inventory Updates',
    feature_inventory_updates_desc: 'Suppliers can update their stock and prices with a simple, easy-to-use link.',
    feature_whatsapp_automation_title: 'WhatsApp Automation',
    feature_whatsapp_automation_desc: 'Receive automated order confirmations and delivery schedules via WhatsApp.',
    how_it_works_title: 'Simple Steps to Get Started',
    how_it_works_desc: 'Sourcing materials has never been this easy. Follow our three-step process.',
    how_it_works_step1_title: 'Speak Your Order',
    how_it_works_step1_desc: 'Send a voice note on WhatsApp with your material needs.',
    how_it_works_step2_title: 'AI Finds Suppliers',
    how_it_works_step2_desc: 'Our AI analyzes your request and matches you with the best local suppliers.',
    how_it_works_step3_title: 'Confirm & Deliver',
    how_it_works_step3_desc: 'You get a confirmation and the supplier delivers your order.',
    our_impact_title: 'Our Impact',
    our_impact_desc: 'We are committed to making a tangible difference in the lives of street vendors across India.',
    impact_vendors_served: 'Vendors Served',
    impact_cost_reduction: 'Average Cost Reduction',
    impact_cities_live: 'Cities Live',
    cta_title: 'Ready to Transform Your Business?',
    cta_desc: 'Join the growing network of smart vendors using DukaanGPT to save time and money.',
    contact_us_now: 'Contact Us Now',
};


// Create a provider component
export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('English');
  const [translations, setTranslations] = useState<Record<string, string>>(defaultStrings);
  const [isTranslating, setIsTranslating] = useState(false);

  const translateAndCache = useCallback(async (lang: string) => {
    if (lang.toLowerCase() === 'english') {
      setTranslations(defaultStrings);
      // Even if we're setting to English, clear out old non-english translations
      // to ensure a consistent state.
      sessionStorage.removeItem(`translations_${lang}`);
      return;
    }
    
    const cachedTranslations = sessionStorage.getItem(`translations_${lang}`);
    if (cachedTranslations) {
        setTranslations(JSON.parse(cachedTranslations));
        return;
    }


    setIsTranslating(true);
    try {
      const result = await translateText({ strings: defaultStrings, targetLanguage: lang });
      setTranslations(result.translations);
      sessionStorage.setItem(`translations_${lang}`, JSON.stringify(result.translations));

    } catch (error) {
      console.error('Translation failed:', error);
      // Fallback to default strings on error
      setTranslations(defaultStrings);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  useEffect(() => {
    translateAndCache(language);
  }, [language, translateAndCache]);

  const t = useCallback((key: string, defaultText?: string): string => {
    return translations[key] || defaultText || key;
  }, [translations]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations,
    isTranslating,
    t,
  }), [language, translations, isTranslating, t]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
