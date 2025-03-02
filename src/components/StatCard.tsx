
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}: StatCardProps) => {
  return (
    <div 
      className={cn(
        "relative bg-white rounded-xl p-6 shadow-subtle border border-gray-100 transition-all duration-300 ease-apple animate-slide-up hover-scale",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span 
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-blue-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      
      {description && (
        <p className="mt-4 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
