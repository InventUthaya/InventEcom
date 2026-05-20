'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Truck,
  AlertTriangle,
  UserCheck,
  XCircle,
  Clock,
  CheckCircle,
  BarChart,
  Calendar,
  Filter,
  User,
  ChevronDown,
  Search,
  X,
  Banknote,
  BadgeIndianRupee,
  Dice1,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CommonService from '../../services/CommonService';
import CustomSearchDropdown, { DropdownItem } from '../../components/common/CustomSearchDropdown';
import { Roles } from '../../components/helper/HelperConstant';

/* ---------------- TYPES ---------------- */
interface TodaySales {
  TodayOrderCount: number;
  TodayRevenue: number;
  TodayTaxAmount: number;
}

type ApiStat = {
  TileKey: string;
  TileName: string;
  TotalOrders: number;
  TotalRevenue: number;
  TotalTax: number;
};

type LiveOrder = {
  orderId: number;
  customerName?: string;
  productName: string;
  skuCode: string;
  quantity: number;
  orderDate: string;
  statusName?: string;
};
interface Partner {
  Id: number;
  Name: string;
  email: string;
}
type GraphApiItem = {
  Label: string;
  StatusName: string;
  Revenue: number;
  Orders: number;
};
interface PartnerMaster {
  Id: number;
  Name: string;
  email?: string;
}

type ChartPoint = {
  label: string;
  [status: string]: number | string;
};

type StatCardData = {
  title: string;
  totalOrders: number;
  totalRevenue: number;
  totalTax: number;
  icon: string;
};


function FilterCard({
  onFilterChange,
  loading = false,
}: {
  onFilterChange: (filters: {
    fromDate: string | null;
    toDate: string | null;
    partnerId: number | null;
  }) => void;
  loading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoadingPartners(true);
      try {
        const response = await CommonService.get("products", "GetAllPartner", "noParam");
        if (response.status === 200) {
          const apiData: any[] = response.data;
          const partnersData: Partner[] = apiData.map(partner => ({
            Id: partner.Id,
            Name: partner.Name,
            email: partner.Email || '',
          }));
          setPartners(partnersData);
        }
      } catch (error: any) {
        console.error('Failed to load partners', error);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchPartners();
  }, []);

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (
    type: 'date' | 'partner',
    value?: string | number | null
  ) => {
    if (type === 'date') {
      onFilterChange({
        fromDate: fromDate || null,
        toDate: toDate || null,
        partnerId,
      });
    } else {
      onFilterChange({
        fromDate: fromDate || null,
        toDate: toDate || null,
        partnerId: value as number | null,
      });
    }
  };

  const handlePartnerSelect = (item: DropdownItem) => {
    const partnerIdValue = item.value === 'all' ? null : Number(item.value);
    setPartnerId(partnerIdValue);
    handleFilterChange('partner', partnerIdValue);
  };

  const handleClearAll = () => {
    setFromDate('');
    setToDate('');
    setPartnerId(null);

    onFilterChange({
      fromDate: null,
      toDate: null,
      partnerId: null,
    });
  };

  const handleClearDates = () => {
    setFromDate('');
    setToDate('');
    onFilterChange({
      fromDate: null,
      toDate: null,
      partnerId,
    });
  };

  const hasActiveFilters = () => {
    return fromDate !== '' || toDate !== '' || partnerId !== null;
  };

  const hasActiveDates = () => {
    return fromDate !== '' || toDate !== '';
  };

  const getSelectedPartnerName = () => {
    if (partnerId === null) return 'All Partners';
    const partner = partners.find(p => p.Id === partnerId);
    return partner ? partner.Name : 'All Partners';
  };

  // Convert partners to dropdown items
  const partnerDropdownItems: DropdownItem[] = [
    {
      id: 'all-partners',
      label: 'All Partners',
      value: 'all',
    },
    ...partners.map(partner => ({
      id: `partner-${partner.Id}`,
      label: partner.Name,
      value: partner.Id.toString(),
    }))
  ];

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div className="relative flex justify-end" ref={popupRef}>
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Filter className="w-4 h-4 text-gray-600" />
          {hasActiveFilters() && (
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 w-80 bg-white rounded-xl border shadow-lg z-50">
          {/* Header */}
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Filters</h3>
              </div>
              {hasActiveFilters() && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filter Content */}
          <div className="p-4 space-y-4">
            {/* Date Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>Date Range</span>
                </div>
                {hasActiveDates() && (
                  <button
                    onClick={handleClearDates}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      handleFilterChange('date');
                    }}
                    max={toDate || maxDate}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      handleFilterChange('date');
                    }}
                    min={fromDate}
                    max={maxDate}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Partner Dropdown using CustomSearchDropdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4" />
                <span>Partner</span>
              </div>

              {loadingPartners ? (
                <div className="text-xs text-gray-500 py-2">
                  Loading partners...
                </div>
              ) : (
                <CustomSearchDropdown
                  buttonText={getSelectedPartnerName()}
                  placeholder="Search partners..."
                  items={partnerDropdownItems}
                  onItemSelect={handlePartnerSelect}
                  buttonClassName="w-full text-sm border rounded-lg hover:bg-gray-50 focus:outline-none focus:border-blue-500"
                  menuClassName="rounded-lg shadow-lg border border-gray-300"
                // usePortal={false}
                />
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters() && (
            <div className="px-4 py-3 bg-blue-50 border-t">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Active filters:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {hasActiveDates() && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      📅 {fromDate || 'Any'} → {toDate || 'Any'}
                    </span>
                  )}
                  {partnerId && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      👥 {getSelectedPartnerName()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default function EcommerceDashboard() {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [salesData, setSalesData] = useState<TodaySales>({
    TodayOrderCount: 0,
    TodayRevenue: 0,
    TodayTaxAmount: 0,
  });
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [groupBy, setGroupBy] = useState<'DAY' | 'MONTH' | 'YEAR'>('MONTH');
  const [filters, setFilters] = useState<{
    fromDate: string | null;
    toDate: string | null;
    partnerId: number | null;
  }>({
    fromDate: null,
    toDate: null,
    partnerId: null,
  });

  const [userRole, setUserRole] = useState<number | null>(null);

  const [partnerId, setPartnerId] = useState<number | null>(null);



  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const decoded = decodeJWT(token);
    if (decoded && decoded.RoleId) {
      setUserRole(Number(decoded.RoleId));
      setPartnerId(Number(decoded.PartnerId));
    }
  }, []);

  const fetchAllData = async (filters: {
    fromDate: string | null;
    toDate: string | null;
    partnerId: number | null;
  }, groupByValue: 'DAY' | 'MONTH' | 'YEAR') => {
    try {
      const token = localStorage.getItem("Token");
      const decoded = decodeJWT(token);
      const userRoleId = decoded ? Number(decoded.RoleId) : null;
      const userPartnerId = decoded ? Number(decoded.PartnerId) : null;

      // Only include partnerId in API call if RoleId is 1
      const requestFilters: any = {
        statusName: 'ALL',
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        partnerId: null
      };

      // Add partnerId only if RoleId is 1
      if (userRoleId == Roles.Admin && filters.partnerId) {
        requestFilters.partnerId = filters.partnerId;
      }

      if (userRoleId == Roles.Partner) {
        requestFilters.partnerId = userPartnerId;
      }

      const statsResponse = await CommonService.getWithParams(
        'orderdetail',
        'GetStatistics',
        requestFilters
      );

      const apiStats = statsResponse.data as ApiStat[];
      setStats(mapStatsToCards(apiStats));

      // 2. Fetch chart data
      const chartRequestFilters: any = {
        groupBy: groupByValue,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        partnerId: null
      };

      // Add partnerId only if RoleId is 1
      if (userRoleId == Roles.Admin && filters.partnerId) {
        chartRequestFilters.partnerId = filters.partnerId;
      }

      if (userRoleId == Roles.Partner) {
        chartRequestFilters.partnerId = userPartnerId;
      }

      const chartResponse = await CommonService.getWithParams(
        'orderdetail',
        'GetGraphPath',
        chartRequestFilters
      );
      setChartData(transformChartData(chartResponse.data));

      // 3. Fetch today sales
      const todaySalesFilters: any = {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        partnerId: null
      };

      // Add partnerId only if RoleId is 1
      if (userRoleId == Roles.Admin && filters.partnerId) {
        todaySalesFilters.partnerId = filters.partnerId;
      }

      if (userRoleId == Roles.Partner) {
        todaySalesFilters.partnerId = userPartnerId;
      }

      const todaySalesResponse = await CommonService.getWithParams(
        "orderdetail",
        "GetTodayOrders",
        todaySalesFilters
      );

      const apiData = todaySalesResponse?.data;
      if (apiData) {
        setSalesData({
          TodayOrderCount: apiData.TodayOrderCount,
          TodayRevenue: apiData.TodayRevenue,
          TodayTaxAmount: apiData.TodayTaxAmount,
        });
      }

      // 4. Fetch live orders
      const liveOrdersFilters: any = {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        partnerId: null
      };

      // Add partnerId only if RoleId is 1
      if (userRoleId == Roles.Admin && filters.partnerId) {
        liveOrdersFilters.partnerId = filters.partnerId;
      }
      if (userRoleId == Roles.Partner) {
        liveOrdersFilters.partnerId = userPartnerId;
      }
      const liveOrdersResponse = await CommonService.getWithParams(
        'orderdetail',
        'GetLatestOrders',
        liveOrdersFilters
      );

      const mappedOrders: LiveOrder[] = liveOrdersResponse.data.map((item: any) => ({
        orderId: item.Id || item.OrderDetailId,
        productName: item.ProductName,
        skuCode: item.SkuCode,
        quantity: item.Quantity,
        orderDate: item.OrderDate,
        statusName: item.StatusName,
        customerName: `User ${item.UserId}`
      }));
      setLiveOrders(mappedOrders);

    } catch (error) {
      console.error('Failed to load data', error);
    }
  };

  const handleFilterChange = async (newFilters: {
    fromDate: string | null;
    toDate: string | null;
    partnerId: number | null;
  }) => {
    setFilters(newFilters);

    try {
      await fetchAllData(newFilters, groupBy);
    } catch (error) {
      console.error('Failed to load filtered data', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle groupBy changes
  const handleGroupByChange = async (value: 'DAY' | 'MONTH' | 'YEAR') => {
    setGroupBy(value);
    setLoading(true);

    try {
      const chartRequestFilters: any = {
        groupBy: value,
        fromDate: filters.fromDate,
        toDate: filters.toDate
      };

      // Add partnerId only if RoleId is 1
      if (userRole === 1 && filters.partnerId) {
        chartRequestFilters.partnerId = filters.partnerId;
      }

      const chartResponse = await CommonService.getWithParams(
        'orderdetail',
        'GetGraphPath',
        chartRequestFilters
      );
      setChartData(transformChartData(chartResponse.data));
    } catch (error) {
      console.error('Failed to load chart data', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconByTile = (tileName: string): string => {
    const iconMap: Record<string, string> = {
      'All Orders': 'ShoppingCart',
      'Pending': 'Clock',
      'Confirmed': 'CheckCircle',
      'Assigned': 'UserCheck',
      'Rejected': 'AlertTriangle',
      'Cancelled': 'XCircle',
      'Shipped': 'Truck',
      'Completed': 'Package',
      'Refund Pending': 'Banknote',
      'Refund Completed': 'BadgeIndianRupee',
      'Replacement Request': 'Clock',
      'Replacement Completed': 'Dice1',
      
      
    };

    return iconMap[tileName] || 'BarChart';
  };

  const getIconComponent = (iconName: string) => {
    const className = 'text-[#17284B]';
    switch (iconName) {
      case 'ShoppingCart': return <ShoppingCart className={className} />;
      case 'Package': return <Package className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'CheckCircle': return <CheckCircle className={className} />;
      case 'XCircle': return <XCircle className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'UserCheck': return <UserCheck className={className} />;
      case 'Banknote': return <Banknote className={className} />;
      case 'BadgeIndianRupee': return <BadgeIndianRupee className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Dice1': return <Dice1 className={className} />;

      default: return <BarChart className={className} />;
    }
  };

  const transformChartData = (apiData: GraphApiItem[]): ChartPoint[] => {
    const map: Record<string, ChartPoint> = {};

    apiData.forEach(item => {
      const label = item.Label;
      const status = item.StatusName;

      if (!map[label]) {
        map[label] = { label };
      }

      map[label][status] =
        (map[label][status] as number || 0) + item.Revenue;
    });

    return Object.values(map);
  };

  const mapStatsToCards = (apiStats: ApiStat[]): StatCardData[] => {
    const statusOrder = [
      'All Orders',
      'Pending',
      'Confirmed',
      'Assigned',
      'Rejected',
      'Cancelled',
      'Shipped',
      'Completed'
    ];

    return apiStats
      .map((stat) => ({
        title: stat.TileName,
        totalOrders: stat.TotalOrders,
        totalRevenue: stat.TotalRevenue,
        totalTax: stat.TotalTax,
        icon: getIconByTile(stat.TileName),
      }))
      .sort((a, b) => {
        const indexA = statusOrder.indexOf(a.title);
        const indexB = statusOrder.indexOf(b.title);

        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
  };

  const formatOrderTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday =
      new Date(today.setDate(today.getDate() - 1)).toDateString() ===
      date.toDateString();

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today · ${time}`;
    if (isYesterday) return `Yesterday · ${time}`;
    return date.toLocaleDateString();
  };

  const STATUS_COLORS: Record<string, string> = {
    Assigned: '#2563EB',
    Cancelled: '#EF4444',
    Completed: '#22C55E',
    Confirmed: '#0EA5E9',
    Pending: '#F59E0B',
    Rejected: '#6B7280',
    Shipped: '#8B5CF6',
    'Refund Pending': '#8B5CF6',
    'Refund Completed': '#8B5CF6',
    'Replacement Request': '#8B5CF6',
    'Replacement Completed': '#8B5CF6',
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await fetchAllData({
          fromDate: null,
          toDate: null,
          partnerId: null
        }, groupBy);
      } catch (error) {
        console.error('Failed to load initial data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userRole, partnerId]); // Re-fetch when userRole changes

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-[#F4F6FB] min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Conditionally render FilterCard based on RoleId */}
      {userRole == Roles.Admin && (
        <FilterCard
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            totalOrders={stat.totalOrders}
            totalRevenue={stat.totalRevenue}
            totalTax={stat.totalTax}
            icon={getIconComponent(stat.icon)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div className="bg-white rounded-xl p-5 lg:col-span-2 border">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-sm">Revenue vs Orders</h3>
            <select
              className="border rounded-md text-sm px-2 py-1"
              value={groupBy}
              onChange={(e) => handleGroupByChange(e.target.value as 'DAY' | 'MONTH' | 'YEAR')}
            >
              <option value="DAY">Daily</option>
              <option value="MONTH">Monthly</option>
              <option value="YEAR">Yearly</option>
            </select>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString()}`,
                    name,
                  ]}
                  contentStyle={{
                    fontSize: '10px',
                    padding: '6px 8px',
                  }}
                  itemStyle={{
                    fontSize: '10px',
                  }}
                  labelStyle={{
                    fontSize: '10px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '9px',
                  }}
                  formatter={(value) => (
                    <span style={{ marginRight: 8 }}>{value}</span>
                  )}
                />
                {chartData.length > 0 &&
                  Object.keys(chartData[0])
                    .filter(key => key !== 'label')
                    .map(status => (
                      <Line
                        key={status}
                        type="monotone"
                        dataKey={status}
                        stroke={STATUS_COLORS[status]}
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white p-5 rounded-xl border h-full flex flex-col">
            <h3 className="font-semibold text-sm mb-3">Today Sales</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-[10px] border-[#17284B] border-t-[#F59E0B] flex items-center justify-center">
                <div className="text-center">
                  <p className="font-bold text-lg">
                    ₹{salesData.TodayRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Today Revenue</p>
                </div>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p className="text-[#17284B]">
                ● Orders {salesData.TodayOrderCount}
              </p>
              <p className="text-amber-500">
                ● Tax ₹{salesData.TodayTaxAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5 mt-6">
        <h3 className="font-semibold text-sm mb-4">Live Orders</h3>
        <div className="space-y-3">
          {liveOrders.map((order) => (
            <div
              key={order.orderId + order.skuCode}
              className="flex justify-between items-center border rounded-lg p-4 hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium">
                  {order.productName}
                  <span className="text-gray-400 font-semibold text-xs ml-1">
                    ({order.skuCode})
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Qty: {order.quantity} · {formatOrderTime(order.orderDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
/* ---------------- STAT CARD COMPONENT ---------------- */
const STAT_STYLES: Record<
  string,
  {
    bg: string;
    iconBg: string;
    text: string;
  }
> = {
  'All Orders': {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    text: 'text-blue-700',
  },
  'Pending': {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    text: 'text-amber-700',
  },
  'Confirmed': {
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100',
    text: 'text-sky-700',
  },
  'Assigned': {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    text: 'text-indigo-700',
  },
  'Rejected': {
    bg: 'bg-gray-50',
    iconBg: 'bg-gray-200',
    text: 'text-gray-700',
  },
  'Cancelled': {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    text: 'text-red-700',
  },
  'Shipped': {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    text: 'text-purple-700',
  },
  'Completed': {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    text: 'text-green-700',
  },
  'Refund Pending': {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    text: 'text-green-700',
  },
    'Refund Completed': {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    text: 'text-red-700',
  },
    'Replacement Request': {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    text: 'text-indigo-700',
  },
    'Replacement Completed': {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    text: 'text-blue-700',
  },
};

function StatCard({
  title,
  totalOrders,
  totalRevenue,
  icon,
}: any) {
  const style = STAT_STYLES[title] || {
    bg: 'bg-white',
    iconBg: 'bg-[#17284B]/10',
    text: 'text-gray-700',
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${style.bg}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${style.iconBg}`}>
          <div className="w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-700">{title}</p>
          <p className={`text-sm font-bold ${style.text}`}>
            {totalOrders}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-gray-900">
          ₹{totalRevenue.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-500">Revenue</p>
      </div>
    </div>
  );
}
