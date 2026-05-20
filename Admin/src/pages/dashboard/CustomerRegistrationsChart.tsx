import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface CustomerRegistrationsProps {
  className?: string;
}

const CustomerRegistrationsChart: React.FC<CustomerRegistrationsProps> = ({ className = "" }) => {
  const [activeFilter, setActiveFilter] = useState('Yesterday');

  const dataByPeriod = {
    'Today': [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 },
      { name: 'Apr', value: 0 },
      { name: 'May', value: 2 },
      { name: 'Jun', value: 15 },
      { name: 'Jul', value: 45 },
      { name: 'Aug', value: 25 },
      { name: 'Sep', value: 8 },
      { name: 'Oct', value: 2 },
      { name: 'Nov', value: 0 },
      { name: 'Dec', value: 0 },
    ],
    'Yesterday': [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 },
      { name: 'Apr', value: 0 },
      { name: 'May', value: 5 },
      { name: 'Jun', value: 25 },
      { name: 'Jul', value: 65 },
      { name: 'Aug', value: 40 },
      { name: 'Sep', value: 15 },
      { name: 'Oct', value: 3 },
      { name: 'Nov', value: 0 },
      { name: 'Dec', value: 0 },
    ],
    'Last 7 days': [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 },
      { name: 'Apr', value: 2 },
      { name: 'May', value: 8 },
      { name: 'Jun', value: 30 },
      { name: 'Jul', value: 55 },
      { name: 'Aug', value: 35 },
      { name: 'Sep', value: 12 },
      { name: 'Oct', value: 4 },
      { name: 'Nov', value: 0 },
      { name: 'Dec', value: 0 },
    ],
    'Last 28 days': [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 1 },
      { name: 'Apr', value: 5 },
      { name: 'May', value: 12 },
      { name: 'Jun', value: 35 },
      { name: 'Jul', value: 60 },
      { name: 'Aug', value: 38 },
      { name: 'Sep', value: 18 },
      { name: 'Oct', value: 6 },
      { name: 'Nov', value: 1 },
      { name: 'Dec', value: 0 },
    ],
    'This year': [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 1 },
      { name: 'Mar', value: 3 },
      { name: 'Apr', value: 8 },
      { name: 'May', value: 18 },
      { name: 'Jun', value: 40 },
      { name: 'Jul', value: 70 },
      { name: 'Aug', value: 45 },
      { name: 'Sep', value: 22 },
      { name: 'Oct', value: 10 },
      { name: 'Nov', value: 2 },
      { name: 'Dec', value: 0 },
    ],
  };

  const currentData = dataByPeriod[activeFilter as keyof typeof dataByPeriod] || dataByPeriod.Yesterday;
  const filterOptions = ['Today', 'Yesterday', 'Last 7 days', 'Last 28 days', 'This year'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg text-sm">
          <p className="font-medium">{`${label}: ${payload[0].value} registrations`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`mt-4 sm:mt-6 lg:mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 lg:gap-0 mb-4 sm:mb-6">
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 sm:gap-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Customer registrations</h2>
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
            <span className="text-lg sm:text-xl lg:text-2xl font-light text-gray-600">3</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm sm:text-base text-green-500 font-semibold">+200%</span>
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap ${
                activeFilter === option
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
              interval={0}
              className="text-xs sm:text-sm"
            />
            <YAxis hide />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            <Bar
              dataKey="value"
              fill="url(#blueGradient)"
              radius={[2, 2, 0, 0]}
              stroke="#3B82F6"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerRegistrationsChart;
