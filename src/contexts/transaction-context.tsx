'use client';

import { startOfMonth } from 'date-fns';
import { createContext, useContext, useState } from 'react';

type DateRange = {
  from: Date;
  to: Date;
};

type TransactionsContextType = {
  refreshKey: number;
  triggerRefresh: () => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
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
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const triggerRefresh = () => {
    console.log('Actualizando refreshKey:', refreshKey + 1);
    setRefreshKey(previous => previous + 1);
  };

  return (
    <TransactionsContext.Provider
      value={{
        refreshKey,
        triggerRefresh,
        dateRange,
        setDateRange,
      }}
    >
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
