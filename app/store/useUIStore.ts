
import { create } from 'zustand';

type UIState = {
  showPaywall: boolean;
  setShowPaywall: (v:boolean)=>void;
  soundEnabled: boolean;
  toggleSound: ()=>void;
};

export const useUIStore = create<UIState>((set)=> ({
  showPaywall: false,
  setShowPaywall: (v)=> set({showPaywall: v}),
  soundEnabled: true,
  toggleSound: ()=> set(s=> ({soundEnabled: !s.soundEnabled}))
}));
