
import { create } from 'zustand';

type GameState = {
  bestHeight: number;
  dailyStreak: number;
  coins: number;
  setBest: (h:number)=>void;
  incStreak: ()=>void;
  resetStreak: ()=>void;
  addCoins: (n:number)=>void;
};

export const useGameStore = create<GameState>((set)=> ({
  bestHeight: 0,
  dailyStreak: 0,
  coins: 0,
  setBest: (h)=> set(s=> ({bestHeight: Math.max(s.bestHeight, h)})),
  incStreak: ()=> set(s=> ({dailyStreak: s.dailyStreak + 1})),
  resetStreak: ()=> set({dailyStreak: 0}),
  addCoins: (n)=> set(s=> ({coins: s.coins + n}))
}));
