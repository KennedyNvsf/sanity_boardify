import { create } from "zustand";

type CardModalStore = {
  _id?: string;
  isOpen: boolean;
  onOpen: (_id: string) => void;
  onClose: () => void;
};

export  const useCardModal = create<CardModalStore>((set) => ({
  _id: undefined,
  isOpen: false,
  onOpen: (_id: string) => set({ isOpen: true, _id }),
  onClose: () => set({ isOpen: false, _id: undefined }),
}));