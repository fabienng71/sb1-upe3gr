import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, ArrowLeft } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useProductStore } from '../store/productStore';
import { fetchCustomers } from '../services/googleSheets';
import { CustomerCard } from '../components/CustomerCard';
import { ErrorDisplay } from '../components/ErrorDisplay';

export function CustomerSelect() {
  const navigate = useNavigate();
  const {
    customers,
    selectedCustomer,
    isLoading,
    error,
    setCustomers,
    setSelectedCustomer,
    setLoading,
    setError,
  } = useCustomerStore();

  const selectedProducts = useProductStore((state) => state.selectedProducts);

  useEffect(() => {
    if (selectedProducts.length === 0) {
      navigate('/quotations');
      return;
    }

    let mounted = true;

    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchCustomers();
        if (mounted) {
          setCustomers(data);
        }
      } catch (error) {
        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to load customers. Please try again.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      mounted = false;
    };
  }, [navigate, selectedProducts.length, setCustomers, setError, setLoading]);

  const handleContinue = () => {
    if (selectedCustomer) {
      // Will implement in next step
      console.log('Selected customer:', selectedCustomer);
      console.log('Selected products:', selectedProducts);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/quotations')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Select Customer</h1>
        </div>
        <button
          onClick={handleContinue}
          disabled={!selectedCustomer}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCustomer
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue with Selected Customer
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.customerCode}
              customer={customer}
              selected={selectedCustomer?.customerCode === customer.customerCode}
              onSelect={() => setSelectedCustomer(customer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}