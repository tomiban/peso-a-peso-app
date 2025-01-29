import { create } from 'zustand';

interface TransactionStore {
  shouldRefetch: boolean;
  triggerRefetch: () => void;
}

export const useTransactionStore = create<TransactionStore>(set => ({
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
}));
