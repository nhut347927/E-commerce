import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, RefreshCcw, RefreshCw } from "lucide-react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/axios-instance";
import { formatVnPrice } from "@/common/lib/utils";
import { ClientCartAllDto } from "../types";

const ShoppingCart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<ClientCartAllDto[]>([]);

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

  // Update quantity
  const handleQuantityChange = async (code: string, newQuantity: number) => {
    try {
      const response = await axiosInstance.put("/cart/update-quantity", {
        code,
        quantity: Math.max(1, newQuantity),
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Cart quantity updated",
        });
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.code === code
              ? {
                  ...item,
                  quantity: Math.max(1, newQuantity),
                }
              : item
          )
        );
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update quantity",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/cart/delete", {
        data: { code },
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Item removed from cart",
        });
        setCartItems((prevItems) => prevItems.filter((item) => item.code !== code));
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
    }
  };

  // Handle coupon application (placeholder)
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Info",
      description: "Coupon functionality not implemented yet",
    });
  };

  // Calculate subtotal
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <section>
      {/* Breadcrumb Section */}
      <div className="py-8 bg-gray-100 mb-20">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">Shopping Cart</h4>
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
              cartItems.map((item) => (
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
                      className="text-2xl font-bold text-gray-700 me-4"
                      onClick={() => handleQuantityChange(item.code, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.code, parseInt(e.target.value) || 1)
                      }
                      className="min-w-24 text-center border-none text-gray-700"
                      aria-label={`Quantity of ${item.name}`}
                    />
                    <Button
                      variant="ghost"
                      className="text-xl font-bold text-gray-700"
                      onClick={() => handleQuantityChange(item.code, item.quantity + 1)}
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
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <X className="h-12 w-12 stroke-[5]" />
                  </Button>
                </div>
              ))}
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
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Update Cart
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
            <form onSubmit={handleApplyCoupon} className="flex">
              <Input
                type="text"
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
              <li className="flex justify-between mb-6">
                <span>Subtotal</span>
                <span>{formatVnPrice(subtotal)}</span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Total</span>
                <span>{formatVnPrice(subtotal)}</span>
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