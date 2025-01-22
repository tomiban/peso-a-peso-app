import { Category } from '@prisma/client';
import { useState } from 'react';

import { TransactionType } from '@/lib/types';

interface CreateCategoryData {
  name: string;
  icon: string;
  type: TransactionType;
}
export function useCategories(initialCategories: Category[] = []) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (data: CreateCategoryData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const newCategory = await response.json();
      setCategories(previous => [...previous, newCategory]);
      return newCategory;
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Error desconocido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async (type?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        '/api/categories' + (type ? `?type=${type}` : ''),
      );
      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }
      const data = await response.json();
      setCategories(data);
      return data;
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Error desconocido');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    createCategory,
    fetchCategories,
  };
}
