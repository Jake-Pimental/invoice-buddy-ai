
import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatCard from "@/components/StatCard";
import { DollarSignIcon, TrendingUpIcon, ClockIcon, CalendarIcon, PieChartIcon, DownloadIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Monthly data for collection rate
const monthlyCollectionData = [
  { name: "Jan", collected: 21500, total: 25000 },
  { name: "Feb", collected: 18200, total: 22000 },
  { name: "Mar", collected: 19800, total: 24000 },
  { name: "Apr", collected: 23500, total: 26000 },
  { name: "May", collected: 26000, total: 28000 },
  { name: "Jun", collected: 29000, total: 30000 },
];

const monthlyDataWithRate = monthlyCollectionData.map(item => ({
  ...item,
  rate: Math.round((item.collected / item.total) * 100)
}));

// Invoice aging data
const agingData = [
  { name: "Current", value: 45 },
  { name: "1-30 days", value: 25 },
  { name: "31-60 days", value: 15 },
  { name: "61-90 days", value: 10 },
  { name: "90+ days", value: 5 },
];

// Client payment time data
const clientPaymentData = [
  { name: "Acme Corp", daysToPayment: 32 },
  { name: "TechStart", daysToPayment: 18 },
  { name: "GlobalDesigns", daysToPayment: 45 },
  { name: "City Services", daysToPayment: 28 },
  { name: "MegaCorp", daysToPayment: 60 },
  { name: "SmallBiz", daysToPayment: 15 },
];

// AI reminder effectiveness data
const reminderEffectivenessData = [
  { name: "Jan", friendly: 65, firm: 45, urgent: 35 },
  { name: "Feb", friendly: 68, firm: 52, urgent: 38 },
  { name: "Mar", friendly: 72, firm: 58, urgent: 42 },
  { name: "Apr", friendly: 75, firm: 60, urgent: 45 },
  { name: "May", friendly: 80, firm: 65, urgent: 50 },
  { name: "Jun", friendly: 85, firm: 70, urgent: 55 },
];

// Summary stats
const summaryStats = {
  totalCollected: 138000,
  avgCollectionRate: 84,
  avgPaymentTime: 27,
  overduePrevention: 76
};

const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#6366F1'];

const Analytics = () => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("6m");
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUploadClick={() => {}} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500">Monitor your invoice collection performance</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Select defaultValue="6m" onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Collected"
            value={formatCurrency(summaryStats.totalCollected)}
            icon={<DollarSignIcon className="h-5 w-5 text-blue-500" />}
            trend={{ value: 12.5, isPositive: true }}
          />
          
          <StatCard
            title="Avg. Collection Rate"
            value={`${summaryStats.avgCollectionRate}%`}
            icon={<TrendingUpIcon className="h-5 w-5 text-green-500" />}
            trend={{ value: 3.2, isPositive: true }}
          />
          
          <StatCard
            title="Avg. Payment Time"
            value={`${summaryStats.avgPaymentTime} days`}
            icon={<ClockIcon className="h-5 w-5 text-purple-500" />}
            trend={{ value: 5.8, isPositive: true }}
            description="Time from invoice issue to payment"
          />
          
          <StatCard
            title="Overdue Prevention"
            value={`${summaryStats.overduePrevention}%`}
            icon={<CalendarIcon className="h-5 w-5 text-orange-500" />}
            trend={{ value: 8.3, isPositive: true }}
            description="Invoices paid before due date"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-slide-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Collection Rate</CardTitle>
              <CardDescription>Monthly collected vs. total invoiced amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyDataWithRate}
                    margin={{
                      top: 10,
                      right: 30,
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
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#71717A' }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#71717A' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "rate") return [`${value}%`, "Collection Rate"];
                        return [formatCurrency(value as number), name === "collected" ? "Collected" : "Total Invoiced"];
                      }}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E4E4E7',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="total"
                      fill="#E2E8F0"
                      name="Total Invoiced"
                      radius={[4, 4, 0, 0]}
                      barSize={isMobile ? 15 : 30}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="collected"
                      fill="#3B82F6"
                      name="Collected"
                      radius={[4, 4, 0, 0]}
                      barSize={isMobile ? 15 : 30}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="rate"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Collection Rate"
                      dot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Invoice Aging</CardTitle>
              <CardDescription>Distribution of unpaid invoices by age</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {agingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E4E4E7',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                      }}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="client-payment-time">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="client-payment-time">Client Payment Time</TabsTrigger>
              <TabsTrigger value="reminder-effectiveness">Reminder Effectiveness</TabsTrigger>
            </TabsList>
          </div>
          
          <Card>
            <TabsContent value="client-payment-time" className="mt-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Client Payment Time</CardTitle>
                <CardDescription>Average days to payment by client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={clientPaymentData}
                      layout="vertical"
                      margin={{
                        top: 10,
                        right: 30,
                        left: isMobile ? 80 : 100,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#71717A' }}
                        domain={[0, 'dataMax + 10']}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#71717A' }}
                        width={isMobile ? 80 : 100}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} days`, "Avg. Payment Time"]}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #E4E4E7',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                        }}
                      />
                      <Bar
                        dataKey="daysToPayment"
                        fill="#6366F1"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                        name="Avg. Days to Payment"
                      />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="reminder-effectiveness" className="mt-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Reminder Effectiveness</CardTitle>
                <CardDescription>Response rates by reminder type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reminderEffectivenessData}
                      margin={{
                        top: 10,
                        right: 30,
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
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Response Rate"]}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #E4E4E7',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="friendly"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Friendly Tone"
                        dot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="firm"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Firm Tone"
                        dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="urgent"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        name="Urgent Tone"
                        dot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
