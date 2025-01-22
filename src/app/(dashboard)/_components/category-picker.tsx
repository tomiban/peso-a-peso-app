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
import { CreateCategorySchemaType } from '@/schema/category';

import { CreateCategoryDialog } from './category-dialog';

interface Props {
  type: TransactionType;

  onChange?: (category: Category | null) => void;
  onCreateNew?: () => void;
}

export function CategoryPicker({ type, onChange, onCreateNew }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const { categories, isLoading, createCategory, fetchCategories } =
    useCategories();

  useEffect(() => {
    fetchCategories(type);
  }, [fetchCategories, type]);

  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category);
    onChange?.(category);
    setOpen(false);
  };

  const handleCreateSuccess = async (data: CreateCategorySchemaType) => {
    const newCategory = await createCategory(data);
    if (newCategory) {
      handleSelectCategory(newCategory);
      onCreateNew?.();
    }
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
          className="h-10 w-full min-w-[240px] justify-between"
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
      <PopoverContent className="w-full min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar categoría..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron categorías.</CommandEmpty>
            <CommandGroup heading="Categorías disponibles">
              {categories.map(category => (
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
            <CommandSeparator />
            <div className="p-2">
              <CreateCategoryDialog
                type={type}
                onSuccess={handleCreateSuccess}
              />
            </div>
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
