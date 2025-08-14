import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";

import LoadingSpinner from "../components/common/loading-spinner-with-icon";
import NotFound from "@/components/common/not-found";
import ChangePassword from "@/pages/auth/change-password";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";
import Home from "@/pages/client/home/home-page";
import KeepAlive from "react-activation";

import Dashboard from "@/pages/dashboard/dashboard/dashboard-page";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ActivityLogPage from "@/pages/dashboard/log/activitylog-page";
import PermissionsPage from "@/pages/dashboard/permissions/permissions-page";
import UserPage from "@/pages/dashboard/user/user-page";
import Shop from "@/pages/client/shop/shop";
import ShopDetail from "@/pages/client/shop-detail/shop-detail";
import ShoppingCart from "@/pages/client/shopping-cart/shopping-cart";
import CheckOut from "@/pages/client/shopping-cart/check-out";
import About from "@/pages/client/other/about";
import Contact from "@/pages/client/other/contact";
import Blog from "@/pages/client/other/blog";
import BlogDetail from "@/pages/client/other/blog-detail";
import Wishlist from "@/pages/client/other/wishlist";
import ColorPage from "@/pages/dashboard/product/color";
import SizePage from "@/pages/dashboard/product/size";
import TagPage from "@/pages/dashboard/product/tag";
import BrandPage from "@/pages/dashboard/product/brand";
import CategoryPage from "@/pages/dashboard/product/category";
import BlogPage from "@/pages/dashboard/blog/blog-page";
import Product from "@/pages/dashboard/product/product";
import ProductDetail from "@/pages/dashboard/product/product-detail";
import DiscountPage from "@/pages/dashboard/discount/discount-page";
import OrderPage from "@/pages/dashboard/order/order-page";
import SettingPage from "@/pages/dashboard/setting/setting-page";
// Lazy load layouts
const ClientLayout = React.lazy(() => import("./client-layout"));
const AuthLayout = React.lazy(() => import("./auth-layout"));
const AdminLayout = React.lazy(() => import("./dashboard-layout"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* CLIENT ROUTES */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route
            path="home"
            element={
              <KeepAlive id="client-home">
                <Home />
              </KeepAlive>
            }
          />
          <Route
            path="shop"
            element={
              <KeepAlive id="client-shop">
                <Shop />
              </KeepAlive>
            }
          />
          <Route
            path="shop-detail"
            element={
              <KeepAlive id="client-shop-detail">
                <ShopDetail />
              </KeepAlive>
            }
          />
          <Route
            path="wishlist"
            element={
              <KeepAlive id="client-wishlist">
                <Wishlist />
              </KeepAlive>
            }
          />
          <Route
            path="shopping-cart"
            element={
              <KeepAlive id="client-shopping-cart">
                <ShoppingCart />
              </KeepAlive>
            }
          />
          <Route
            path="check-out"
            element={
              <KeepAlive id="client-check-out">
                <CheckOut />
              </KeepAlive>
            }
          />
          <Route
            path="about"
            element={
              <KeepAlive id="client-about">
                <About />
              </KeepAlive>
            }
          />
          <Route
            path="contact"
            element={
              <KeepAlive id="client-contact">
                <Contact />
              </KeepAlive>
            }
          />
          <Route
            path="blog"
            element={
              <KeepAlive id="client-blog">
                <Blog />
              </KeepAlive>
            }
          />
          <Route
            path="blog-detail"
            element={
              <KeepAlive id="client-blog-detail">
                <BlogDetail />
              </KeepAlive>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="home"
            element={
              <KeepAlive id="home">
                <Dashboard />
              </KeepAlive>
            }
          />
          <Route
            path="activity-log"
            element={
              <KeepAlive id="activity-log">
                <ActivityLogPage />
              </KeepAlive>
            }
          />
          <Route path="permissions" element={<PermissionsPage />} />

          <Route
            path="user"
            element={
              <KeepAlive id="user">
                <UserPage />
              </KeepAlive>
            }
          />
          <Route
            path="product/color"
            element={
              <KeepAlive id="color">
                <ColorPage />
              </KeepAlive>
            }
          />
          <Route
            path="product/size"
            element={
              <KeepAlive id="size">
                <SizePage />
              </KeepAlive>
            }
          />
          <Route
            path="product/tag"
            element={
              <KeepAlive id="tag">
                <TagPage />
              </KeepAlive>
            }
          />
          <Route
            path="product/brand"
            element={
              <KeepAlive id="brand">
                <BrandPage />
              </KeepAlive>
            }
          />
          <Route
            path="product/category"
            element={
              <KeepAlive id="category">
                <CategoryPage />
              </KeepAlive>
            }
          />
          <Route
            path="product/all"
            element={
              <KeepAlive id="productall">
                <Product />
              </KeepAlive>
            }
          />
          <Route path="product/detail" element={<ProductDetail />} />
          <Route
            path="blog"
            element={
              <KeepAlive id="blog">
                <BlogPage />
              </KeepAlive>
            }
          />

          <Route path="product/detail" element={<ProductDetail />} />
          <Route
            path="discount"
            element={
              <KeepAlive id="discount">
                <DiscountPage />
              </KeepAlive>
            }
          />

          <Route
            path="order"
            element={
              <KeepAlive id="order">
                <OrderPage />
              </KeepAlive>
            }
          />
          <Route
            path="setting"
            element={
              <KeepAlive id="setting">
                <SettingPage />
              </KeepAlive>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* REDIRECT & NOT FOUND */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
