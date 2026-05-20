import React from 'react';

interface OrderItem {
  customer: string;
  products: number;
  amount: string;
  orderDate: string;
  orderStatus: string;
}

interface LatestOrdersProps {
  className?: string;
}

const LatestOrders: React.FC<LatestOrdersProps> = ({ className = "" }) => {
  const ordersData: OrderItem[] = [
    {
      customer: 'rajarajan2201996@gamil.com',
      products: 1,
      amount: 'INR3,900.00',
      orderDate: '9/15/2025 1:16 PM',
      orderStatus: ''
    },
    {
      customer: 'rajarajan2201996@gamil.com',
      products: 1,
      amount: 'INR4,500.00',
      orderDate: '9/15/2025 1:16 PM',
      orderStatus: ''
    },
    {
      customer: 'rajarajan2201996@gamil.com',
      products: 1,
      amount: 'INR2,500.00',
      orderDate: '9/15/2025 1:16 PM',
      orderStatus: ''
    },
    {
      customer: 'rajarajan2201996@gamil.com',
      products: 1,
      amount: 'INR3,500.00',
      orderDate: '9/15/2025 1:16 PM',
      orderStatus: ''
    },
    {
      customer: 'rajarajan2201996@gamil.com',
      products: 1,
      amount: 'INR16,000.00',
      orderDate: '9/15/2025 1:16 PM',
      orderStatus: ''
    },
    {
      customer: 'rajarajan2201996@gamil.com',
      products: 1,
      amount: 'INR4,500.00',
      orderDate: '9/15/2025 12:47 PM',
      orderStatus: ''
    },
    {
      customer: 'rajarajan2201996@gamil.com',
      products: 1,
      amount: 'INR2,500.00',
      orderDate: '9/15/2025 12:47 PM',
      orderStatus: ''
    }
  ];

  return (
    <div className={`mt-4 sm:mt-6 lg:mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Latest orders</h2>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 sm:px-0 text-sm font-medium text-gray-600">Customer</th>
              <th className="text-left py-3 px-2 sm:px-0 text-sm font-medium text-gray-600">Products</th>
              <th className="text-left py-3 px-2 sm:px-0 text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left py-3 px-2 sm:px-0 text-sm font-medium text-gray-600">Order Date</th>
              <th className="text-left py-3 px-2 sm:px-0 text-sm font-medium text-gray-600">Order status</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map((order, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-4 px-2 sm:px-0 text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                  {order.customer}
                </td>
                <td className="py-4 px-2 sm:px-0 text-sm text-gray-900">
                  {order.products}
                </td>
                <td className="py-4 px-2 sm:px-0 text-sm text-gray-900">
                  {order.amount}
                </td>
                <td className="py-4 px-2 sm:px-0 text-sm text-gray-900">
                  {order.orderDate}
                </td>
                <td className="py-4 px-2 sm:px-0 text-sm text-gray-900">
                  {order.orderStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestOrders;
