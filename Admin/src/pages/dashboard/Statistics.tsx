import React from 'react';
import { 
  Package, 
  Tags, 
  Layers, 
  Grid3x3, 
  Building2, 
  Image, 
  HardDrive, 
  Users, 
  TrendingUp, 
  CreditCard, 
  UserCheck, 
  ShoppingCart, 
  Heart 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

interface StatisticsProps {
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-3 sm:p-4 flex items-center justify-between min-h-[80px] sm:min-h-[90px]">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-1 truncate">
          {value}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 truncate">
          {title}
        </span>
      </div>
      <div className="text-gray-400 ml-2 flex-shrink-0">
        {React.cloneElement(icon as React.ReactElement, { 
        //   size: window.innerWidth < 640 ? 20 : window.innerWidth < 768 ? 24 : 28 
        })}
      </div>
    </div>
  );
};

const StatCardResponsive: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-3 sm:p-4 flex items-center justify-between min-h-[80px] sm:min-h-[90px]">
      <div className="flex flex-col flex-1 min-w-0 pr-2">
        <span className="text-lg sm:text-xl md:text-sm font-light text-gray-900 mb-1 truncate leading-tight">
          {value}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 truncate leading-tight">
          {title}
        </span>
      </div>
      <div className="text-gray-400 flex-shrink-0">
        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
          {React.cloneElement(icon as React.ReactElement, { 
            // className: "w-full h-full"
          })}
        </div>
      </div>
    </div>
  );
};

const Statistics: React.FC<StatisticsProps> = ({ className = "" }) => {
  const statsData = [
    { title: "Products", value: "19", icon: <Package /> },
    { title: "Attributes", value: "3", icon: <Tags /> },
    { title: "Combinations", value: "21", icon: <Layers /> },
    { title: "Categories", value: "21", icon: <Grid3x3 /> },
    { title: "Manufacturers", value: "0", icon: <Building2 /> },
    { title: "Pictures", value: "46", icon: <Image /> },
    { title: "Media size", value: "7 MB", icon: <HardDrive /> },
    { title: "Customers", value: "35", icon: <Users /> },
    { title: "Orders", value: "105", icon: <TrendingUp /> },
    { title: "Sales", value: "INR1,228,781.00", icon: <CreditCard /> },
    { title: "Online customers", value: "2", icon: <UserCheck /> },
    { title: "Shopping carts", value: "INR91,300.00", icon: <ShoppingCart /> },
    { title: "Wishlists", value: "INR0.00", icon: <Heart /> }
  ];

  return (
    <div className={`mt-4 sm:mt-6 lg:mt-8 ${className}`}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Statistics</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {statsData.map((stat, index) => (
          <StatCardResponsive
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Statistics;
