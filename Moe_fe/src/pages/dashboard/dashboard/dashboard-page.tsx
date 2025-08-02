"use client";

import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RefreshCw, Eraser, ChevronLeft, ChevronRight } from "lucide-react";
import { UserActivity } from "../type";
import { Page } from "@/common/hooks/type";
import { formatDateTime } from "@/common/lib/utils";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState<string>("off");

  const { data, loading, error, refetch } = useGetApi<Page<UserActivity>>({
    endpoint: "/logs/active-users",
    params: { keyWord: query, page, size },
    enabled: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch active users",
        variant: "destructive",
      });
    },
  });

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setSize(newSize);
      setPage(0);
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
        refetch();
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
  }, [autoRefresh, refetch, toast]);

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search by user code, display name, or IP..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuery("")}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select
            value={autoRefresh}
            onValueChange={setAutoRefresh}
          >
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
            value={size}
            onChange={handleSizeChange}
            min="1"
            className="w-[100px] border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={refetch}
            disabled={loading}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Active Users Count */}
      <div className="mb-4">
        <p className="text-lg text-gray-600">
          Active Users: <span className="font-semibold">{Number(data?.totalElements) || 0}</span>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <RefreshCw className="inline-block h-5 w-5 animate-spin text-gray-600" />
                  <span className="ml-2 text-gray-600">Loading...</span>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-zinc-500">
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.contents.length ? (
              data.contents.map((user,index) => (
                <TableRow key={user.userCode}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{user.userCode}</TableCell>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{user.ip}</TableCell>
                  <TableCell>{formatDateTime(user.firstAccessTime)}</TableCell>
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
      {data && Number(data.totalPages) > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={!data.hasPrevious || loading}
            onClick={() => setPage(page - 1)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {Number(data.page) + 1} of {Number(data.totalPages)} (
            {Number(data.totalElements)} items)
          </span>
          <Button
            disabled={!data.hasNext || loading}
            onClick={() => setPage(page + 1)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;