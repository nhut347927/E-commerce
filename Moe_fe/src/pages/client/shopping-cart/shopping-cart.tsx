import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, RefreshCcw } from "lucide-react";

// Placeholder image imports (replace with actual paths)
import cart1 from "../../../assets/img/shopping-cart/cart-1.jpg";
import cart2 from "../../../assets/img/shopping-cart/cart-2.jpg";
import cart3 from "../../../assets/img/shopping-cart/cart-3.jpg";
import cart4 from "../../../assets/img/shopping-cart/cart-4.jpg";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "T-shirt Contrast Pocket",
      price: 98.49,
      total: 30.0,
      quantity: 1,
      img: cart1,
    },
    {
      id: 2,
      name: "Diagonal Textured Cap",
      price: 98.49,
      total: 32.5,
      quantity: 1,
      img: cart2,
    },
    {
      id: 3,
      name: "Basic Flowing Scarf",
      price: 98.49,
      total: 47.0,
      quantity: 1,
      img: cart3,
    },
    {
      id: 4,
      name: "Basic Flowing Scarf",
      price: 98.49,
      total: 30.0,
      quantity: 1,
      img: cart4,
    },
  ]);

  const handleQuantityChange = (id: any, newQuantity: any) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, newQuantity),
              total: item.price * Math.max(1, newQuantity),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id: any) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e: any) => {
    e.preventDefault();
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <section>
      {/* Breadcrumb Section */}
      <div className="py-8 bg-gray-100 mb-20">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">Shopping Cart</h4>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <span className="text-sm cursor-pointer">Home</span>
              <span className="text-sm">/</span>
              <span className="text-sm cursor-pointer">Shop</span>
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
            <div className="grid grid-cols-5 gap-10 border-b border-gray-200 pb-6  text-black font-semibold text-base">
              <div className="uppercase col-span-2">Product</div>
              <div className="uppercase">Quantity</div>
              <div className="uppercase">Total</div>
            </div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 gap-10 py-8 border-b border-gray-200 items-center hover:bg-gray-50 transition duration-200"
              >
                <div className="col-span-2 flex items-center space-x-8">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="aspect-square w-24 object-cover"
                  />
                  <div>
                    <h6 className="text-sm font-medium text-gray-800">
                      {item.name}
                    </h6>
                    <h5 className="text-lg font-semibold text-gray-600">
                      ${item.price.toFixed(2)}
                    </h5>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    variant="ghost"
                    className="text-2xl font-bold text-gray-700 me-4"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-12 text-center border-none text-gray-700"
                  />
                  <Button
                    variant="ghost"
                     className="text-xl font-bold text-gray-700"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  ${item.total.toFixed(2)}
                </div>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0 bg-gray-200 hover:bg-gray-500"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <X className="h-12 w-12 stroke-[5]" />

                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-between flex-wrap mt-8">
            <Link to="/client/shop">
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
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Update Cart
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
            <h6 className="text-gray-800 uppercase mb-6">
              Cart Total
            </h6>
            <ul className="text-base text-gray-600 mb-8">
              <li className="flex justify-between mb-6">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </li>
            </ul>
            <Link to="/client/checkout">
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
