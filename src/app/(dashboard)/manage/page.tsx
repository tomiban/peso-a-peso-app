/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Category } from '@prisma/client';
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import CurrencySelector from '@/app/wizard/_components/currency-selector';
import SkeletonWrapper from '@/components/skeleton-wrapper';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';

import { CreateCategoryDialog } from '../_components/category-dialog';
import { DeleteCategoryDialog } from '../_components/delete-category-dialog';

function ManagePage() {
  return (
    <>
      {/* HEADER */}
      <div className="border-b">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Administra la configuración de tu cuenta y categorías
            </p>
          </div>
        </div>
      </div>
      {/* END HEDER */}
      <div className="container flex flex-col gap-4 p-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Moneda</CardTitle>
            <CardDescription>
              Establece tu moneda predeterminada para las transacciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencySelector />
          </CardContent>
        </Card>
        <CategoryList type="INCOME" />
        <CategoryList type="EXPENSE" />
      </div>
    </>
  );
}

export default ManagePage;

interface CategoryListProps {
  type: TransactionType;
  onChange?: (category: Category | null) => void;
  selectedCategory?: Category | null;
}

function CategoryList({
  type,
  onChange,
  selectedCategory: initialCategory,
}: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory || null,
  );
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/categories?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();

      setCategories(data.data);
    } catch (error_) {
      setError(error_ instanceof Error ? error_ : new Error('Unknown error'));
      console.error('Error fetching categories:', error_);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category);
    onChange?.(category);
    setOpen(false);
  };

  const handleCreateSuccess = (data: Category) => {
    handleSelectCategory(data);
  };

  const handleDeleteSuccess = (deletedCategory: Category) => {
    // Si la categoría borrada era la seleccionada, deseleccionarla
    if (selectedCategory?.name === deletedCategory.name) {
      setSelectedCategory(null);
      onChange?.(null);
    }
    fetchCategories();
  };

  if (isLoading) {
    return <div className="h-10 w-full animate-pulse rounded-md" />;
  }

  const dataAvailable = categories.length > 0;

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex flex-1 items-center gap-2">
              {type === 'EXPENSE' ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                Categorias de {type === 'INCOME' ? 'Ingresos' : 'Gastos'}{' '}
              </div>
            </CardTitle>
            <CreateCategoryDialog
              type={type}
              className="w-[200px]"
              onSuccess={handleCreateSuccess}
              onCreated={() => fetchCategories()}
              trigger={
                <Button className="gap-2 rounded-lg text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Crear Categoría
                </Button>
              }
            />
          </div>
        </CardHeader>

        {error && (
          <div className="flex h-40 w-full flex-col items-center justify-center text-red-500">
            <p>Error al cargar categorías</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setError(null);
                fetchCategories();
              }}
            >
              Retry
            </Button>
          </div>
        )}
        {!dataAvailable && !error && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No hay categorìas de
              <span
                className={cn(
                  'm-1',
                  type === 'INCOME' ? 'text-emerald-500' : 'text-red-500',
                )}
              >
                {type === 'INCOME' ? 'Ingresos' : 'Gastos'}
              </span>
              todavía
            </p>
            <p className="text-sm text-muted-foreground">
              Crea una para empezar
            </p>
          </div>
        )}
        {dataAvailable && !error && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category: Category) => (
              <CategoryCard
                category={category}
                key={category.name}
                onClick={() => handleSelectCategory(category)}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick?: () => void;
  onDeleteSuccess?: (deleted: Category) => void;
}

function CategoryCard({
  category,
  isSelected,
  onClick,
  onDeleteSuccess,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex border-separate cursor-pointer flex-col justify-between rounded-md border shadow-md transition-colors',
        isSelected && 'bg-accent/50',
      )}
    >
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        onSuccess={() => onDeleteSuccess?.(category)}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none hover:bg-red-500"
            variant={'secondary'}
            onClick={event => {
              event.stopPropagation();
            }}
          >
            <TrashIcon className="h-4 w-4" />
            Remover
          </Button>
        }
      />
    </div>
  );
}
