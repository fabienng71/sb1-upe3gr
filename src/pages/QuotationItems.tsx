import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Loader } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { fetchProducts } from '../services/googleSheets';
import { ProductCard } from '../components/ProductCard';
import { ProductList } from '../components/ProductList';
import { ErrorDisplay } from '../components/ErrorDisplay';

export function QuotationItems() {
  const navigate = useNavigate();
  const {
    products,
    selectedProducts,
    isLoading,
    error,
    setProducts,
    setLoading,
    setError,
    toggleProductSelection,
  } = useProductStore();

  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        if (mounted) {
          setProducts(data);
        }
      } catch (error) {
        if (mounted) {
          setError(
            error instanceof Error 
              ? error.message 
              : 'Failed to load products. Please try again.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [setLoading, setError, setProducts]);

  const handleAddSelected = () => {
    if (selectedProducts.length > 0) {
      navigate('/quotations/customer-select');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900">Select Products</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow px-3 py-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleAddSelected}
            disabled={selectedProducts.length === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedProducts.length > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Selected Items ({selectedProducts.length})
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items available. Please check the data source.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.itemCode}
              product={product}
              selected={selectedProducts.some((p) => p.itemCode === product.itemCode)}
              onSelect={() => toggleProductSelection(product)}
            />
          ))}
        </div>
      ) : (
        <ProductList
          products={products}
          selectedProducts={selectedProducts}
          onSelect={toggleProductSelection}
        />
      )}
    </div>
  );
}