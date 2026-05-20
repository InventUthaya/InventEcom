import React, { useEffect, useState } from 'react';
import CommonService from '../../services/CommonService';
import { HTTP_Codes } from '../../components/helper/constants';

interface ChartData {
  label: string;
  count: number;
  amount: string;
  segments: Array<{
    color: string;
    percentage: number;
    strokeDasharray: string;
    strokeDashoffset: string;
    type: 'incomplete' | 'unpaid' | 'not_shipped';
    orders: number;
    sales: string;
  }>;
}

interface TooltipData {
  type: 'incomplete' | 'unpaid' | 'not_shipped';
  orders: number;
  sales: string;
  visible: boolean;
}

interface IncompleteOrdersProps {
  className?: string;
}

const CircularChart: React.FC<{ data: ChartData }> = ({ data }) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const radius = 45;

  const getTooltipTitle = (type: string) => {
    switch (type) {
      case 'incomplete':
        return 'Incomplete orders';
      case 'unpaid':
        return 'Total unpaid orders';
      case 'not_shipped':
        return 'Total not yet shipped orders';
      default:
        return '';
    }
  };

  const handleMouseEnter = (segment: any, event: React.MouseEvent<SVGCircleElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest('.chart-container')?.getBoundingClientRect();

    if (containerRect) {
      setMousePos({
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top
      });
    }

    setTooltip({
      type: segment.type,
      orders: segment.orders,
      sales: segment.sales,
      visible: true
    });
  };

  const handleMouseMove = (event: React.MouseEvent<SVGCircleElement>) => {
    const containerRect = event.currentTarget.closest('.chart-container')?.getBoundingClientRect();

    if (containerRect) {
      setMousePos({
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="flex flex-col items-center relative chart-container">
      {/* Label */}
      <h3 className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 text-center">
        {data.label}
      </h3>

      {/* Circular Chart */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="4"
          />

          {/* Progress segments */}
          {data.segments.map((segment, index) => (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => handleMouseEnter(segment, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs sm:text-xl md:text-2xl font-light text-gray-400 mb-1">
            {data.count}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 text-center px-1">
            {data.amount}
          </span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm pointer-events-none whitespace-nowrap"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 60,
            transform: mousePos.x > 150 ? 'translateX(-100%)' : 'translateX(0)'
          }}
        >
          <div className="font-semibold mb-1 text-xs">
            {getTooltipTitle(tooltip.type)}
          </div>
          <div className="text-xs space-y-1">
            <div>Orders: {tooltip.orders}</div>
            <div>Sales: {tooltip.sales}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const IncompleteOrders: React.FC<IncompleteOrdersProps> = ({ className = "" }) => {
  const [chartsData, setChartsData] = useState<ChartData[]>([]);

  // Calculate stroke properties for segments
  const calculateSegments = (percentages: number[]) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    return percentages.map(percentage => {
      const strokeLength = (percentage / 100) * circumference;
      const currentOffset = accumulatedOffset;
      accumulatedOffset += strokeLength;

      return {
        strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
        strokeDashoffset: (-currentOffset).toString()
      };
    });
  };

  const getStaticsData = async () => {
    try {
      const res = await CommonService.get('orderdetail', 'GetDashboardStatistics', "");
      if (res.status === HTTP_Codes.Success || res.status === HTTP_Codes.Created) {
        const apiData = res.data;
        
        // Map API data to ChartData format
        const mappedData: ChartData[] = apiData.map((item: any, index: number) => {
          const labelMap: { [key: string]: string } = {
            'Today': 'Today',
            'Past 7 Days': 'Last 7 days',
            'Past 28 Days': 'Last 28 days',
            'Full Year': 'This year'
          };

          const segmentConfig = [
            { type: 'incomplete', color: '#3B82F6', percentage: 100 },
            { type: 'unpaid', color: '#F59E0B', percentage: 60 },
            { type: 'not_shipped', color: '#DC2626', percentage: 40 },
            { type: 'incomplete', color: '#3B82F6', percentage: 25 }
          ];

          const segments = (() => {
            if (index === 0) {
              // Today: single segment
              return [{
                ...segmentConfig[0],
                orders: item.TotalCount,
                sales: `INR${item.TotalAmount.toFixed(2)}`,
                ...calculateSegments([100])[0]
              }];
            } else if (index === 1 || index === 2) {
              // Last 7 days or Last 28 days: two segments
              const segments = calculateSegments([60, 40]);
              return [
                {
                  ...segmentConfig[1],
                  orders: Math.round(item.TotalCount * 0.6),
                  sales: `INR${(item.TotalAmount * 0.6).toFixed(2)}`,
                  ...segments[0]
                },
                {
                  ...segmentConfig[2],
                  orders: Math.round(item.TotalCount * 0.4),
                  sales: `INR${(item.TotalAmount * 0.4).toFixed(2)}`,
                  ...segments[1]
                }
              ];
            } else {
              // This year: three segments
              const segments = calculateSegments([25, 45, 30]);
              return [
                {
                  ...segmentConfig[0],
                  orders: Math.round(item.TotalCount * 0.25),
                  sales: `INR${(item.TotalAmount * 0.25).toFixed(2)}`,
                  ...segments[0]
                },
                {
                  ...segmentConfig[1],
                  orders: Math.round(item.TotalCount * 0.45),
                  sales: `INR${(item.TotalAmount * 0.45).toFixed(2)}`,
                  ...segments[1]
                },
                {
                  ...segmentConfig[2],
                  orders: Math.round(item.TotalCount * 0.30),
                  sales: `INR${(item.TotalAmount * 0.30).toFixed(2)}`,
                  ...segments[2]
                }
              ];
            }
          })();

          return {
            label: labelMap[item.Period] || item.Period,
            count: item.TotalCount,
            amount: `INR${item.TotalAmount.toFixed(2)}`,
            segments
          };
        });

        setChartsData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    getStaticsData();
  }, []);

  return (
    <div className={`mt-4 sm:mt-6 lg:mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Orders</h2>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
        {chartsData.map((chart, index) => (
          <CircularChart key={index} data={chart} />
        ))}
      </div>
    </div>
  );
};

export default IncompleteOrders;