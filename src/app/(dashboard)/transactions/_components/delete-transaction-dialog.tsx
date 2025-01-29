'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  transactionId: string;
  onDelete: () => Promise<void>;
}

function DeleteTransactionDialog({
  open,
  setOpen,
  transactionId,
  onDelete,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      toast.loading('Eliminando transacción...', {
        id: transactionId,
      });

      // Llamar a la server action
      await onDelete();

      toast.success('Transacción eliminada con éxito', {
        id: transactionId,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error al eliminar la transacción:', error);
      toast.error('Algo salió mal', {
        id: transactionId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede revertir. Se borrará permanentemente tu
            transacción.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTransactionDialog;
