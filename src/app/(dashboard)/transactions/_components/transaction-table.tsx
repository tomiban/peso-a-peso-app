/* eslint-disable unicorn/prevent-abbreviations */
import { Transaction } from '@prisma/client';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import _ from 'lodash';
import {
  DownloadIcon,
  MoreHorizontal,
  SearchIcon,
  TrashIcon,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateToUTCDate } from '@/helpers/helpers';

import { deleteTransaction } from '../_actions/delete-transaction';
import DeleteTransactionDialog from './delete-transaction-dialog';

const ITEMS_PER_PAGE = 10;

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

type Props = {
  from: Date;
  to: Date;
};

type FilterState = {
  category: string;
  type: string;
  search: string;
  minAmount: string;
  maxAmount: string;
};

function TransactionTable({ from, to }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    type: 'all',
    search: '',
    minAmount: '',
    maxAmount: '',
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction | '';
    direction: 'asc' | 'desc' | '';
  }>({ key: '', direction: '' });

  const debouncedSearch = useMemo(
    () =>
      _.debounce((value: string, callback: (value: string) => void) => {
        callback(value);
      }, 300),
    [],
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      debouncedSearch(searchTerm, value => {
        setFilters(previous => ({ ...previous, search: value }));
      });
    },
    [debouncedSearch],
  );

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error al cargar las transacciones:', error);
    }
    setLoading(false);
  }, [from, to]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleExportCSV = () => {
    const data = filteredTransactions.map(transaction => ({
      categoria: transaction.category,
      descripcion: transaction.note,
      tipo: transaction.type,
      monto: transaction.amount,
      fecha: new Date(transaction.date).toISOString().split('T')[0],
    }));
    if (data.length > 0) {
      const csv = generateCsv(csvConfig)(data);
      download(csvConfig)(csv);
    }
  };

  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      if (
        filters.category !== 'all' &&
        transaction.category !== filters.category
      ) {
        return false;
      }

      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      if (
        filters.minAmount &&
        transaction.amount < Number.parseFloat(filters.minAmount)
      ) {
        return false;
      }

      if (
        filters.maxAmount &&
        transaction.amount > Number.parseFloat(filters.maxAmount)
      ) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const categoryMatch = transaction.category
          ?.toLowerCase()
          .includes(searchTerm);
        const noteMatch = transaction.note?.toLowerCase().includes(searchTerm);
        if (!categoryMatch && !noteMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const uniqueCategories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.category}
              onValueChange={value =>
                setFilters(previous => ({ ...previous, category: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category!}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={value =>
                setFilters(previous => ({ ...previous, type: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="INCOME">Ingreso</SelectItem>
                <SelectItem value="EXPENSE">Gasto</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Monto mínimo"
                className="w-32"
                value={filters.minAmount}
                onChange={e =>
                  setFilters(previous => ({
                    ...previous,
                    minAmount: e.target.value,
                  }))
                }
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Monto máximo"
                className="w-32"
                value={filters.maxAmount}
                onChange={e =>
                  setFilters(previous => ({
                    ...previous,
                    maxAmount: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="ml-auto h-8"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por categoría o descripción..."
            className="max-w-sm"
            onChange={e => handleSearch(e.target.value)}
          />
          <span className="text-sm text-muted-foreground">
            {filteredTransactions.length} resultados
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort('category')}
                className="cursor-pointer"
              >
                Categoría
              </TableHead>
              <TableHead
                onClick={() => handleSort('note')}
                className="cursor-pointer"
              >
                Descripción
              </TableHead>
              <TableHead
                onClick={() => handleSort('date')}
                className="cursor-pointer"
              >
                Fecha
              </TableHead>
              <TableHead
                onClick={() => handleSort('type')}
                className="cursor-pointer"
              >
                Tipo
              </TableHead>
              <TableHead
                onClick={() => handleSort('amount')}
                className="cursor-pointer"
              >
                Monto
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell className="flex gap-2 capitalize">
                    {transaction.category}
                  </TableCell>
                  <TableCell className="capitalize">
                    {transaction.note}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`rounded-lg p-2 text-center capitalize ${transaction.type === 'INCOME' ? 'bg-emerald-400/10 text-emerald-500' : ''} ${transaction.type === 'EXPENSE' ? 'bg-red-400/10 text-red-500' : ''}`}
                    >
                      {transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
                      ${transaction.amount.toFixed(2)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <RowActions
                      transaction={transaction}
                      onDelete={fetchTransactions}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(previous => Math.max(1, previous - 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage(previous => Math.min(totalPages, previous + 1))
          }
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

interface RowActionsProps {
  transaction: Transaction;
  onDelete: () => void;
}

function RowActions({ transaction, onDelete }: RowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      onDelete();
    } catch (error) {
      console.error('Error al eliminar la transacción:', error);
    }
  };

  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        transactionId={transaction.id}
        onDelete={handleDelete}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeleteDialog(true)}
          >
            <TrashIcon className="h-4 w-4 text-muted-foreground" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default TransactionTable;
