"use client";

import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Clipboard,
  RefreshCw,
  Eraser,
} from "lucide-react";
import { ActivityLog } from "../type";
import { Page } from "@/common/hooks/type";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/common/lib/utils";

const ActivityLogPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("desc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [viewDetail, setViewDetail] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch activity logs
  const { data, loading, error, refetch } = useGetApi<Page<ActivityLog>>({
    endpoint: "/logs",
    params: { keyWord: debouncedSearchTerm, page, size, sort },
    enabled: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to load activity logs",
        variant: "destructive",
      });
    },
  });

  // Handle sort toggle
  const toggleSort = () => {
    setSort((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    setPage(0);
    refetch();
  };

  const onChangeSize = (newSize: string) => {
    setSize(Number(newSize));
    setPage(0);
  };

  const closeDetail = () => {
    setViewDetail(null);
  };

  // Render status icon based on response code
  const renderStatusIcon = (responseCode: string) => {
    switch (responseCode) {
      case "200":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "400":
      case "404":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "500":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity Log</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search activity logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSearchTerm("")}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select
            value={sort}
            onValueChange={toggleSort}
          >
            <SelectTrigger className="w-[180px] border-gray-300 rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest to Oldest</SelectItem>
              <SelectItem value="asc">Oldest to Newest</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={size.toString()}
            onValueChange={onChangeSize}
          >
            <SelectTrigger className="w-[100px] border-gray-300 rounded-lg">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100, 200].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Total Logs */}
      <div className="mb-4">
        <p className="text-lg text-gray-600">
          Total Logs: <span className="font-semibold">{Number(data?.totalElements) || 0}</span>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">Stt</TableHead>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead className="w-[70px]">Type</TableHead>
              <TableHead className="w-[180px]">Data</TableHead>
              <TableHead className="w-[180px]">Error</TableHead>
              <TableHead className="w-[180px]">Message</TableHead>
              <TableHead className="w-[130px]">IP</TableHead>
              <TableHead className="w-[130px]">User</TableHead>
              <TableHead className="w-[160px]">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <RefreshCw className="inline-block h-5 w-5 animate-spin text-gray-600" />
                  <span className="ml-2 text-gray-600">Loading...</span>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-zinc-500">
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.contents.length ? (
              data.contents.map((log, index) => (
                <TableRow key={log.code}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{renderStatusIcon(log.responseCode)}</TableCell>
                  <TableCell
                    onClick={() => setViewDetail(log.type)}
                    className="cursor-pointer uppercase truncate"
                    title={log.type}
                  >
                    {log.type}
                  </TableCell>
                  <TableCell
                    onClick={() => setViewDetail(log.data)}
                    className="cursor-pointer truncate"
                    title={log.data}
                  >
                    {log.data}
                  </TableCell>
                  <TableCell
                    onClick={() => setViewDetail(log.error)}
                    className="cursor-pointer truncate"
                    title={log.error}
                  >
                    {log.error || "No error"}
                  </TableCell>
                  <TableCell
                    onClick={() => setViewDetail(log.message)}
                    className="cursor-pointer truncate"
                    title={log.message}
                  >
                    {log.message}
                  </TableCell>
                  <TableCell
                    onClick={() => setViewDetail(log.ip)}
                    className="cursor-pointer truncate"
                    title={log.ip}
                  >
                    {log.ip}
                  </TableCell>
                  <TableCell
                    onClick={() => setViewDetail(log.userCode)}
                    className="cursor-pointer truncate"
                    title={log.userCode}
                  >
                    {log.userCode}
                  </TableCell>
                  <TableCell
                    onClick={() => setViewDetail(log.createdAt)}
                    className="cursor-pointer truncate flex items-center gap-1"
                    title={formatDateTime(log.createdAt)}
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-zinc-500">
                  No activity logs found
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

      {/* Detail Dialog */}
      {viewDetail && (
        <Dialog open={!!viewDetail} onOpenChange={closeDetail}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Activity Log Details</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto mb-4">
              <p className="whitespace-pre-wrap break-words">{viewDetail}</p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(viewDetail)}
                className="border-gray-300 rounded-lg"
              >
                <Clipboard className="w-4 h-4 mr-2" />
                Copy Data
              </Button>
              <Button
                onClick={closeDetail}
                className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ActivityLogPage;