import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/axios-instance";
import { formatVnPrice } from "@/common/lib/utils";
import { ClientCartAllDto } from "../types";
import { DiscountAll } from "@/pages/dashboard/type";

const ShoppingCart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<ClientCartAllDto[]>([]);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState<DiscountAll | null>(null);

  // Fetch cart items
  const { data, loading, error, refetch } = useGetApi<ClientCartAllDto[]>({
    endpoint: "/cart/all",
    enabled: true,
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to load cart items",
        variant: "destructive",
      });
    },
  });

  // Sync cartItems with fetched data
  useEffect(() => {
    if (data) {
      setCartItems(data);
    }
  }, [data]);

  // Update quantity with locking
  const handleQuantityChange = async (code: string, newQuantity: number) => {
    if (updatingItems.has(code)) return; // Lock if already updating

    const safeQuantity = Math.max(1, newQuantity);

    // Lưu lại state cũ để rollback nếu lỗi (deep copy để an toàn)
    const prevItems = cartItems.map((item) => ({ ...item }));

    // Cập nhật UI ngay (optimistic update)
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.code === code ? { ...item, quantity: safeQuantity } : item
      )
    );

    // Khóa item đang cập nhật
    setUpdatingItems((prev) => new Set([...prev, code]));

    try {
      const response = await axiosInstance.put("/cart/update-quantity", {
        code,
        quantity: safeQuantity,
      });

      if (response.data.code !== 200) {
        // Rollback
        setCartItems(prevItems);
        toast({
          title: "Error",
          description: response.data.message || "Failed to update quantity",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      // Rollback
      setCartItems(prevItems);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      // Mở khóa
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(code);
        return newSet;
      });
    }
  };

  // Remove item from cart with locking
  const handleRemoveItem = async (code: string) => {
    if (updatingItems.has(code)) return; // Lock if already updating

    // Khóa item đang cập nhật
    setUpdatingItems((prev) => new Set([...prev, code]));

    try {
      const response = await axiosInstance.delete("/cart/delete", {
        data: { code },
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Item removed from cart",
        });
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.code !== code)
        );
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to remove item",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      // Mở khóa
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(code);
        return newSet;
      });
    }
  };

  // Handle coupon application
  const handleValidDiscount = async (code: string) => {
    try {
      const response = await axiosInstance.get("/discount/client/valid-discount", {
        params: { code }, // send discount code as query param
      });

      if (response.data.code === 200 && response.data.data) {
        const discount: DiscountAll = response.data.data;

        // Success: discount is valid
        toast({
          title: "Discount Applied",
          description: `Discount code "${discount.discountCode}" is valid. You saved ${discount.discountValue.toFixed(0)}%!`,
        });

        // Save discount to state
        setDiscount(discount);
      } else {
        toast({
          title: "Invalid Discount",
          description:
            response.data.message || "This discount code is not valid.",
          variant: "destructive",
        });

        // Reset applied discount
        setDiscount(null);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to validate discount",
        variant: "destructive",
      });

      // Reset applied discount
      setDiscount(null);
    }
  };

  // Calculate subtotal and discount
  const { subtotal, discountAmount, finalTotal } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = 0;
    let finalTotal = subtotal;

    if (discount) {
      // Tính số tiền giảm dựa trên discountValue (%)
      discountAmount = (subtotal * discount.discountValue) / 100;
      // Áp dụng giới hạn tối đa nếu có
      if (discount.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
      finalTotal = subtotal - discountAmount;
    }

    return { subtotal, discountAmount, finalTotal };
  }, [cartItems, discount]);

  return (
    <section>
      {/* Breadcrumb Section */}
      <div className="py-8 bg-gray-100 mb-20">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">
              Shopping Cart
            </h4>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <Link to="/home" className="text-sm cursor-pointer">
                Home
              </Link>
              <span className="text-sm">/</span>
              <Link to="/shop" className="text-sm cursor-pointer">
                Shop
              </Link>
              <span className="text-sm">/</span>
              <span className="text-sm text-gray-400">Shopping Cart</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 grid grid-cols-12 gap-4 mb-20">
        {/* Cart Items */}
        <div className="block sm:col-span-8">
          <div className="overflow-hidden">
            <div className="grid grid-cols-5 gap-10 border-b border-gray-200 pb-6 text-black font-semibold text-base">
              <div className="uppercase col-span-2">Product</div>
              <div className="uppercase">Quantity</div>
              <div className="uppercase">Total</div>
            </div>
            {loading && (
              <div className="py-8 text-center">Loading cart items...</div>
            )}
            {error && (
              <div className="py-8 text-center text-red-500">
                Failed to load cart items. Please try again.
              </div>
            )}
            {!loading && !error && cartItems.length === 0 && (
              <div className="py-8 text-center">Your cart is empty.</div>
            )}
            {!loading &&
              !error &&
              cartItems.map((item) => {
                const isUpdating = updatingItems.has(item.code);
                return (
                  <div
                    key={item.code}
                    className="grid grid-cols-5 gap-10 py-8 border-b border-gray-200 items-center hover:bg-gray-50 transition duration-200"
                  >
                    <div className="col-span-2 flex items-center space-x-8">
                      <img
                        src={`https://res.cloudinary.com/dazttnakn/image/upload/${item.image}`}
                        alt={item.name}
                        className="aspect-square w-24 object-cover rounded-md"
                      />
                      <div>
                        <h6 className="text-sm font-medium text-gray-800">
                          {item.name}
                        </h6>
                        <h5 className="text-lg font-semibold text-gray-600">
                          {formatVnPrice(item.price)}
                        </h5>
                        <div className="flex items-center space-x-2">
                          {/* Badge Size */}
                          <span className="px-2 py-0.5 text-xs font-medium rounded-sm bg-gray-100 text-gray-700 border border-gray-200">
                            {item.size}
                          </span>
                          {/* Badge Color */}
                          <span className="flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-sm bg-gray-100 text-gray-700 border border-gray-200">
                            <span
                              className="h-4 w-4 rounded-full mr-1 border"
                              style={{ backgroundColor: item.color }}
                            ></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <Button
                        variant="ghost"
                        className="text-2xl font-bold text-gray-700 me-2"
                        onClick={() =>
                          handleQuantityChange(item.code, item.quantity - 1)
                        }
                        disabled={isUpdating}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.code,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="min-w-24 text-center border-none text-gray-700"
                        disabled={isUpdating}
                        aria-label={`Quantity of ${item.name}`}
                      />
                      <Button
                        variant="ghost"
                        className="text-xl font-bold text-gray-700"
                        onClick={() =>
                          handleQuantityChange(item.code, item.quantity + 1)
                        }
                        disabled={isUpdating}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      {formatVnPrice(item.price * item.quantity)}
                    </div>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0 bg-gray-200 hover:bg-gray-500"
                      onClick={() => handleRemoveItem(item.code)}
                      disabled={isUpdating}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <X className="h-12 w-12 stroke-[5]" />
                    </Button>
                  </div>
                );
              })}
          </div>
          <div className="flex justify-between flex-wrap mt-8">
            <Link to="/shop">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-none text-black font-semibold text-sm uppercase"
              >
                Continue Shopping
              </Button>
            </Link>
            <Button
              variant="default"
              className="h-12 w-52 rounded-none text-white font-semibold text-sm uppercase"
              onClick={refetch}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />{" "}
              Update Cart
            </Button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="block sm:col-span-4">
          {/* Discount Code */}
          <div className="mb-12">
            <h6 className="text-black font-semibold text-base uppercase mb-6">
              Discount Codes
            </h6>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleValidDiscount(couponCode);
              }}
              className="flex"
            >
              <Input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="h-12 rounded-none border-gray-300 text-gray-700"
                aria-label="Enter coupon code"
              />
              <Button
                type="submit"
                className="h-12 w-32 uppercase bg-black hover:bg-black/70 text-white rounded-none px-4"
              >
                Apply
              </Button>
            </form>
          </div>

          {/* Cart Total */}
          <div className="bg-gray-100 p-8">
            <h6 className="text-gray-800 uppercase mb-6">Cart Total</h6>
            <ul className="text-base text-gray-600 mb-8">
              <li className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span>{formatVnPrice(subtotal)}</span>
              </li>
              <li className="flex justify-between mb-4">
                <span>Discount{discount ? ` (${discount.discountValue.toFixed(0)}%)` : ""}</span>
                <span>-{formatVnPrice(discountAmount)}</span>
              </li>
              <li className="flex justify-between text-gray-800 font-semibold">
                <span>Final Total</span>
                <span>{formatVnPrice(finalTotal)}</span>
              </li>
            </ul>
            <Link to="/check-out">
              <Button className="h-12 w-full uppercase bg-black hover:bg-black/70 text-white rounded-none">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;