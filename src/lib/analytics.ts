// Google Analytics and Google Tag Manager Integration
// This file provides type-safe analytics tracking for the application

// Extend window interface for Google Analytics and GTM
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Configuration
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
export const GTM_ID = import.meta.env.VITE_GTM_ID || '';

/**
 * Initialize Google Analytics
 * Call this once when the app loads
 */
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('[Analytics] Google Analytics ID not configured');
    return;
  }

  // GA is loaded via script tag in index.html
  // This function just logs that it's ready
  console.log('[Analytics] Google Analytics initialized:', GA_MEASUREMENT_ID);
};

/**
 * Initialize Google Tag Manager
 * Call this once when the app loads
 */
export const initGTM = () => {
  if (!GTM_ID) {
    console.warn('[Analytics] Google Tag Manager ID not configured');
    return;
  }

  // GTM is loaded via script tag in index.html
  // This function just logs that it's ready
  console.log('[Analytics] Google Tag Manager initialized:', GTM_ID);
};

/**
 * Track page views
 * Call this on route changes
 */
export const pageview = (url: string, title?: string) => {
  if (!GA_MEASUREMENT_ID) return;

  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });

  console.log('[Analytics] Page view:', url);
};

/**
 * Track custom events
 * @param action - Event action (e.g., 'login', 'view_member', 'download')
 * @param category - Event category (e.g., 'authentication', 'member', 'file')
 * @param label - Event label (optional additional info)
 * @param value - Event value (optional numeric value)
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!GA_MEASUREMENT_ID && !GTM_ID) return;

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Send to GTM DataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: action,
      eventCategory: category,
      eventLabel: label,
      eventValue: value,
    });
  }

  console.log('[Analytics] Event:', { action, category, label, value });
};

/**
 * Track user login
 */
export const trackLogin = (method: string = 'phone') => {
  event({
    action: 'login',
    category: 'authentication',
    label: method,
  });
};

/**
 * Track user logout
 */
export const trackLogout = () => {
  event({
    action: 'logout',
    category: 'authentication',
  });
};

/**
 * Track member view
 */
export const trackMemberView = (memberId: string) => {
  event({
    action: 'view_member',
    category: 'member',
    label: memberId,
  });
};

/**
 * Track vaccination history view
 */
export const trackVaccinationHistoryView = (memberId: string) => {
  event({
    action: 'view_vaccination_history',
    category: 'vaccination',
    label: memberId,
  });
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount,
  });
};

/**
 * Track filter usage
 */
export const trackFilter = (filterType: string, filterValue: string) => {
  event({
    action: 'filter',
    category: 'engagement',
    label: `${filterType}:${filterValue}`,
  });
};

/**
 * Track error
 */
export const trackError = (errorMessage: string, errorPage: string) => {
  event({
    action: 'error',
    category: 'error',
    label: `${errorPage}: ${errorMessage}`,
  });
};

/**
 * Track password change
 */
export const trackPasswordChange = (success: boolean) => {
  event({
    action: 'password_change',
    category: 'authentication',
    label: success ? 'success' : 'failed',
  });
};

/**
 * Track timing/performance
 */
export const trackTiming = (
  name: string,
  duration: number,
  category: string = 'performance'
) => {
  if (!window.gtag) return;

  window.gtag('event', 'timing_complete', {
    name: name,
    value: duration,
    event_category: category,
  });

  console.log('[Analytics] Timing:', { name, duration, category });
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (!window.gtag) return;

  window.gtag('set', 'user_properties', properties);
  console.log('[Analytics] User properties set:', properties);
};

/**
 * Track exception
 */
export const trackException = (description: string, fatal: boolean = false) => {
  if (!window.gtag) return;

  window.gtag('event', 'exception', {
    description: description,
    fatal: fatal,
  });

  console.log('[Analytics] Exception:', { description, fatal });
};

// React Hook for page view tracking
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track page views automatically
 * Add this to your App component
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);
};

