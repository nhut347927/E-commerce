import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tag } from 'lucide-react';
import { useToast } from '@/common/hooks/use-toast';
import { title } from 'process';
import { Description } from '@radix-ui/react-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface FormData {
  firstName: string;
  lastName: string;
  country: string;
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  createAccount: boolean;
  accountPassword: string;
  orderNotes: boolean;
  notes: string;
  paymentMethod: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  country?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postcode?: string;
  phone?: string;
  email?: string;
  accountPassword?: string;
  notes?: string;
  paymentMethod?: string;
  couponCode?: string;
}

const CheckOut: React.FC = () => {
    const toast = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    country: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    email: '',
    createAccount: false,
    accountPassword: '',
    orderNotes: false,
    notes: '',
    paymentMethod: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [couponVisible, setCouponVisible] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    const requiredFields: (keyof FormData)[] = [
      'firstName',
      'lastName',
      'country',
      'streetAddress',
      'city',
      'state',
      'postcode',
      'phone',
      'email',
    ];


    if (formData.createAccount && !formData.accountPassword.trim()) {
      newErrors.accountPassword = 'This field cannot be empty';
    }

    if (formData.orderNotes && !formData.notes.trim()) {
      newErrors.notes = 'This field cannot be empty';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (name === 'paymentMethod' && errors.paymentMethod) {
      setErrors((prev) => ({ ...prev, paymentMethod: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
    //   toast({
    //     title: 'Order Placed',
    //     Description: 'Your order has been successfully submitted.',
    //   });
    } else {
    //   toast({
    //     title: 'Form Error',
    //     description: 'Please fill out all required fields.',
    //     variant: 'destructive',
    //   });
    }
  };

  const handleApplyCoupon = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (couponCode) {
    //   toast({
    //     title: 'Coupon Applied',
    //     description: `Coupon code "${couponCode}" applied successfully.`,
    //   });
      setCouponCode('');
    } else {
    //   toast({
    //     title: 'Coupon Error',
    //     description: 'Please enter a coupon code.',
    //     variant: 'destructive',
    //   });
    }
  };

  interface OrderItem {
    name: string;
    total: number;
  }

  const orderItems: OrderItem[] = [
    { name: 'Vanilla salted caramel', total: 300.0 },
    { name: 'German chocolate', total: 170.0 },
    { name: 'Sweet autumn', total: 170.0 },
    { name: 'Cluten free mini dozen', total: 110.0 },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Billing Details */}
          <div className="lg:col-span-8">
            
            <h6 className="text-black font-semibold text-base uppercase border-b-2 pb-6 mb-4">Billing Details</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className='space-y-3'>
                <Label className="text-sm text-gray-600">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.firstName ? 'border-red-500' : ''
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className='space-y-3'>
                <Label className="text-sm text-gray-600">
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.lastName ? 'border-red-500' : ''
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
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.country ? 'border-red-500' : ''
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
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                placeholder="Street Address"
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.streetAddress ? 'border-red-500' : ''
                }`}
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>
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
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.city ? 'border-red-500' : ''
                }`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
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
                className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                  errors.state ? 'border-red-500' : ''
                }`}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className='space-y-3'>
                <Label className="text-sm text-gray-600">
                  Phone<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className='space-y-3'>
                <Label className="text-sm text-gray-600">
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <Checkbox
                id="orderNotes"
                checked={formData.orderNotes}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange('orderNotes', checked)
                }
              />
              <Label htmlFor="orderNotes" className="text-sm text-gray-600">
                Note about your order, e.g., special note for delivery
              </Label>
            </div>
            {formData.orderNotes && (
              <div className="mt-6 space-y-3">
                <Label className="text-sm text-gray-600">
                  Order Notes<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notes about your order, e.g. special notes for delivery"
                  className={`h-12 mt-1 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                    errors.notes ? 'border-red-500' : ''
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
          <div className='bg-gray-100 p-8'>
              <h4 className="text-black font-semibold text-xl uppercase border-b-2 pb-6 mb-6">Your Order</h4>
            <div className="flex justify-between text-base  text-gray-800 mb-4">
              <span>Product</span>
              <span>Total</span>
            </div>
            <ul className="text-base text-gray-600 space-y-4">
              {orderItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{`0${index + 1}. ${item.name}`}</span>
                  <span>${item.total.toFixed(1)}</span>
                </li>
              ))}
            </ul>
            <ul className="text-base text-gray-600 space-y-2 mt-6 border-t pt-6">
              <li className="flex justify-between text-gray-800">
                <span>Subtotal</span>
                <span className='font-bold'>${subtotal.toFixed(2)}</span>
              </li>
              <li className="flex justify-between  text-gray-800">
                <span>Total</span>
                <span className='font-bold'>${subtotal.toFixed(2)}</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-600 leading-loose mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="checkPayment"
                  checked={formData.paymentMethod === 'check'}
                
                />
                <Label
                  htmlFor="checkPayment"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Check Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                 
                />
                <Label htmlFor="paypal" className="text-sm text-gray-700 cursor-pointer">
                  Paypal
                </Label>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 mt-8 bg-black hover:bg-black/70 text-white rounded-none uppercase"
            >
              Place Order
            </Button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;