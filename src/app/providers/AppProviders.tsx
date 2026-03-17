import type { PropsWithChildren } from 'react';
import { FeedbackViewport } from '@/components/feedback/FeedbackViewport';
import { LanguageSync } from './LanguageSync';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <LanguageSync />
      {children}
      <FeedbackViewport />
    </>
  );
}
