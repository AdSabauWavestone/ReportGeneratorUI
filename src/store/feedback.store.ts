import { create } from 'zustand';

export type FeedbackItem = {
  id: string;
  type: 'success' | 'error';
  message: string;
};

type FeedbackState = {
  items: FeedbackItem[];
  push: (type: FeedbackItem['type'], message: string) => void;
  remove: (id: string) => void;
};

export const useFeedbackStore = create<FeedbackState>((set) => ({
  items: [],
  push: (type, message) =>
    set((state) => ({
      items: [...state.items, { id: crypto.randomUUID(), type, message }],
    })),
  remove: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
