import { Category } from '@prisma/client';
import { useCallback, useState } from 'react';

import { TransactionType } from '@/lib/types';

// Nueva interfaz para la respuesta de la API
interface ApiResponse {
  success: boolean;
  status: number;
  data: Category[];
}

// Estado global para manejar las categorías
interface CategoryState {
  categories: Category[]; // Lista de categorías
  isLoading: boolean; // Indicador de carga
  error: string | null; // Manejo de errores
}

export function useCategories() {
  // Inicialización del estado
  const [state, setState] = useState<CategoryState>({
    categories: [],
    isLoading: false,
    error: null,
  });

  // Función actualizada para obtener categorías filtradas por tipo
  const fetchCategories = useCallback(async (type: TransactionType) => {
    setState(previous => ({ ...previous, isLoading: true }));
    try {
      const response = await fetch(`/api/categories?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const apiResponse: ApiResponse = await response.json();

      // Actualizar estado con las categorías obtenidas de data
      setState({
        categories: apiResponse.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Manejar errores actualizando el estado
      setState(previous => ({
        ...previous,
        error:
          error instanceof Error ? error.message : 'Error fetching categories',
        isLoading: false,
      }));
    }
  }, []);

  // Retornar estado y funciones
  return { ...state, fetchCategories };
}
