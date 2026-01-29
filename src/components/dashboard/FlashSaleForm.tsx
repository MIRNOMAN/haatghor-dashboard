'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useGetAllProductsQuery } from '@/store/features/products/productsApi';
import { CreateFlashSaleInput, UpdateFlashSaleInput, FlashSale } from '@/store/features/flashSales/flashSalesApi';
import { Search, Package, DollarSign, Clock, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FlashSaleFormProps {
  initialData?: FlashSale;
  onSubmit: (data: CreateFlashSaleInput | UpdateFlashSaleInput) => Promise<void>;
  isLoading: boolean;
}

export function FlashSaleForm({ initialData, onSubmit, isLoading }: FlashSaleFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    productId: initialData?.productId || '',
    flashPrice: initialData?.flashPrice || 0,
    totalStock: initialData?.totalStock || 0,
    isFeatured: initialData?.isFeatured || false,
  });

  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const { data: productsData, isLoading: isLoadingProducts } = useGetAllProductsQuery({
    page: 1,
    limit: 50,
    search: productSearch,
  });

  const products = productsData?.data || [];
  const selectedProduct = products.find((p) => p.id === formData.productId);

  // Calculate discount percentage
  const discountPercentage = selectedProduct
    ? ((selectedProduct.price - formData.flashPrice) / selectedProduct.price) * 100
    : 0;

  useEffect(() => {
    if (initialData) {
      const start = new Date(initialData.startTime);
      const end = new Date(initialData.endTime);
      const diff = end.getTime() - start.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setDuration({ hours, minutes, seconds });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId) {
      alert('Please select a product');
      return;
    }

    if (formData.flashPrice <= 0) {
      alert('Flash price must be greater than 0');
      return;
    }

    if (selectedProduct && formData.flashPrice >= selectedProduct.price) {
      alert('Flash price must be less than original price');
      return;
    }

    if (formData.totalStock <= 0) {
      alert('Total stock must be greater than 0');
      return;
    }

    const totalDurationMs =
      duration.hours * 60 * 60 * 1000 +
      duration.minutes * 60 * 1000 +
      duration.seconds * 1000;

    if (totalDurationMs <= 0) {
      alert('Please set a valid duration');
      return;
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + totalDurationMs);

    const submitData = {
      ...formData,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Flash Sale Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Weekend Flash Sale"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description for this flash sale"
          rows={3}
        />
      </div>

      {/* Product Selection */}
      <div className="space-y-2">
        <Label>Select Product *</Label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowProductDropdown(true);
              }}
              onFocus={() => setShowProductDropdown(true)}
              className="pl-10"
            />
          </div>

          {/* Selected Product Display */}
          {selectedProduct && (
            <Card className="mt-2 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedProduct.images?.[0] && (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Original Price: ${selectedProduct.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Available Stock: {selectedProduct.stock}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, productId: '' });
                    setProductSearch('');
                  }}
                >
                  Change
                </Button>
              </div>
            </Card>
          )}

          {/* Product Dropdown */}
          {showProductDropdown && !selectedProduct && (
            <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto">
              {isLoadingProducts ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No products found
                </div>
              ) : (
                <div className="p-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, productId: product.id });
                        setShowProductDropdown(false);
                        setProductSearch('');
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left"
                    >
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${product.price} • Stock: {product.stock}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Flash Price */}
      <div className="space-y-2">
        <Label htmlFor="flashPrice">Flash Sale Price ($) *</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="flashPrice"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.flashPrice}
            onChange={(e) => setFormData({ ...formData, flashPrice: parseFloat(e.target.value) })}
            placeholder="Enter flash sale price"
            className="pl-10"
            required
          />
        </div>
        {selectedProduct && formData.flashPrice > 0 && (
          <div className="flex items-center gap-2 text-sm">
            {discountPercentage > 0 ? (
              <>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {discountPercentage.toFixed(1)}% OFF
                </Badge>
                <span className="text-muted-foreground">
                  Save ${(selectedProduct.price - formData.flashPrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-destructive">
                Flash price must be less than original price (${selectedProduct.price})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Total Stock */}
      <div className="space-y-2">
        <Label htmlFor="totalStock">Flash Sale Stock Quantity *</Label>
        <div className="relative">
          <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="totalStock"
            type="number"
            min="1"
            value={formData.totalStock}
            onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) })}
            placeholder="Enter available quantity"
            className="pl-10"
            required
          />
        </div>
        {selectedProduct && formData.totalStock > selectedProduct.stock && (
          <p className="text-sm text-destructive">
            Warning: Flash sale stock ({formData.totalStock}) exceeds available product stock ({selectedProduct.stock})
          </p>
        )}
      </div>

      {/* Duration Picker */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Flash Sale Duration *
        </Label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="hours" className="text-xs text-muted-foreground">
              Hours
            </Label>
            <Input
              id="hours"
              type="number"
              min="0"
              max="168"
              value={duration.hours}
              onChange={(e) => setDuration({ ...duration, hours: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="minutes" className="text-xs text-muted-foreground">
              Minutes
            </Label>
            <Input
              id="minutes"
              type="number"
              min="0"
              max="59"
              value={duration.minutes}
              onChange={(e) => setDuration({ ...duration, minutes: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="seconds" className="text-xs text-muted-foreground">
              Seconds
            </Label>
            <Input
              id="seconds"
              type="number"
              min="0"
              max="59"
              value={duration.seconds}
              onChange={(e) => setDuration({ ...duration, seconds: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Total duration:{' '}
          {duration.hours > 0 && `${duration.hours}h `}
          {duration.minutes > 0 && `${duration.minutes}m `}
          {duration.seconds > 0 && `${duration.seconds}s`}
          {duration.hours === 0 && duration.minutes === 0 && duration.seconds === 0 && 'Not set'}
        </p>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isFeatured"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="isFeatured" className="cursor-pointer">
          Feature this flash sale (show prominently)
        </Label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? 'Saving...' : initialData ? 'Update Flash Sale' : 'Create Flash Sale'}
        </Button>
      </div>
    </form>
  );
}
