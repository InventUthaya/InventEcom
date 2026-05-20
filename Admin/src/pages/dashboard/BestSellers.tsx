import React, { useState } from 'react';

interface BestsellerItem {
  product: string;
  sales: number;
  amount: string;
}

interface TopCustomerItem {
  customer: string;
  orders: number;
  amount: string;
}

interface DashboardTablesProps {
  className?: string;
}

const BestSellers: React.FC<DashboardTablesProps> = ({ className = "" }) => {
  const [bestsellerFilter, setBestsellerFilter] = useState('By quantity');
  const [customerFilter, setCustomerFilter] = useState('By quantity');

  const bestsellerData: BestsellerItem[] = [
    { product: 'Macbook Air 2025', sales: 17, amount: 'INR248,000.00' },
    { product: 'Omen Transcend', sales: 9, amount: 'INR179,000.00' },
    { product: 'iPhone 15', sales: 11, amount: 'INR140,000.00' },
    { product: 'inspiron 2 in1 series', sales: 5, amount: 'INR72,500.00' },
    { product: 'Honor Magic7 Pro', sales: 7, amount: 'INR56,000.00' },
    { product: 'boAt', sales: 6, amount: 'INR36,000.00' },
    { product: 'Noise Fit', sales: 7, amount: 'INR31,000.00' },
  ];

  const topCustomerData: TopCustomerItem[] = [
    { customer: 'madhan@gmail.com', orders: 18, amount: 'INR242,900.00' },
    { customer: 'rajarajan2201996@gamil.com', orders: 17, amount: 'INR137,400.00' },
    { customer: 'khan@abc.com', orders: 11, amount: 'INR130,997.00' },
    { customer: 'vijay@test.com', orders: 10, amount: 'INR191,995.00' },
    { customer: 'surya@gmail.com', orders: 8, amount: 'INR109,970.00' },
    { customer: 'gretaregina31@gmail.com', orders: 7, amount: 'INR81,968.00' },
    { customer: 'pari@gmail.com', orders: 6, amount: 'INR60,885.00' },
  ];

  return (
    <div className={`mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 sm:gap-6 ${className}`}>
      {/* Bestsellers Table */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Bestsellers</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setBestsellerFilter('By quantity')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                bestsellerFilter === 'By quantity'
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              By quantity
            </button>
            <button
              onClick={() => setBestsellerFilter('By amount')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                bestsellerFilter === 'By amount'
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              By amount
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs sm:text-sm font-medium text-gray-600">Product</th>
                <th className="text-center py-3 text-xs sm:text-sm font-medium text-gray-600">Sales</th>
                <th className="text-right py-3 text-xs sm:text-sm font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bestsellerData.map((item, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 text-xs sm:text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                    {item.product}
                  </td>
                  <td className="py-4 text-xs sm:text-sm text-gray-900 text-center">
                    {item.sales}
                  </td>
                  <td className="py-4 text-xs sm:text-sm text-gray-900 text-right font-medium">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top customers Table */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Top customers</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCustomerFilter('By quantity')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                customerFilter === 'By quantity'
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              By quantity
            </button>
            <button
              onClick={() => setCustomerFilter('By amount')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                customerFilter === 'By amount'
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              By amount
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs sm:text-sm font-medium text-gray-600">Customer</th>
                <th className="text-center py-3 text-xs sm:text-sm font-medium text-gray-600">Orders</th>
                <th className="text-right py-3 text-xs sm:text-sm font-medium text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {topCustomerData.map((item, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 text-xs sm:text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                    {item.customer}
                  </td>
                  <td className="py-4 text-xs sm:text-sm text-gray-900 text-center">
                    {item.orders}
                  </td>
                  <td className="py-4 text-xs sm:text-sm text-gray-900 text-right font-medium">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
