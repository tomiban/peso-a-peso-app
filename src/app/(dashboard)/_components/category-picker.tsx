'use client';

import { Category } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCategories } from '@/hooks/use-category';
import { TransactionType } from '@/lib/types';
import { cn } from '@/lib/utils';

import { CreateCategoryDialog } from './category-dialog';

interface Props {
  type: TransactionType;
  onChange?: (category: Category | null) => void;
  onSuccess?: (category: Category) => void;
}

export function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { categories, isLoading, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCategories(type);
  }, [fetchCategories, type]);

  // Esta función se ejecuta cuando se selecciona una categoría
  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category); // Actualiza el estado local
    onChange?.(category); // Notifica al componente padre
    setOpen(false); // Cierra el popov
  };

  // Esta función se ejecuta cuando se crea una nueva categoría
  const handleCreateSuccess = async (data: Category) => {
    handleSelectCategory(data); // Selecciona la nueva categoría
  };

  if (isLoading) {
    return <div className="h-10 w-full animate-pulse rounded-md bg-muted" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            <span className="text-muted-foreground">
              Seleccionar categoría...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar categoría..." className="h-9" />
          <CreateCategoryDialog
            type={type}
            onSuccess={handleCreateSuccess}
            onCreated={() => fetchCategories(type)}
          />
          <CommandList>
            <CommandEmpty>No se encontraron categorías.</CommandEmpty>
            <CommandGroup heading="Categorías disponibles">
              {Array.isArray(categories) &&
                categories.map(category => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() =>
                      handleSelectCategory(
                        selectedCategory?.id === category.id ? null : category,
                      )
                    }
                    className="flex items-center gap-2 p-2"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCategory?.id === category.id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <CategoryRow category={category} />
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-md text-sm"
        style={{ backgroundColor: category.color || '#e2e8f0' }}
        role="img"
        aria-label={`${category.name} icon`}
      >
        {category.icon}
      </span>
      <span className="truncate">{category.name}</span>
    </div>
  );
}
