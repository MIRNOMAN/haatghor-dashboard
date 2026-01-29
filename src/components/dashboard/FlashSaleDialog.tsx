'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FlashSaleForm } from './FlashSaleForm';
import {
  FlashSale,
  CreateFlashSaleInput,
  UpdateFlashSaleInput,
  useCreateFlashSaleMutation,
  useUpdateFlashSaleMutation,
  useGetFlashSaleQuery,
} from '@/store/features/flashSales/flashSalesApi';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface FlashSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashSaleId?: string | null;
  mode: 'create' | 'edit';
}

export function FlashSaleDialog({ open, onOpenChange, flashSaleId, mode }: FlashSaleDialogProps) {
  const [createFlashSale, { isLoading: isCreating, isSuccess: createSuccess }] =
    useCreateFlashSaleMutation();
  const [updateFlashSale, { isLoading: isUpdating, isSuccess: updateSuccess }] =
    useUpdateFlashSaleMutation();

  const { data: flashSaleData, isLoading: isLoadingFlashSale } = useGetFlashSaleQuery(
    flashSaleId || '',
    {
      skip: !flashSaleId || mode === 'create',
    }
  );

  // Close dialog on success
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      onOpenChange(false);
    }
  }, [createSuccess, updateSuccess, onOpenChange]);

  const handleSubmit = async (data: CreateFlashSaleInput | UpdateFlashSaleInput) => {
    try {
      if (mode === 'create') {
        await createFlashSale(data as CreateFlashSaleInput).unwrap();
        toast.success('Flash sale created successfully');
      } else if (flashSaleId) {
        await updateFlashSale({ id: flashSaleId, data: data as UpdateFlashSaleInput }).unwrap();
        toast.success('Flash sale updated successfully');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'An error occurred';
      toast.error(errorMessage);
      console.error('Flash sale error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Flash Sale' : 'Edit Flash Sale'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Set up a new flash sale with custom pricing and duration'
              : 'Update flash sale details and settings'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingFlashSale && mode === 'edit' ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading flash sale details...
          </div>
        ) : (
          <FlashSaleForm
            initialData={mode === 'edit' ? flashSaleData : undefined}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
