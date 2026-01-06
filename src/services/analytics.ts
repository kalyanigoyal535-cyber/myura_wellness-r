import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const ANALYTICS_BASE = `${API_BASE_URL}/analytics`;

interface SessionData {
  id: string;
  userId?: number;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  location?: {
    country: string;
    state: string;
    city: string;
  };
  referrerUrl: string;
  referrerSource: string;
  utm: {
    source: string | null;
    medium: string | null;
    campaign: string | null;
  };
  landingPage: string;
}

class AnalyticsService {
  private sessionId: string;
  private initialized: boolean = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let id = localStorage.getItem('myura_analytics_session');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('myura_analytics_session', id);
    }
    return id;
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf("Win") !== -1) return "Windows";
    if (ua.indexOf("Mac") !== -1) return "MacOS";
    if (ua.indexOf("Linux") !== -1) return "Linux";
    if (ua.indexOf("Android") !== -1) return "Android";
    if (ua.indexOf("like Mac") !== -1) return "iOS";
    return "Unknown";
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf("Chrome") !== -1) return "Chrome";
    if (ua.indexOf("Firefox") !== -1) return "Firefox";
    if (ua.indexOf("Safari") !== -1) return "Safari";
    if (ua.indexOf("Edge") !== -1) return "Edge";
    return "Unknown";
  }

  private getReferrerSource(url: string): string {
    if (!url) return 'Direct';
    if (url.includes('google.com')) return 'Search';
    if (url.includes('facebook.com') || url.includes('instagram.com') || url.includes('t.co')) return 'Social';
    return 'Referral';
  }

  public async init(userId?: number) {
    if (this.initialized && !userId) return;

    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign')
    };

    const sessionData: SessionData = {
      id: this.sessionId,
      userId,
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
      referrerUrl: document.referrer,
      referrerSource: this.getReferrerSource(document.referrer),
      utm,
      landingPage: window.location.pathname
    };

    try {
      await axios.post(`${ANALYTICS_BASE}/session`, sessionData);
      this.initialized = true;
    } catch (err) {
      console.error('Failed to initialize analytics session', err);
    }
  }

  public async trackEvent(type: 'page_view' | 'add_to_cart' | 'reached_checkout' | 'purchase', metadata?: any) {
    try {
      await axios.post(`${ANALYTICS_BASE}/event`, {
        sessionId: this.sessionId,
        type,
        path: window.location.pathname,
        productId: metadata?.productId,
        orderId: metadata?.orderId,
        metadata
      });
    } catch (err) {
      console.error('Failed to track event', err);
    }
  }
}

export const analytics = new AnalyticsService();

