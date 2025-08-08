import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, RefreshCw, Edit, Trash2, Eraser } from "lucide-react";
import axiosInstance from "@/services/axios/axios-instance";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { formatDateTime } from "@/common/lib/utils";
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
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] =
    useState<boolean>(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string>("");
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

  // Fetch order items for a specific order
  const { data: orderItems, refetch: refetchOrderItems } = useGetApi<
    OrderItemAll[]
  >({
    endpoint: "/order/item/all",
    params: { code: selectedOrderCode },
    enabled: !!selectedOrderCode,
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
    if (!updateFormData.phone.match(/^\+[0-9]{1,3}[0-9]{9,10}$/)) {
      errors.phone = "Phone must be in format +[country][number]";
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
        setIsUpdateDialogOpen(false);
        setUpdateFormData({
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
          "An error occurred while updating order.",
        variant: "destructive",
      });
    }
  };

  const handleAddItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAddItemForm()) {
      toast({
        title: "Form Error",
        description: "Please select a product and valid quantity.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/order/item",
        addItemFormData
      );
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Order item added successfully.",
        });
        setIsAddItemDialogOpen(false);
        setAddItemFormData({ orderCode: "", productCode: "", quantity: 1 });
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

  const handleOpenUpdateDialog = (order: OrderAll) => {
    setUpdateFormData({
      code: order.code,
      firstName: order.firstName,
      lastName: order.lastName,
      country: order.country,
      address: order.address,
      townCity: order.townCity,
      phone: order.phone,
      email: order.email,
      paymentMethod: order.paymentMethod,
      deliveryStatus: order.deliveryStatus,
    });
    setIsUpdateDialogOpen(true);
  };

  const handleOpenAddItemDialog = (orderCode: string) => {
    setSelectedOrderCode(orderCode);
    setAddItemFormData({ ...addItemFormData, orderCode });
    setIsAddItemDialogOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Order Management
      </h2>

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
      <div className="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stt</TableHead>
              <TableHead>Order Code</TableHead>
              <TableHead>Customer</TableHead>
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
                <React.Fragment key={order.code}>
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.code}</TableCell>
                    <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                    <TableCell>{`${order.address}, ${order.townCity}, ${order.country}`}</TableCell>
                    <TableCell>{`${order.phone}, ${order.email}`}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.deliveryStatus}</TableCell>
                    <TableCell>{formatDateTime(order.createAt)}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenUpdateDialog(order)}
                        className="border-gray-300 text-gray-600 hover:text-zinc-500"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenAddItemDialog(order.code)}
                        className="border-gray-300 text-gray-600 hover:text-zinc-500"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {/* Order Items Sub-table */}
                  {selectedOrderCode === order.code && orderItems?.length ? (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Created At</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderItems.map((item, itemIndex) => (
                              <TableRow key={item.code}>
                                <TableCell>{itemIndex + 1}</TableCell>
                                <TableCell className="flex items-center space-x-2">
                                  <img
                                    src={item.image}
                                    alt={item.productName}
                                    className="h-8 w-8 object-cover"
                                  />
                                  <span>{item.productName}</span>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>
                                  {formatDateTime(item.createAt)}
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
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
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
        <div className="flex justify-between items-center mt-4">
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

      {/* Update Order Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Order Code"
                value={updateFormData.code}
                disabled
                className="border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <Input
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
              <Input
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
              <Input
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
              <Input
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
              <Input
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
              <Input
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
                <p className="text-zinc-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>
            <div>
              <Input
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
                <p className="text-zinc-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            <div>
              <Input
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
                className="border-gray-300 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Order Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Order Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItemSubmit} className="space-y-4">
            <div>
              <Select
                value={addItemFormData.productCode}
                onValueChange={(value) =>
                  setAddItemFormData({ ...addItemFormData, productCode: value })
                }
              >
                <SelectTrigger
                  className={`border-gray-300 rounded-lg ${
                    formErrors.productCode ? "border-zinc-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {productsData?.contents.map((product: ProductAllBasic) => (
                    <SelectItem key={product.code} value={product.code}>
                      {product.name} (${product.price.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.productCode && (
                <p className="text-zinc-500 text-xs mt-1">
                  {formErrors.productCode}
                </p>
              )}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Quantity"
                value={addItemFormData.quantity}
                onChange={(e) =>
                  setAddItemFormData({
                    ...addItemFormData,
                    quantity: Number(e.target.value),
                  })
                }
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.quantity ? "border-zinc-500" : ""
                }`}
                min="1"
              />
              {formErrors.quantity && (
                <p className="text-zinc-500 text-xs mt-1">
                  {formErrors.quantity}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddItemDialogOpen(false)}
                className="border-gray-300 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPage;
