// stores/useAgentStore.ts
import { create } from 'zustand';

type AgentStore = {
  name: string;
  image: File | string | null;
  setName: (name: string) => void;
  setImage: (image: File | string) => void;
};

export const useAgentStore = create<AgentStore>((set) => ({
  name: '',
  image: null,
  setName: (name) => set({ name }),
  setImage: (image) => set({ image }),
}));
