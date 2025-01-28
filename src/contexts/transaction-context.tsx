// contexts/transactions-context.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type TransactionsContextType = {
  refreshKey: number;
  triggerRefresh: () => void;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined,
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(previous => previous + 1);
  };

  return (
    <TransactionsContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      'useTransactions must be used within a TransactionsProvider',
    );
  }
  return context;
}
