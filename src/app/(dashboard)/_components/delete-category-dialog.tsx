'use client';
import { Category } from '@prisma/client';
import React, { ReactNode, useState } from 'react';
import { toast } from 'sonner';

import { DeleteCategory } from '@/app/(dashboard)/_actions/categories';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TransactionType } from '@/lib/types';

interface DeleteCategoryDialogProps {
  trigger: ReactNode;
  category: Category;
  onDeleted?: () => void;
  onSuccess?: (category: Category) => void;
}

export function DeleteCategoryDialog({
  category,
  trigger,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (categoryToDelete: Category) => {
    setIsDeleting(true);
    const toastId = toast.loading('Eliminando categoría...');

    try {
      await DeleteCategory({
        name: categoryToDelete.name,
        type: categoryToDelete.type as TransactionType,
      });

      toast.success('Categoría eliminada exitosamente', { id: toastId });

      setOpen(false);
      onSuccess?.(category);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar la categoría', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            TEsta acción no se puede deshacer. Se eliminará permanentemente la
            categoría: {category.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(category)}
            disabled={isDeleting}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
