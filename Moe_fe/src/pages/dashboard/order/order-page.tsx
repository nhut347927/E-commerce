import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, RefreshCw, Edit, Trash2, Eraser, X } from "lucide-react";
import axiosInstance from "@/services/axios/axios-instance";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { formatDateTime, formatVnPrice } from "@/common/lib/utils";
import {
  OrderAll,
  OrderItemAdd,
  OrderItemAll,
  OrderUpdate,
  ProductAllBasic,
} from "../type";
import { Page } from "@/common/hooks/type";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
  townCity?: string;
  phone?: string;
  email?: string;
  paymentMethod?: string;
  deliveryStatus?: string;
  productCode?: string;
  quantity?: string;
}

const OrderPage: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>("desc");
  const [selectedOrder, setSelectedOrder] = useState<OrderAll | null>(null);
  const [updateFormData, setUpdateFormData] = useState<OrderUpdate>({
    code: "",
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    townCity: "",
    phone: "",
    email: "",
    paymentMethod: "",
    deliveryStatus: "PENDING",
  });
  const [addItemFormData, setAddItemFormData] = useState<OrderItemAdd>({
    orderCode: "",
    productCode: "",
    quantity: 1,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Fetch orders
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetApi<Page<OrderAll>>({
    endpoint: "/order/all",
    params: { q: search, page, size, sort },
    onSuccess: () => {},
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Fetch delivery statuses
  const { data: deliveryStatuses } = useGetApi<string[]>({
    endpoint: "/order/delivery-status/all",
    onSuccess: () => {},
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Fetch order items for selected order
  const { data: orderItems, refetch: refetchOrderItems } = useGetApi<
    OrderItemAll[]
  >({
    endpoint: "/order/item/all",
    params: { code: selectedOrder?.code },
    enabled: !!selectedOrder?.code,
    onSuccess: () => {},
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Fetch products for adding order items
  const { data: productsData } = useGetApi<Page<ProductAllBasic>>({
    endpoint: "/product/all/basic",
    params: { q: "", page: 0, size: 100, sort: "asc" },
    onSuccess: () => {},
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (selectedOrder) {
      setUpdateFormData({
        code: selectedOrder.code,
        firstName: selectedOrder.firstName,
        lastName: selectedOrder.lastName,
        country: selectedOrder.country,
        address: selectedOrder.address,
        townCity: selectedOrder.townCity,
        phone: selectedOrder.phone,
        email: selectedOrder.email,
        paymentMethod: selectedOrder.paymentMethod,
        deliveryStatus: selectedOrder.deliveryStatus,
      });
      setAddItemFormData({
        ...addItemFormData,
        orderCode: selectedOrder.code,
      });
    }
  }, [selectedOrder]);

  const validateUpdateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!updateFormData.firstName.trim())
      errors.firstName = "First name is required";
    if (!updateFormData.lastName.trim())
      errors.lastName = "Last name is required";
    if (!updateFormData.country.trim()) errors.country = "Country is required";
    if (!updateFormData.address.trim()) errors.address = "Address is required";
    if (!updateFormData.townCity.trim())
      errors.townCity = "Town/City is required";
    if (!updateFormData.phone.match(/^0\d{8,9}$/)) {
      errors.phone = "Phone must start with 0 and have 9 or 10 digits";
    }

    if (!updateFormData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Invalid email format";
    }
    if (!updateFormData.paymentMethod.trim())
      errors.paymentMethod = "Payment method is required";
    if (!updateFormData.deliveryStatus)
      errors.deliveryStatus = "Delivery status is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddItemForm = (): boolean => {
    const errors: FormErrors = {};
    if (!addItemFormData.productCode)
      errors.productCode = "Product is required";
    if (addItemFormData.quantity < 1)
      errors.quantity = "Quantity must be at least 1";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateUpdateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.put("/order", updateFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Order updated successfully.",
        });
        refetchOrders();
        // Update selectedOrder with new data
        setSelectedOrder((prev) =>
          prev ? { ...prev, ...updateFormData } : null
        );
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "An error occurred while updating order.",
        variant: "destructive",
      });
    }
  };

  const handleAddItemSubmit = async () => {
    if (!validateAddItemForm()) {
      toast({
        title: "Form Error",
        description: "Please select a product and valid quantity.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/order/item", addItemFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Order item added successfully.",
        });
        setAddItemFormData({
          orderCode: selectedOrder?.code || "",
          productCode: "",
          quantity: 1,
        });
        refetchOrderItems();
        refetchOrders();
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "An error occurred while adding order item.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/order/item", {
        data: { code },
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Order item deleted successfully.",
        });
        refetchOrderItems();
        refetchOrders();
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          "An error occurred while deleting order item.",
        variant: "destructive",
      });
    }
  };

  const handleSelectOrder = (order: OrderAll) => {
    setSelectedOrder(order);
  };

  const calculateSubtotal = (item: OrderItemAll) => item.quantity * item.price;

  // const calculateTotal = () =>
  //   orderItems?.reduce((sum, item) => sum + calculateSubtotal(item), 0) || 0;
  function getStatusClass(status: string) {
    switch (status) {
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Order Management
      </h2>
      {/* Order Detail Section */}
      {selectedOrder && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mb-10">
          {/* Left: Order Items (Invoice-like) */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Order Items</h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedOrder(null)}
                className="border-gray-300 text-gray-600 hover:text-zinc-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems?.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell className="flex items-center space-x-2">
                      <img
                        src={`https://res.cloudinary.com/dazttnakn/image/upload/c_fill,w_200,h_200/${item.image}`}
                        alt={item.productName}
                        className="w-16 aspect-[4/5] object-cover rounded"
                      />
                      <span>{item.productName}</span>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatVnPrice(item.price)}</TableCell>
                    <TableCell>
                      {formatVnPrice(calculateSubtotal(item))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteItem(item.code)}
                        className="border-gray-300 text-gray-600 hover:text-zinc-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Add Item Row */}
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={addItemFormData.productCode}
                        onValueChange={(value) =>
                          setAddItemFormData({
                            ...addItemFormData,
                            productCode: value,
                          })
                        }
                      >
                        <SelectTrigger
                          className={`w-full border-gray-300 rounded-lg ${
                            formErrors.productCode ? "border-zinc-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {productsData?.contents.map(
                            (product: ProductAllBasic) => (
                              <SelectItem
                                key={product.code}
                                value={product.code}
                              >
                                {product.name} ({formatVnPrice(product.price)})
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={addItemFormData.quantity}
                        onChange={(e) =>
                          setAddItemFormData({
                            ...addItemFormData,
                            quantity: Number(e.target.value),
                          })
                        }
                        className={`w-20 border-gray-300 rounded-lg focus:ring-zinc-500 ${
                          formErrors.quantity ? "border-zinc-500" : ""
                        }`}
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleAddItemSubmit}
                        className="w-12 border-gray-300 text-gray-600 hover:text-zinc-500"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {(formErrors.productCode || formErrors.quantity) && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.productCode || formErrors.quantity}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={3} className="text-right">
                    {`Subtotal( ${selectedOrder.quantity} item ):`}
                  </TableHead>
                  <TableHead>{formatVnPrice(selectedOrder.price)}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableHeader>
                <TableRow>
                  <TableHead colSpan={3} className="text-right">
                    Discount:
                  </TableHead>
                  <TableHead className="text-green-600">
                    - {formatVnPrice(selectedOrder.discountAmount)}
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableHeader>
                <TableRow>
                  <TableHead colSpan={3} className="text-right">
                    Shipping Fee:
                  </TableHead>
                  <TableHead className="text-red-600">
                    + {formatVnPrice(selectedOrder.shippingFee)}
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableHeader>
                <TableRow>
                  <TableHead colSpan={3} className="text-right">
                    Total:
                  </TableHead>
                  <TableHead className="font-bold">
                    {formatVnPrice(selectedOrder.total)}
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Right: Order Information Edit */}
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Order Information</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="orderCode"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Order Code
                </label>
                <Input
                  id="orderCode"
                  type="text"
                  placeholder="Order Code"
                  value={updateFormData.code}
                  disabled
                  className="border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="orderCode"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Discount COde
                </label>
                <Input
                  id="orderCode"
                  type="text"
                  placeholder="Discount Code"
                  value={selectedOrder.discount}
                  disabled
                  className="border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label
                  htmlFor="orderCode"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Notes
                </label>
                <Input
                  id="orderCode"
                  type="text"
                  placeholder="Notes"
                  value={selectedOrder.notes}
                  disabled
                  className="border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="orderCode"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Reason
                </label>
                <Input
                  id="orderCode"
                  type="text"
                  placeholder="Reason cancel order"
                  value={selectedOrder.reason}
                  disabled
                  className="border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={updateFormData.firstName}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      firstName: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.firstName ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={updateFormData.lastName}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      lastName: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.lastName ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Country
                </label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Country"
                  value={updateFormData.country}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      country: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.country ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.country && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.country}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Address
                </label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Address"
                  value={updateFormData.address}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      address: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.address ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.address && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="townCity"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Town/City
                </label>
                <Input
                  id="townCity"
                  type="text"
                  placeholder="Town/City"
                  value={updateFormData.townCity}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      townCity: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.townCity ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.townCity && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.townCity}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Phone"
                  value={updateFormData.phone}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      phone: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.phone ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={updateFormData.email}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      email: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.email ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.email && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Payment Method
                </label>
                <Input
                  id="paymentMethod"
                  type="text"
                  placeholder="Payment Method"
                  value={updateFormData.paymentMethod}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updateFormData,
                      paymentMethod: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.paymentMethod ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.paymentMethod && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.paymentMethod}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="deliveryStatus"
                  className="block mb-1 font-medium text-sm text-gray-700"
                >
                  Delivery Status
                </label>
                <Select
                  value={updateFormData.deliveryStatus}
                  onValueChange={(value) =>
                    setUpdateFormData({
                      ...updateFormData,
                      deliveryStatus: value as
                        | "PENDING"
                        | "PACKED"
                        | "SHIPPED"
                        | "IN_TRANSIT"
                        | "OUT_FOR_DELIVERY"
                        | "DELIVERED"
                        | "FAILED"
                        | "CANCELED"
                        | "RETURNED",
                    })
                  }
                >
                  <SelectTrigger
                    className={`border-gray-300 rounded-lg ${
                      formErrors.deliveryStatus ? "border-zinc-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Delivery Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryStatuses?.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.deliveryStatus && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.deliveryStatus}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                  className="border-gray-300 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSearch("")}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value);
              setPage(0);
            }}
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
            onValueChange={(value) => {
              setSize(Number(value));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[100px] border-gray-300 rounded-lg">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100, 200].map((sizeOption) => (
                <SelectItem key={sizeOption} value={sizeOption.toString()}>
                  {sizeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={refetchOrders}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <RefreshCw
              className={`h-4 w-4 ${ordersLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-auto max-h-[400px] mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stt</TableHead>

              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : ordersError ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-zinc-500">
                  Error: {ordersError.message}
                </TableCell>
              </TableRow>
            ) : ordersData?.contents.length ? (
              ordersData.contents.map((order: OrderAll, index: number) => (
                <TableRow key={order.code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{`${order.address}, ${order.townCity}, ${order.country}`}</TableCell>
                  <TableCell>{`${order.phone}, ${order.email}`}</TableCell>
                  <TableCell>{formatVnPrice(order.total)}</TableCell>
                  <TableCell
                    className={
                      getStatusClass(order.deliveryStatus) +
                      " px-3 py-1 rounded text-center font-semibold"
                    }
                  >
                    {order.deliveryStatus.replace(/_/g, " ")}
                  </TableCell>

                  <TableCell>{formatDateTime(order.createAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSelectOrder(order)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {ordersData && Number(ordersData.totalPages) > 1 && (
        <div className="flex justify-between items-center mb-6">
          <Button
            disabled={!ordersData.hasPrevious}
            onClick={() => setPage(page - 1)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {Number(ordersData.page) + 1} of{" "}
            {Number(ordersData.totalPages)} ({Number(ordersData.totalElements)}{" "}
            items)
          </span>
          <Button
            disabled={!ordersData.hasNext}
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

export default OrderPage;
