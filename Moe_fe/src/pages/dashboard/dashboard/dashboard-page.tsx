import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Eraser} from "lucide-react";
import {
  AnalyticCancelledOrdersRate,
  AnalyticGrossProfit,
  AnalyticLowStockProducts,
  AnalyticNewCustomersOverTime,
  AnalyticOrdersByStatus,
  AnalyticOrdersPerDay,
  AnalyticRevenueOverTime,
  AnalyticTopSellingProducts,
  AnalyticTotalCustomers,
  UserActivity,
} from "../type";
import { Page } from "@/common/hooks/type";
import { formatDateTime, formatVnPrice } from "@/common/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const revenueChartConfig: ChartConfig = {
  value: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const ordersByStatusChartConfig: ChartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  processing: {
    label: "Processing",
    color: "hsl(var(--chart-2))",
  },
  shipped: {
    label: "Shipped",
    color: "hsl(var(--chart-3))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-4))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-5))",
  },
  // Add more statuses if needed
} satisfies ChartConfig;

const topByRevenueChartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const topByQuantityChartConfig: ChartConfig = {
  quantitySold: {
    label: "Quantity",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const today = new Date();
  const defaultStart = new Date(today.setDate(today.getDate() - 30))
    .toISOString()
    .slice(0, 16); // Format: YYYY-MM-DDTHH:mm

  // Separate state for each report's parameters
  const [cancelledOrdersStartDate, setCancelledOrdersStartDate] =
    useState(defaultStart);
  const [grossProfitStartDate, setGrossProfitStartDate] =
    useState(defaultStart);
  const [newCustomersStartDate, setNewCustomersStartDate] =
    useState(defaultStart);
  const [ordersByStatusStartDate, setOrdersByStatusStartDate] =
    useState(defaultStart);
  const [ordersPerDayStartDate, setOrdersPerDayStartDate] =
    useState(defaultStart);
  const [revenueOverTimeStartDate, setRevenueOverTimeStartDate] =
    useState(defaultStart);
  const [lowStockLimit, setLowStockLimit] = useState(5);
  const [topSellingLimit, setTopSellingLimit] = useState(5);

  // Fetch analytics data
  const { data: cancelledOrdersRate } = useGetApi<AnalyticCancelledOrdersRate>({
    endpoint: "/analytic/cancelled-orders-rate",
    params: { startDate: cancelledOrdersStartDate },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const { data: grossProfit } = useGetApi<AnalyticGrossProfit>({
    endpoint: "/analytic/gross-profit",
    params: { startDate: grossProfitStartDate },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const { data: lowStockProducts } = useGetApi<AnalyticLowStockProducts[]>({
    endpoint: "/analytic/low-stock-products",
    params: { limit: lowStockLimit },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const { data: newCustomersOverTime } =
    useGetApi<AnalyticNewCustomersOverTime>({
      endpoint: "/analytic/new-customers-over-time",
      params: { startDate: newCustomersStartDate },
      onError: (err) =>
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        }),
    });

  const { data: ordersByStatus } = useGetApi<AnalyticOrdersByStatus[]>({
    endpoint: "/analytic/orders-by-status",
    params: { startDate: ordersByStatusStartDate },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const { data: ordersPerDay } = useGetApi<AnalyticOrdersPerDay>({
    endpoint: "/analytic/orders-per-day",
    params: { startDate: ordersPerDayStartDate },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const { data: revenueOverTime } = useGetApi<AnalyticRevenueOverTime[]>({
    endpoint: "/analytic/revenue-over-time",
    params: { startDate: revenueOverTimeStartDate },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const { data: topSellingProducts } = useGetApi<AnalyticTopSellingProducts>({
    endpoint: "/analytic/top-selling-products",
    params: { limit: topSellingLimit },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const { data: totalCustomers } = useGetApi<AnalyticTotalCustomers>({
    endpoint: "/analytic/total-customers",
    params: {},
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  // Format data for charts
  const revenueChartData =
    revenueOverTime?.map((item) => ({
      date: new Date(item.dateTime).toLocaleDateString(),
      value: item.orderCount, // Assuming orderCount represents revenue value
    })) || [];

  const ordersByStatusChartData =
    ordersByStatus?.map((item) => ({
      name: item.status,
      value: item.totalOrders,
      fill: `var(--color-${item.status.toLowerCase()})`,
    })) || [];

  const topByRevenueChartData =
    topSellingProducts?.topByRevenue.map((item) => ({
      productName: item.productName,
      revenue: parseFloat(item.revenue),
    })) || [];

  const topByQuantityChartData =
    topSellingProducts?.topByQuantity.map((item) => ({
      productName: item.productName,
      quantitySold: item.quantitySold,
    })) || [];

  // Active Users section
  const [activePage, setActivePage] = useState(0);
  const [activeSize, setActiveSize] = useState(10);
  const [activeQuery, setActiveQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState<string>("off");

  const {
    data: activeData,
    loading: activeLoading,
    error: activeError,
    refetch: activeRefetch,
  } = useGetApi<Page<UserActivity>>({
    endpoint: "/logs/active-users",
    params: { keyWord: activeQuery, page: activePage, size: activeSize },
    enabled: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch active users",
        variant: "destructive",
      });
    },
  });

  const handleActiveSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setActiveSize(newSize);
      setActivePage(0);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh !== "off") {
      const intervalTime = {
        "30s": 30 * 1000,
        "60s": 60 * 1000,
        "10m": 10 * 60 * 1000,
      }[autoRefresh];

      intervalId = setInterval(() => {
        activeRefetch();
        toast({
          description: `Auto-refreshed at ${new Date().toLocaleTimeString()}`,
        });
      }, intervalTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, activeRefetch, toast]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* Revenue Over Time */}
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Showing revenue trends from the selected start date
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="revenueOverTimeStartDate"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Start Date:
              </label>

              <Input
                id="revenueOverTimeStartDate"
                type="datetime-local"
                value={revenueOverTimeStartDate}
                onChange={(e) => setRevenueOverTimeStartDate(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ChartContainer config={revenueChartConfig} className="h-full w-full">
            <AreaChart data={revenueChartData} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Gross Profit - lớn, chiếm 2 cột */}
        <Card className="md:col-span-2 lg:col-span-2 shadow-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Gross Profit
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  From the selected start date
                </CardDescription>
              </div>
              <div>
                <label
                  htmlFor="grossProfitStartDate"
                  className="w-28 text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Start Date:
                </label>
                <Input
                  id="grossProfitStartDate"
                  type="datetime-local"
                  value={grossProfitStartDate}
                  onChange={(e) => setGrossProfitStartDate(e.target.value)}
                  aria-label="Start date for gross profit"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mt-4 text-4xl font-extrabold text-gray-900">
              {formatVnPrice(Number(grossProfit?.grossProfit)) ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-2 shadow-none flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Total Customers
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Overview of customer metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            {/* Hiển thị theo kiểu 23 / 102, chữ số lớn, chữ cách rộng */}
            <p className="mt-4 text-4xl font-extrabold text-gray-900 tracking-wide">
              {totalCustomers?.purchasingCustomers ?? "-"} /{" "}
              {totalCustomers?.totalCustomers ?? "-"}
            </p>

            {/* Phần conversion rate ở dưới góc bên phải, thêm tooltip */}
            <p
              className="mt-auto text-sm font-semibold text-right text-indigo-600 relative group cursor-help"
              title="Tỉ lệ khách mua so với tổng số khách truy cập"
            >
              Conversion Rate: {totalCustomers?.conversionRate ?? "-"}%
              <span className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-indigo-600 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg z-10">
                Tỉ lệ chuyển đổi = khách mua / tổng khách
              </span>
            </p>
          </CardContent>
        </Card>

        {/* 3 thẻ nhỏ hơn, grid con 3 cột */}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Cancelled Orders Rate */}
          <Card className="shadow-none">
            <CardHeader>
              <div className="">
                <div>
                  <CardTitle className="text-md font-semibold text-gray-900">
                    Cancelled Orders Rate
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Starting from the selected date
                  </CardDescription>
                </div>
                <div>
                  <label
                    htmlFor="cancelledOrdersStartDate"
                    className="w-28 text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    Start Date:
                  </label>
                  <Input
                    id="cancelledOrdersStartDate"
                    type="datetime-local"
                    value={cancelledOrdersStartDate}
                    onChange={(e) =>
                      setCancelledOrdersStartDate(e.target.value)
                    }
                    aria-label="Start date for cancelled orders"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <p className="text-4xl font-extrabold text-gray-900">
                  {cancelledOrdersRate?.cancelledOrders ?? "-"} /{" "}
                  {cancelledOrdersRate?.totalOrders ?? "-"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cancelled orders out of total orders
                </p>
                <p className="text-sm font-semibold text-indigo-600 mt-2 text-end">
                  Cancel Rate: {cancelledOrdersRate?.cancelRate ?? "-"}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* New Customers Over Time */}
          <Card className="shadow-none">
            <CardHeader>
              <div>
                <CardTitle className="text-md font-semibold">
                  New Customers
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Count from the selected start date
                </CardDescription>
              </div>
              <div>
                <label
                  htmlFor="newCustomersStartDate"
                  className="w-28 text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Start Date:
                </label>
                <Input
                  id="newCustomersStartDate"
                  type="datetime-local"
                  value={newCustomersStartDate}
                  onChange={(e) => setNewCustomersStartDate(e.target.value)}
                  aria-label="Start date for new customers"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="mt-4 text-4xl font-bold text-gray-900 text-center">
                {newCustomersOverTime?.count ?? "-"}
              </p>
            </CardContent>
          </Card>

          {/* Orders Per Day */}
          <Card className="shadow-none">
            <CardHeader>
              <div>
                <CardTitle className="text-md font-semibold">
                  Orders Per Day
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Average from the selected start date
                </CardDescription>
              </div>
              <div>
                <label
                  htmlFor="ordersPerDayStartDate"
                  className="w-28 text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Start Date:
                </label>
                <Input
                  id="ordersPerDayStartDate"
                  type="datetime-local"
                  value={ordersPerDayStartDate}
                  onChange={(e) => setOrdersPerDayStartDate(e.target.value)}
                  aria-label="Start date for orders per day"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="mt-4 text-4xl font-bold text-gray-900 text-center">
                {ordersPerDay?.orderCount ?? "-"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Orders by Status - Pie Chart */}
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            {/* Tiêu đề và mô tả */}
            <div>
              <CardTitle>Orders by Status</CardTitle>
              <CardDescription>
                Distribution from the selected start date
              </CardDescription>
            </div>

            {/* Input chọn ngày nằm ngang */}
            <div className="flex items-center space-x-3">
              <label
                htmlFor="ordersByStatusStartDate"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Start Date:
              </label>
              <Input
                id="ordersByStatusStartDate"
                type="datetime-local"
                value={ordersByStatusStartDate}
                onChange={(e) => setOrdersByStatusStartDate(e.target.value)}
                aria-label="Start date for orders by status"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-[400px]">
          <ChartContainer
            config={ordersByStatusChartConfig}
            className="h-full w-full"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              <Pie
                data={ordersByStatusChartData}
                dataKey="value"
                nameKey="name"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Selling Products - Two Bar Charts */}
      <div className="flex justify-between items-center px-3">
        <div>
          <h2 className="font-bold">Top Selling</h2>
        </div>
        <div className="flex items-center space-x-4">
          <label
            htmlFor="topSellingLimit"
            className="text-sm font-medium text-gray-700"
          >
            Limit:
          </label>
          <Input
            id="topSellingLimit"
            type="number"
            value={topSellingLimit}
            onChange={(e) => setTopSellingLimit(Number(e.target.value))}
            min={1}
            className="w-20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Top Selling by Revenue</CardTitle>
            <CardDescription>
              Top {topSellingLimit} products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer
              config={topByRevenueChartConfig}
              className="h-full w-full"
            >
              <BarChart data={topByRevenueChartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="productName" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Top Selling by Quantity</CardTitle>
            <CardDescription>
              Top {topSellingLimit} products by quantity sold
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer
              config={topByQuantityChartConfig}
              className="h-full w-full"
            >
              <BarChart data={topByQuantityChartData} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productName" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="quantitySold"
                  fill="var(--color-quantitySold)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products - Table */}
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Low Stock Products</h2>
              <p className="text-sm text-gray-500">
                Products with stock below the limit
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="lowStockLimit"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Limit:
              </label>
              <Input
                id="lowStockLimit"
                type="number"
                value={lowStockLimit}
                onChange={(e) => setLowStockLimit(Number(e.target.value))}
                min={1}
                className="w-20"
                aria-label="Low stock limit"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product Code</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Stock Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts?.map((product) => (
                <TableRow key={product.productCode}>
                  <TableCell>
                    <img
                      src={`https://res.cloudinary.com/dazttnakn/image/upload/c_fill,w_200,h_200/${product.image}`}
                      alt={product.productName}
                      className="w-16 aspect-[4/5] object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/dashboard/product/detail?code=${encodeURIComponent(
                        product.productCode
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Product Detail"
                      className="hover:underline"
                    >
                      {product.productCode}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/dashboard/product/detail?code=${encodeURIComponent(
                        product.productCode
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Product Detail"
                      className="hover:underline"
                    >
                      {product.productName}
                    </a>
                  </TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Active Users Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Users</h2>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search by user code, display name, or IP..."
              value={activeQuery}
              onChange={(e) => {
                setActiveQuery(e.target.value);
                setActivePage(0);
              }}
              className="border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setActiveQuery("")}
              className="border-gray-300 text-gray-600 hover:text-zinc-500"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Select value={autoRefresh} onValueChange={setAutoRefresh}>
              <SelectTrigger className="w-[120px] border-gray-300 rounded-lg">
                <SelectValue placeholder="Auto-refresh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="30s">30s</SelectItem>
                <SelectItem value="60s">60s</SelectItem>
                <SelectItem value="10m">10m</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Size"
              value={activeSize}
              onChange={handleActiveSizeChange}
              min="1"
              className="w-[100px] border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={activeRefetch}
              disabled={activeLoading}
              className="border-gray-300 text-gray-600 hover:text-zinc-500"
            >
              <RefreshCw
                className={`h-4 w-4 ${activeLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Active Users Count */}
        <div className="mb-4">
          <p className="text-lg text-gray-600">
            Active Users:{" "}
            <span className="font-semibold">
              {Number(activeData?.totalElements) || 0}
            </span>
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stt</TableHead>
                <TableHead>User Code</TableHead>
                <TableHead>Display Name</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>First Access Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <RefreshCw className="inline-block h-5 w-5 animate-spin text-gray-600" />
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : activeError ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-zinc-500">
                    Error: {activeError.message}
                  </TableCell>
                </TableRow>
              ) : activeData?.contents.length ? (
                activeData.contents.map((user, index) => (
                  <TableRow key={user.userCode}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.userCode}</TableCell>
                    <TableCell>{user.displayName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {user.ip}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(user.firstAccessTime)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-zinc-500">
                    No active users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {activeData && Number(activeData.totalPages) > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={!activeData.hasPrevious || activeLoading}
              onClick={() => setActivePage(activePage - 1)}
              className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
            >
              Previous
            </Button>
            <span className="text-gray-600">
              Page {Number(activeData.page) + 1} of{" "}
              {Number(activeData.totalPages)} (
              {Number(activeData.totalElements)} items)
            </span>
            <Button
              disabled={!activeData.hasNext || activeLoading}
              onClick={() => setActivePage(activePage + 1)}
              className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
