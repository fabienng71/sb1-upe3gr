import React from 'react';
import { useStore } from '../store/useStore';
import { Users, FileText, DollarSign } from 'lucide-react';

export function Dashboard() {
  const { customers, quotations, sales } = useStore();
  
  const stats = [
    {
      name: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Quotations',
      value: quotations.filter((q) => q.status === 'pending').length,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      name: 'Total Sales',
      value: sales.reduce((acc, sale) => acc + sale.total, 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}