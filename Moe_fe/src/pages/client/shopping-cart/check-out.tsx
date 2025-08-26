import React, { useState, useEffect, useMemo, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/common/hooks/use-toast";
import { useGetApi } from "@/common/hooks/use-get-api";
import axiosInstance from "@/services/axios/axios-instance";
import { ClientCartAllDto } from "../types";
import { formatVnPrice } from "@/common/lib/utils";

interface DiscountAll {
  discountCode: string;
  discountValue: number;
  maxDiscount: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  notes: string;
  orderNotes: boolean;
  discountCode: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

const CheckOut: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("discountCode");
  const [discount, setDiscount] = useState<DiscountAll | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    notes: "",
    orderNotes: false,
    discountCode: code || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: cartItems = [], loading } = useGetApi<ClientCartAllDto[]>({
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

  useEffect(() => {
    if (code) {
      const handleValidDiscount = async () => {
        try {
          const response = await axiosInstance.get(
            "/discount/client/valid-discount",
            {
              params: { code },
            }
          );

          if (response.data.code === 200 && response.data.data) {
            const discount: DiscountAll = response.data.data;
            toast({
              title: "Discount Applied",
              description: `Discount code "${
                discount.discountCode
              }" is valid. You saved ${discount.discountValue.toFixed(0)}%!`,
            });
            setDiscount(discount);
          } else {
            toast({
              title: "Invalid Discount",
              description:
                response.data.message || "This discount code is not valid.",
              variant: "destructive",
            });
            setDiscount(null);
          }
        } catch (err: any) {
          toast({
            title: "Error",
            description:
              err.response?.data?.message || "Failed to validate discount",
            variant: "destructive",
          });
          setDiscount(null);
        }
      };
      handleValidDiscount();
    }
  }, [code, toast]);

  // Calculate subtotal, discount, and final total
  const { subtotal, discountAmount, finalTotal } = useMemo(() => {
    const subtotal = cartItems?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let discountAmount = 0;
    let finalTotal = subtotal;

    if (discount) {
      discountAmount = (Number(subtotal) * discount.discountValue) / 100;
      if (discount.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
      finalTotal = Number(subtotal) - discountAmount;
    }

    return { subtotal, discountAmount, finalTotal };
  }, [cartItems, discount]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
    if (field === "orderNotes" && !checked) {
      setFormData((prev) => ({ ...prev, notes: "" }));
      setErrors((prev) => ({ ...prev, notes: "" }));
    }
  };

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.firstName)
      newErrors.firstName = "First name must not be blank";
    if (!formData.lastName) newErrors.lastName = "Last name must not be blank";
    if (!formData.country) newErrors.country = "Country must not be blank";
    if (!formData.address) newErrors.address = "Address must not be blank";
    if (!formData.city) newErrors.city = "City must not be blank";
    if (!formData.state) newErrors.state = "State must not be blank";
    if (!formData.phone) {
      newErrors.phone = "Phone must not be blank";
    } else if (!/^(\+84|0)\d{9,10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    if (!formData.email) {
      newErrors.email = "Email must not be blank";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (formData.orderNotes && !formData.notes) {
      newErrors.notes = "Order notes must not be blank if enabled";
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        discountCode: formData.discountCode,
      };

      const response = await axiosInstance.post("/payment/create", orderData);
      if (response.data.code === 200) {
        console.log("Order placed successfully:", response.data.data);
        window.location.href = response.data.data.paymentUrl; // chuyển hẳn sang VNPAY
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while placing the order.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {/* Breadcrumb Section */}
      <div className="py-8 bg-gray-100 mb-32">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">Check Out</h4>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <span className="text-sm cursor-pointer">Home</span>
              <span className="text-sm">/</span>
              <span className="text-sm cursor-pointer">Shop</span>
              <span className="text-sm">/</span>
              <span className="text-sm text-gray-400">Check Out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-20">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Billing Details */}
          <div className="lg:col-span-8">
            <h6 className="text-black font-semibold text-base uppercase border-b-2 pb-6 mb-4">
              Billing Details
            </h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-sm text-gray-600">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-sm text-gray-600">
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Label className="text-sm text-gray-600">
                Country<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter your country"
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.country ? "border-red-500" : ""
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>
            <div className="mt-6 space-y-3">
              <Label className="text-sm text-gray-600">
                Address<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your street address"
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div className="mt-6 space-y-3">
              <Label className="text-sm text-gray-600">
                Town/City<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.city ? "border-red-500" : ""
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div className="mt-6 space-y-3">
              <Label className="text-sm text-gray-600">
                Country/State<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state or region"
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.state ? "border-red-500" : ""
                }`}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="space-y-3">
                <Label className="text-sm text-gray-600">
                  Phone<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number (e.g. +84912345678)"
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-sm text-gray-600">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <Checkbox
                id="orderNotes"
                checked={formData.orderNotes}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange("orderNotes", checked)
                }
              />
              <Label htmlFor="orderNotes" className="text-sm text-gray-600">
                Note about your order, e.g., special note for delivery
              </Label>
            </div>
            {formData.orderNotes && (
              <div className="mt-6 space-y-3">
                <Label className="text-sm text-gray-600">Order Notes</Label>
                <Input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter notes about your order"
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.notes ? "border-red-500" : ""
                  }`}
                />
                {errors.notes && (
                  <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 h-auto">
            <div className="bg-gray-100 p-8">
              <h4 className="text-black font-semibold text-xl uppercase border-b-2 pb-6 mb-6">
                Your Order
              </h4>
              <div className="flex justify-between text-base text-gray-800 mb-4">
                <span>Product</span>
                <span>Total</span>
              </div>
              <ul className="text-base text-gray-600 space-y-4">
                {cartItems?.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{`0${index + 1}. ${item.name} x${
                      item.quantity
                    }`}</span>
                    <span>{formatVnPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <ul className="text-base text-gray-600 space-y-2 mt-6 border-t pt-6">
                <li className="flex justify-between text-gray-800">
                  <span>Subtotal</span>
                  <span className="font-bold">
                    {formatVnPrice(Number(subtotal))}
                  </span>
                </li>
                {discount && (
                  <li className="flex justify-between text-gray-800">
                    <span>Discount</span>
                    <span className="font-bold">
                      -{formatVnPrice(discountAmount)}
                    </span>
                  </li>
                )}
                <li className="flex justify-between text-gray-800">
                  <span>Shipping fee</span>
                  <span className="font-bold">+{formatVnPrice(30000)}</span>
                </li>
                <li className="flex justify-between text-gray-800">
                  <span>Total</span>
                  <span className="font-bold">
                    {formatVnPrice(Number(finalTotal) + 30000)}
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-sm text-gray-600 leading-loose mb-6">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our privacy policy.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="vnpayCheckbox"
                  type="checkbox"
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  defaultChecked
                />
                <label
                  htmlFor="vnpayCheckbox"
                  className="text-gray-700 text-sm select-none"
                >
                  Pay with VNPAY
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 mt-8 bg-black hover:bg-black/70 text-white rounded-none uppercase"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;
