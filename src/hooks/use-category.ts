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

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'No error details available' }));
        throw new Error(
          `Error fetching categories: [${response.status}] ${response.statusText}${
            errorData.message ? `: ${errorData.message}` : ''
          }`,
        );
      }

      const apiResponse = (await response.json()) as ApiResponse;

      // Actualizar estado con las categorías obtenidas de data
      setState(previous => ({
        ...previous,
        categories: apiResponse.data,
        isLoading: false,
        error: null,
      }));
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
