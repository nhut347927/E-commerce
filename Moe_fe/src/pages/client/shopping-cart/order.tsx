import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/common/hooks/use-toast";
import { useGetApi } from "@/common/hooks/use-get-api";
import axiosInstance from "@/services/axios/axios-instance";
import { formatVnPrice } from "@/common/lib/utils";
import { ChevronDown, ChevronUp, Search, Star } from "lucide-react";
import { OrderAll, OrderItemAll } from "@/pages/dashboard/type";

interface FilterPageDto {
  q?: string;
  page: number;
  size: number;
  sort: "asc" | "desc";
}

const ViewOrders: React.FC = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterPageDto>({
    q: "",
    page: 0,
    size: 10,
    sort: "desc",
  });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [ratingForm, setRatingForm] = useState<{
    [key: string]: { ratingValue: number; comment: string };
  }>({});
  const [searchInput, setSearchInput] = useState("");

  // Fetch orders
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetApi<{
    contents: OrderAll[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }>({
    endpoint: "/order/client/all",
    params: filter,
    enabled: true,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to load orders",
        variant: "destructive",
      });
    },
  });

  // Fetch order items for expanded order
  const {
    data: orderItemsData,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useGetApi<OrderItemAll[]>({
    endpoint: "/order/client/item/all",
    params: { code: expandedOrder },
    enabled: !!expandedOrder,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to load order items",
        variant: "destructive",
      });
    },
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter((prev) => ({ ...prev, q: searchInput, page: 0 }));
  };

  // Handle sort change
  const handleSortChange = (value: "asc" | "desc") => {
    setFilter((prev) => ({ ...prev, sort: value, page: 0 }));
  };

  // Handle size change
  const handleSizeChange = (value: string) => {
    setFilter((prev) => ({ ...prev, size: parseInt(value), page: 0 }));
  };

  // Handle rating submission
  const handleSubmitRating = async (orderItemCode: string) => {
    const rating = ratingForm[orderItemCode];
    if (!rating || rating.ratingValue < 1 || rating.ratingValue > 5) {
      toast({
        title: "Error",
        description: "Please select a rating between 1 and 5",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/rating", {
        orderItemCode,
        ratingValue: rating.ratingValue,
        comment: rating.comment,
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Rating submitted successfully",
        });
        // Optimistically update local orderItemsData to hide form
        if (orderItemsData) {
          orderItemsData.map((item) =>
            item.code === orderItemCode ? { ...item, rating: true } : item
          );
          // Note: Since useGetApi doesn't support manual update, we refetch
          refetchItems();
        }
        refetchOrders();
        setRatingForm((prev) => ({
          ...prev,
          [orderItemCode]: { ratingValue: 0, comment: "" },
        }));
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to submit rating",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit rating",
        variant: "destructive",
      });
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  // Toggle order expansion
  const toggleOrder = (code: string) => {
    setExpandedOrder(expandedOrder === code ? null : code);
  };

  // Format date
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Handle star click
  const handleStarClick = (orderItemCode: string, value: number) => {
    setRatingForm((prev) => ({
      ...prev,
      [orderItemCode]: {
        ...prev[orderItemCode],
        ratingValue: value,
      },
    }));
  };

   function getStatusClass(status: string) {
  switch (status) {
    case "PAYMENT_PENDING":
      return "bg-yellow-200 text-yellow-900"; // màu vàng đậm hơn
    case "PAYMENT_CANCELED":
      return "bg-red-200 text-red-900"; // màu đỏ nhạt hơn FAILED
    case "PAYMENT_REFUND":
      return "bg-orange-200 text-orange-900"; // màu cam nhạt (hoàn tiền)
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"; // màu vàng nhạt
    case "PACKED":
      return "bg-blue-100 text-blue-800"; // màu xanh dương nhạt
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-800"; // màu tím nhạt
    case "IN_TRANSIT":
      return "bg-purple-100 text-purple-800"; // màu tím đậm hơn
    case "OUT_FOR_DELIVERY":
      return "bg-teal-100 text-teal-800"; // màu xanh ngọc
    case "DELIVERED":
      return "bg-green-100 text-green-800"; // màu xanh lá nhạt
    case "FAILED":
      return "bg-red-100 text-red-800"; // màu đỏ nhạt
    case "CANCELED":
      return "bg-gray-100 text-gray-800"; // màu xám nhạt
    case "RETURNED":
      return "bg-pink-100 text-pink-800"; // màu hồng nhạt
    default:
      return "bg-gray-50 text-gray-600"; // màu mặc định nhạt
  }
}


const cancelOrder = async (orderCode: string) => {
  try {
    const response = await axiosInstance.post("/order/client/cancel", { code: orderCode });
    if (response.data.code === 200) {
      toast({
        title: "Success",
        description: "Order canceled successfully",
      });
      refetchOrders();
    } else {
      toast({
        title: "Error",
        description: response.data.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.response?.data?.message || "Failed to cancel order",
      variant: "destructive",
    });
  }
};

  return (
    <section>
      {/* Breadcrumb Section */}
      <div className="py-8 bg-gray-100 mb-20">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">
              Your Orders
            </h4>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <Link to="/home" className="text-sm cursor-pointer">
                Home
              </Link>
              <span className="text-sm">/</span>
              <span className="text-sm text-gray-400">Orders</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full sm:w-auto"
          >
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search orders..."
              className="h-10 w-full sm:w-64 text-gray-700 rounded-none"
              aria-label="Search orders"
            />
            <Button
              type="submit"
              className="h-10 px-4 bg-black hover:bg-black/70 text-white rounded-none ml-2"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          <div className="flex items-center gap-4">
            <Select onValueChange={handleSortChange} defaultValue={filter.sort}>
              <SelectTrigger className="h-10 w-32 rounded-none">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleSizeChange}
              defaultValue={filter.size.toString()}
            >
              <SelectTrigger className="h-10 w-32 rounded-none">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {ordersLoading && (
          <div className="py-8 text-center text-gray-600">
            Loading orders...
          </div>
        )}
        {ordersError && (
          <div className="py-8 text-center text-red-500">
            Failed to load orders. Please try again.
          </div>
        )}
        {!ordersLoading &&
          !ordersError &&
          ordersData?.contents.length === 0 && (
            <div className="py-8 text-center text-gray-600">
              You have no orders.
            </div>
          )}

        {!ordersLoading &&
          !ordersError &&
          ordersData &&
          ordersData?.contents.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="grid grid-cols-5 gap-4 border-b border-gray-200 pb-6 text-black font-semibold text-base">
                <div className="uppercase">Order ID</div>
                <div className="uppercase">Date</div>
                <div className="uppercase">Total</div>
                <div className="uppercase">Status</div>
                <div className="uppercase">Details</div>
              </div>
              {ordersData?.contents.map((order) => (
                <div key={order.code} className="border-b border-gray-200 py-4">
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="text-gray-800">{order.code}</div>
                    <div className="text-gray-600">
                      {formatDate(order.createAt)}
                    </div>
                    <div className="text-gray-800 font-semibold">
                      {formatVnPrice(order.total)}
                    </div>
                    <div className={getStatusClass(order.deliveryStatus)+" h-full flex justify-center items-center"}>{order.deliveryStatus}</div>
                    {order.deliveryStatus === "PENDING" && (
                                  <Button
                                    variant="destructive"
                                    className="mt-2 h-8 px-4 rounded-none"
                                    onClick={() => cancelOrder(order.code)}
                                    aria-label={`Cancel order ${order.code}`}
                                  >
                                    Cancel Order
                                  </Button>
                                )}
                    <Button
                      variant="ghost"
                      onClick={() => toggleOrder(order.code)}
                      className="flex items-center justify-center"
                      aria-label={`Toggle details for order ${order.code}`}
                    >
                      {expandedOrder === order.code ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {expandedOrder === order.code && (
                    <div className="mt-4">
                      {itemsLoading && (
                        <div className="py-4 text-center text-gray-600">
                          Loading details...
                        </div>
                      )}
                      {itemsError && (
                        <div className="py-4 text-center text-red-500">
                          Failed to load order details.
                        </div>
                      )}
                      {!itemsLoading && !itemsError && orderItemsData && (
                        <div className="space-y-4">
                          {orderItemsData.map((item) => (
                            <div
                              key={item.code}
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-200 pb-4"
                            >
                              <img
                                src={`https://res.cloudinary.com/dazttnakn/image/upload/${item.image}`}
                                alt={item.productName}
                                className="aspect-square w-16 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h6 className="text-sm font-medium text-gray-800">
                                  {item.productName}
                                </h6>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="px-2 py-0.5 text-xs font-medium rounded-sm bg-gray-100 text-gray-700 border border-gray-200">
                                    {item.size}
                                  </span>
                                  <span className="flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-sm bg-gray-100 text-gray-700 border border-gray-200">
                                    <span
                                      className="h-4 w-4 rounded-full mr-1 border"
                                      style={{ backgroundColor: item.color }}
                                    ></span>
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  Quantity: {item.quantity} | Price:{" "}
                                  {formatVnPrice(item.price)}
                                </p>

                                {item.rating ? (
                                  <p className="text-sm text-green-600 mt-1">
                                    Rated
                                  </p>
                                ) : order?.deliveryStatus === "DELIVERED" ? (
                                  <div className="mt-2">
                                    <div className="flex flex-col gap-2">
                                      <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`h-6 w-6 cursor-pointer ${
                                              star <=
                                              (ratingForm[item.code]
                                                ?.ratingValue || 0)
                                                ? "fill-yellow-400 stroke-yellow-400"
                                                : "stroke-gray-300"
                                            }`}
                                            onClick={() =>
                                              handleStarClick(item.code, star)
                                            }
                                            aria-label={`Rate ${star} stars for ${item.productName}`}
                                          />
                                        ))}
                                      </div>
                                      <Input
                                        type="text"
                                        value={
                                          ratingForm[item.code]?.comment || ""
                                        }
                                        onChange={(e) =>
                                          setRatingForm((prev) => ({
                                            ...prev,
                                            [item.code]: {
                                              ...prev[item.code],
                                              comment: e.target.value,
                                            },
                                          }))
                                        }
                                        placeholder="Comment"
                                        className="h-10 text-gray-700 rounded-none"
                                        aria-label={`Comment for ${item.productName}`}
                                      />
                                      <Button
                                        onClick={() =>
                                          handleSubmitRating(item.code)
                                        }
                                        className="h-10 px-4 bg-black hover:bg-black/70 text-white rounded-none w-fit"
                                        aria-label={`Submit rating for ${item.productName}`}
                                      >
                                        Submit
                                      </Button>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {/* Pagination */}
              {ordersData && ordersData.totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={!ordersData.hasPrevious}
                    onClick={() => handlePageChange(filter.page - 1)}
                    className="h-10 px-4 rounded-none"
                    aria-label="Previous page"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center text-gray-600">
                    Page {ordersData.page + 1} of {ordersData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!ordersData.hasNext}
                    onClick={() => handlePageChange(filter.page + 1)}
                    className="h-10 px-4 rounded-none"
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  );
};

export default ViewOrders;
