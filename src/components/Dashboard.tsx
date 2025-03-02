
import { DashboardStats } from "@/types";
import StatCard from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import {
  DollarSignIcon,
  AlertTriangleIcon,
  ClockIcon,
  TrendingUpIcon,
  CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardProps {
  stats: DashboardStats;
}

const Dashboard = ({ stats }: DashboardProps) => {
  const isMobile = useIsMobile();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Sample data for the charts
  const monthlyCollectionData = [
    { name: "Jan", amount: 12000 },
    { name: "Feb", amount: 14000 },
    { name: "Mar", amount: 11000 },
    { name: "Apr", amount: 16500 },
    { name: "May", amount: 18000 },
    { name: "Jun", amount: 19500 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Unpaid"
          value={formatCurrency(stats.totalUnpaid)}
          icon={<DollarSignIcon className="h-5 w-5 text-blue-500" />}
          trend={{ value: 5.2, isPositive: false }}
        />
        
        <StatCard
          title="Overdue Invoices"
          value={formatCurrency(stats.totalOverdue)}
          icon={<AlertTriangleIcon className="h-5 w-5 text-orange-500" />}
          trend={{ value: 2.1, isPositive: false }}
        />
        
        <StatCard
          title="Collected This Month"
          value={formatCurrency(stats.totalCollected)}
          icon={<TrendingUpIcon className="h-5 w-5 text-green-500" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        
        <StatCard
          title="Avg. Payment Time"
          value={`${stats.averagePaymentTime} days`}
          icon={<CalendarIcon className="h-5 w-5 text-purple-500" />}
          trend={{ value: 3.2, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyCollectionData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: isMobile ? 10 : 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717A' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#71717A' }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${formatCurrency(value as number)}`, 'Amount']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #E4E4E7',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    barSize={isMobile ? 20 : 40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{animationDelay: '0.1s'}}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Collection Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Collection Rate</span>
                  <span className="text-sm font-semibold">{stats.collectionRate}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-blue-500 rounded-full" 
                    style={{ width: `${stats.collectionRate}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>Target: 85%</span>
                  <span>{stats.collectionRate < 85 ? 'Needs improvement' : 'On track'}</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">AI Reminder Success Rate</span>
                  <span className="text-sm font-semibold">76%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: '76%' }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>Industry avg: 62%</span>
                  <span>Above average</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Days Sales Outstanding (DSO)</span>
                  <span className="text-sm font-semibold">32 days</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-orange-500 rounded-full" 
                    style={{ width: '54%' }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>Target: 30 days</span>
                  <span>Slightly high</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
