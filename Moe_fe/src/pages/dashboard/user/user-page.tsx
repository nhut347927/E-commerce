"use client";

import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  RefreshCw,
  Search,
  ArrowUpDown,
  ArrowRight,
  Eraser,
  Trash2,
} from "lucide-react";
import { Page } from "@/common/hooks/type";
import { Users } from "../type";
import { formatDateTime } from "@/common/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("desc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch users
  const { data, loading, error, refetch } = useGetApi<Page<Users>>({
    endpoint: "/user",
    params: { keyWord: debouncedSearchTerm, page, size, sort },
    enabled: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
    },
  });

  // Handle sort toggle
  const toggleSort = () => {
    setSort((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(0);
  };

  // Handle size change
  const onChangeSize = (newSize: string) => {
    setSize(Number(newSize));
    setPage(0);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users by keyword..."
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
          <Select value={sort} onValueChange={toggleSort}>
            <SelectTrigger className="w-[180px] border-gray-300 rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest to Oldest</SelectItem>
              <SelectItem value="asc">Oldest to Newest</SelectItem>
            </SelectContent>
          </Select>
          <Select value={size.toString()} onValueChange={onChangeSize}>
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
            onClick={refetch}
            disabled={loading}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Total Users */}
      <div className="mb-4">
        <p className="text-lg text-gray-600">
          Total Users:{" "}
          <span className="font-semibold">
            {Number(data?.totalElements) || 0}
          </span>
        </p>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">Stt</TableHead>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead className="w-[150px]">Username</TableHead>
              <TableHead className="w-[150px]">Display Name</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[150px]">Gender</TableHead>
              <TableHead className="w-[100px]">Provider</TableHead>
              <TableHead className="w-[60px]">Verified</TableHead>
              <TableHead className="w-[100px]">Bio</TableHead>
              <TableHead className="w-[160px]">Created At</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  <RefreshCw className="inline-block h-5 w-5 animate-spin text-gray-600" />
                  <span className="ml-2 text-gray-600">Loading...</span>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-zinc-500">
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.contents.length ? (
              data.contents.map((user, index) => (
                <TableRow key={user.code}>
                  <TableCell className="truncate">{index + 1}</TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={`https://res.cloudinary.com/dazttnakn/image/upload/w_80,h_80/${user.avatar}`}
                      />
                      <AvatarFallback>
                        {user.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="truncate">{user.userName}</TableCell>
                  <TableCell className="truncate">{user.displayName}</TableCell>
                  <TableCell className="truncate">{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.provider || "N/A"}</TableCell>
                  <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                  <TableCell className="truncate">{user.bio}</TableCell>
                  <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                  <TableCell className="space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <a
                        href={`/dashboard/permissions?code=${encodeURIComponent(
                          user.code
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Permissions"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-zinc-500">
                  No users found
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

export default UserPage;
