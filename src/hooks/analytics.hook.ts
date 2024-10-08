// src/hooks/analytics.hook.ts

import { useCallback } from 'react';

interface AnalyticsEvent {
  eventName: string;
  payload: unknown;
}

interface AnalyticsClient {
  capture: (event: AnalyticsEvent) => void;
}

const analyticsClient: AnalyticsClient = {
  capture: ({ eventName, payload }: AnalyticsEvent) => {
    // send to analytics service according to requirements
    console.log(`Analytics event captured: ${eventName}`, payload);
  }
};

export const useAnalytics = (): { client: AnalyticsClient } => {
  const capture = useCallback((event: AnalyticsEvent) => {
    analyticsClient.capture(event);
  }, []);

  return { client: { capture } };
};