import i18n from '@/i18n';
import { useFeedbackStore } from '@/store/feedback.store';
import { toApiError } from './apiError';

type RunWithFeedbackOptions<T> = {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export function pushSuccess(message: string) {
  useFeedbackStore.getState().push('success', message);
}

export function pushError(message: string) {
  useFeedbackStore.getState().push('error', message);
}

export async function runWithApiFeedback<T>(
  action: () => Promise<T>,
  options: RunWithFeedbackOptions<T> = {},
): Promise<T> {
  try {
    const data = await action();

    if (options.successMessage) {
      pushSuccess(options.successMessage);
    }

    options.onSuccess?.(data);
    return data;
  } catch (error) {
    const normalized = toApiError(error);
    pushError(options.errorMessage ?? normalized.message ?? i18n.t('feedback.errorDefault'));
    options.onError?.(normalized);
    throw normalized;
  }
}
