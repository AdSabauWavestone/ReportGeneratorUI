import { create } from 'zustand';

export type Language = 'en' | 'ro';

type AppState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
}));
