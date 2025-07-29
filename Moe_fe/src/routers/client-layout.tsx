import { Toaster } from "@/components/ui/toaster";
import { Link, Outlet } from "react-router-dom";
import iconSearch from "../assets/img/icon/search.png";
import iconHeart from "../assets/img/icon/heart.png";
import iconCart from "../assets/img/icon/cart.png";
import logo from "../assets/img/logo.png";
import ftLogo from "../assets/img/footer-logo.png";
import payment from "../assets/img/payment.png";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
const ClientLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <ScrollArea className="max-h-screen h-screen bg-white">
      {/* Header MOBILE */}
      <header className="block sm:hidden">
        <div className="flex justify-between items-center p-2 my-4">
          <img src={logo} alt="logo" className="h-6" />
          <Button
            onClick={() => toggle()}
            variant="outline"
            className="me-4 h-10 w-10"
          >
            <Menu />
          </Button>
          {isOpen && (
            <div
              onClick={toggle}
              className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
            >
              {/* Sidebar menu */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-80 h-screen bg-white p-6 shadow-lg transform transition-transform duration-300 translate-x-0"
              >
                <div className="w-full flex justify-center space-x-6 ">
                  <div className="flex space-x-4">
                    <span className="cursor-pointer hover:text-white uppercase">
                      Sign in
                    </span>
                    <span className="cursor-pointer hover:text-white uppercase">
                      FAQs
                    </span>
                  </div>
                  <div className="relative group cursor-pointer">
                    <span className="flex items-center uppercase">
                      USD <i className="ml-1">↓</i>
                    </span>
                    <ul className="absolute right-0 mt-2 w-24 bg-white text-black shadow-md hidden group-hover:block z-10">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer uppercase">
                        USD
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer uppercase">
                        EUR
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-center mt-6 space-x-6">
                  <img
                    src={iconSearch}
                    alt="search"
                    className=" h-4 cursor-pointer"
                  />
                  <img
                    src={iconHeart}
                    alt="heart"
                    className=" h-4 cursor-pointer"
                  />
                  <div className="relative cursor-pointer">
                    <img src={iconCart} alt="cart" className=" h-4" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-5 flex items-center justify-center">
                      0
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm">$0.00</div>
                </div>

                {/* Menu */}
                <div className="mt-6">
                  <nav>
                    <ul className="space-y-4 text-gray-700 text-base font-medium">
                      <li className="cursor-pointer hover:text-black border-b-2 border-red-500">
                        Home
                      </li>
                      <li className="cursor-pointer hover:text-black">Shop</li>
                      <li className="relative group cursor-pointer">
                        <span className="hover:text-black">Pages</span>
                        <ul className="absolute left-0 mt-2 w-40 bg-white shadow-md hidden group-hover:block text-sm text-gray-700 z-10">
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            About Us
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Shop Details
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Shopping Cart
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Check Out
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Blog Details
                          </li>
                        </ul>
                      </li>
                      <li className="cursor-pointer hover:text-black">Blog</li>
                      <li className="cursor-pointer hover:text-black">
                        Contacts
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="w-full mt-10">
                  <p>Free shipping, 30-day return or refund guarantee.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Header Section */}
      <header className="hidden sm:block">
        {/* Top bar */}
        <div className="bg-black py-3 text-sm text-zinc-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-16">
            <div className="w-full">
              <p>Free shipping, 30-day return or refund guarantee.</p>
            </div>
            <div className="w-full flex justify-end space-x-6">
              <div className="flex space-x-4">
                <span className="cursor-pointer hover:text-white uppercase">Sign in</span>
                <span className="cursor-pointer hover:text-white uppercase">FAQs</span>
              </div>
              <div className="relative group cursor-pointer text-gray-300">
                <span className="flex items-center uppercase">
                  USD <i className="ml-1">↓</i>
                </span>
                <ul className="absolute right-0 mt-2 w-24 bg-white text-black shadow-md hidden group-hover:block z-10">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer uppercase">
                    USD
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer uppercase">
                    EUR
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-16 py-8">
          <div className="flex flex-wrap items-center justify-between">
            {/* Logo */}
            <div className="justify-start">
              <img src={logo} alt="logo" className="h-6" />
            </div>

            {/* Menu */}
            <div className="w-1/2 mt-0">
              <nav>
                <ul className="flex  justify-center space-x-10 text-gray-700 text-lg font-medium">
                 <Link to="/client/home">
                  <li className="cursor-pointer hover:text-black border-b-2 border-red-500">
                    Home
                  </li></Link>
                 <Link to="/client/shop">
                  <li className="cursor-pointer hover:text-black">Shop</li>
                 </Link>
                  <li className="relative group cursor-pointer">
                    <span className="hover:text-black">Pages</span>
                    <ul className="absolute left-0 mt-2 w-40 bg-white shadow-md hidden group-hover:block text-sm text-gray-700 z-10">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        About Us
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Shop Details
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Shopping Cart
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Check Out
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Blog Details
                      </li>
                    </ul>
                  </li>
                  <li className="cursor-pointer hover:text-black">Blog</li>
                  <li className="cursor-pointer hover:text-black">Contacts</li>
                </ul>
              </nav>
            </div>

            {/* Icons */}
            <div className="w-1/4 flex justify-end mt-0 space-x-6">
              <img
                src={iconSearch}
                alt="search"
                className=" h-5 cursor-pointer"
              />
              <img
                src={iconHeart}
                alt="heart"
                className=" h-5 cursor-pointer"
              />
              <div className="relative cursor-pointer">
                <img src={iconCart} alt="cart" className=" h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
              <div className="text-gray-700 text-base">$0.00</div>
            </div>
          </div>
        </div>
      </header>

      <Toaster />
      <Outlet />

      {/* Footer Section */}
      <footer className="bg-black py-16 text-white">
        <div className="max-w-7xl w-full  mx-auto px-3 sm:px-16">
          <div className="flex flex-wrap justify-between">
            <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
              <div>
                <div className="mt-1">
                  <img src={ftLogo} alt="" className="h-6" />
                </div>
                <p className="text-sm text-zinc-400 space-y-3 mt-6 mb-6">
                  The customer is at the heart of our unique business model,
                  which includes design.
                </p>
                <img src={payment} alt="payment" className="w-32" />
              </div>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/5 mb-8">
              <div>
                <h6 className="text-lg font-bold uppercase">Shopping</h6>
                <ul className="text-sm text-zinc-400 space-y-3 mt-6">
                  <li>Clothing Store</li>
                  <li>Trending Shoes</li>
                  <li>Accessories</li>
                  <li>Sale</li>
                </ul>
              </div>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/5 mb-8">
              <div>
                <h6 className="text-lg font-bold uppercase">Support</h6>
                <ul className="text-sm text-zinc-400 space-y-3 mt-6">
                  <li>Contact Us</li>
                  <li>Payment Methods</li>
                  <li>Delivery</li>
                  <li>Return & Exchanges</li>
                </ul>
              </div>
            </div>

            <div className="w-full sm:w-1/2 lg:w-1/4 mb-8">
              <div>
                <h6 className="text-lg font-bold uppercase">Newsletter</h6>
                <p className="text-sm text-zinc-400 space-y-3 mt-6">
                  Be the first to know about new arrivals, look books, sales &
                  promos!
                </p>
                <div className="flex mt-4">
                  <input
                    type="text"
                    placeholder="Your email"
                    className="p-2 text-black"
                  />
                  <button className="bg-white text-black p-2">📧</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-full text-center">
              <p className="mt-8">
                © {new Date().getFullYear()} All rights reserved | This template
                was made with ❤️ by Colorlib and modified with Tailwind CSS by
                nhut379
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Search Model */}
      <div className="search-model fixed inset-0 bg-black bg-opacity-50 hidden z-50">
        <div className="h-full flex items-center justify-center">
          <div className="search-close-switch text-white text-2xl">✕</div>
          <div className="search-model-form">
            <input
              type="text"
              id="search-input"
              placeholder="Search here....."
              className="border p-2 w-96"
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ClientLayout;
