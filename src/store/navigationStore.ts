import { create } from 'zustand';

export type NavigationTab =
  | 'main'
  | 'about'
  | 'scj-info'
  | 'doctrine'
  | 'prevention'
  | 'withdrawal'
  | 'request';

type NavigationState = {
  tab: NavigationTab;
  setTab: (tab: NavigationTab)=> void;
};

export const useNavigationStore = create<NavigationState>()((set) => ({
  tab: 'main',
  setTab: (tab) => set({ tab }),
}));
