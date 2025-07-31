import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heart, RefreshCcw, Play } from "lucide-react";

// Placeholder image imports (replace with actual paths)
import thumb1 from "../../../assets/img/shop-details/thumb-1.png";
import thumb2 from "../../../assets/img/shop-details/thumb-2.png";
import thumb3 from "../../../assets/img/shop-details/thumb-3.png";
import thumb4 from "../../../assets/img/shop-details/thumb-4.png";
import productBig1 from "../../../assets/img/shop-details/product-big-2.png";
import productBig2 from "../../../assets/img/shop-details/product-big-3.png";
import productBig3 from "../../../assets/img/shop-details/product-big.png";
import productBig4 from "../../../assets/img/shop-details/product-big-4.png";
import product1 from "../../../assets/img/product/product-1.jpg";
import product2 from "../../../assets/img/product/product-2.jpg";
import product3 from "../../../assets/img/product/product-3.jpg";
import product4 from "../../../assets/img/product/product-4.jpg";
import iconHeart from "../../../assets/img/icon/heart.png";
import iconCompare from "../../../assets/img/icon/compare.png";
import iconSearch from "../../../assets/img/icon/search.png";
import payment from "../../../assets/img/shop-details/details-payment.png";
import ProductCard from "@/components/cl-home/product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/common/lib/utils";

const ShopDetail = () => {
  const [activeTab, setActiveTab] = useState("tabs-1");
  const [quantity, setQuantity] = useState(1);

  const images = [
    { id: "tabs-1", thumb: thumb1, main: productBig1 },
    { id: "tabs-3", thumb: thumb3, main: productBig3 },
    { id: "tabs-3", thumb: thumb3, main: productBig3 },
    { id: "tabs-2", thumb: thumb2, main: productBig2 },
    { id: "tabs-3", thumb: thumb3, main: productBig3 },
  ];

  const colors = [
    "#FF0000",
    "#0000FF",
    "#808080",
    "#FFA500",
    "#008000",
    "#FFC0CB",
    "#800080",
    "#FFFF00",
    "#A52A2A",
  ];

  const relatedProducts = [
    {
      id: 1,
      name: "Piqué Biker Jacket",
      price: 67.24,
      img: product1,
      rating: 0,
      label: "New",
    },
    {
      id: 2,
      name: "Piqué Biker Jacket",
      price: 67.24,
      img: product2,
      rating: 0,
      label: "",
    },
    {
      id: 3,
      name: "Multi-pocket Chest Bag",
      price: 43.48,
      img: product3,
      rating: 4,
      label: "Sale",
    },
    {
      id: 4,
      name: "Diagonal Textured Cap",
      price: 60.9,
      img: product4,
      rating: 0,
      label: "",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Shop Details Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl min-h-[80vh] w-full mx-auto px-3 sm:px-16">
          {/* Breadcrumb */}
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <Link to="/home" className="text-sm cursor-pointer">
                Home
              </Link>
              <span className="text-sm cursor-pointer">/</span>
              <Link to="/shop" className="text-sm cursor-pointer">
                Shop
              </Link>
              <span className="text-sm cursor-pointer">/</span>
              <span className="text-sm cursor-pointer text-gray-400">
                Product Details
              </span>
            </div>
          </div>

          {/* Product Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <ScrollArea className="max-h-[80vh] md:col-span-3 flex flex-col mb-16">
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setActiveTab(image.id)}
                  className={`relative cursor-pointer overflow-hidden mb-6 border-2 ${
                    activeTab === image.id
                      ? "border-red-500"
                      : "border-gray-200"
                  } hover:border-red-500 transition-all duration-200`}
                >
                  <img
                    src={image.thumb}
                    alt="thumbnail"
                    className="aspect-[4/5] w-36 object-cover mx-auto"
                  />
                </div>
              ))}
            </ScrollArea>
            <div className="md:col-span-9">
              <div className="relative overflow-hidden">
                <img
                  src={images.find((img) => img.id === activeTab)?.main}
                  alt="product"
                  className="max-h-[80vh] h-[80vh] object-cover mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Product Info */}
        <div className="w-full mx-auto max-w-2xl">
          <h1 className="text-3xl text-center font-bold text-zinc-900">
            Hooded Thermal Anorak
          </h1>

          {/* Rating & Review */}
          <div className="flex justify-center items-center gap-2 mt-3">
            <div className="flex text-yellow-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < 4 ? "" : "text-zinc-300"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-zinc-500">5 Reviews</span>
          </div>

          {/* Price */}
          <div className="flex justify-center gap-2 mt-4">
            <span className="text-3xl font-semibold text-zinc-900">
              $270.00
            </span>
            <span className="text-sm text-zinc-400 line-through mt-3.5">
              $70.00
            </span>
          </div>

          {/* Description */}
          <p className="text-center text-zinc-600 text-sm mt-6 leading-relaxed">
            Coat with quilted lining and an adjustable hood. Featuring long
            sleeves with adjustable cuff tabs, adjustable asymmetric hem with
            elastic side tabs and a front zip fastening with placket.
          </p>

          {/* Size Selector */}
          <div className="my-6 flex flex-col items-center">
            <h4 className="text-lg font-medium text-zinc-700 mb-6">Size:</h4>
            <RadioGroup defaultValue="xl" className="flex flex-wrap gap-5 mt-2">
              {["XXL", "XL", "L", "S"].map((size) => (
                <div key={size}>
                  <RadioGroupItem value={size} id={size} className="sr-only" />
                  <Button
                    key={size}
                    variant="outline"
                    className={cn(
                      "text-base px-8 py-5 rounded-none text-zinc-700 border-zinc-300 hover:bg-zinc-900 hover:text-white transition",
                      size === "XL" ? "bg-zinc-900 text-white" : ""
                    )}
                  >
                    {size}
                  </Button>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Color Selector */}
          <div className="my-6 flex flex-col items-center">
            <h4 className="text-lg font-medium text-zinc-700 mb-6">Color:</h4>
            <RadioGroup
              defaultValue="sp-1"
              className="flex flex-wrap gap-5 mt-2"
            >
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center mb-2"
                >
                  <RadioGroupItem
                    value={`c-${index}`}
                    id={`sp-${index}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`sp-${index}`}
                    className="w-8 h-8 rounded-full cursor-pointer ring-zinc-300 hover:ring-4 transition-all duration-200"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="my-16 flex justify-center items-center gap-4">
            <div className="h-16 flex items-center border border-zinc-300 rounded-none overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-zinc-700 rounded-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-zinc-700 rounded-none"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button className="h-16 w-44 bg-black hover:bg-black/70 text-white px-6 rounded-none">
              Add to Cart
            </Button>
          </div>

          {/* Wishlist & Compare */}
          <div className="flex justify-center gap-6 mt-6 text-sm text-zinc-600">
            <span className="flex items-center uppercase hover:text-red-500 cursor-pointer">
              <Heart className="w-4 h-4 mr-2" /> Add to Wishlist
            </span>
            <span className="flex items-center uppercase hover:text-red-500 cursor-pointer">
              <RefreshCcw className="w-4 h-4 mr-2" /> Add to Compare
            </span>
          </div>

          {/* Safe Checkout */}
          <div className="mt-12 flex flex-col items-center ">
            <h5 className="text-xl font-semibold text-zinc-800 mb-6">
              <span className="text-black">Guaranteed Safe Checkout</span>
            </h5>
            <img
              src={payment}
              alt="Payment Methods"
              className="mt-2 h-6 mb-10"
            />
            <ul className="text-center text-sm text-zinc-600  space-y-3">
              <li>
                SKU: <strong>3812912</strong>
              </li>
              <li>
                Categories: <strong>Clothes</strong>
              </li>
              <li>
                Tags: <strong>Clothes, Skin, Body</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 min-h-96">
          <Tabs defaultValue="desc" className="w-full">
            <TabsList className="flex flex-wrap justify-center border-b border-zinc-200 bg-transparent">
              <TabsTrigger
                value="desc"
                className="rounded-none text-xl font-medium text-zinc-300 data-[state=active]:text-zinc-400 data-[state=active]:border-b-2 data-[state=active]:border-red-500 px-4 pb-2"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none text-xl font-medium text-zinc-300 data-[state=active]:text-zinc-400 data-[state=active]:border-b-2 data-[state=active]:border-red-500 px-4 pb-2"
              >
                Customer Previews (5)
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="rounded-none text-xl font-medium text-zinc-300 data-[state=active]:text-zinc-400 data-[state=active]:border-b-2 data-[state=active]:border-red-500 px-4 pb-2"
              >
                Additional Info
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="desc"
              className="mt-28 sm:mt-6 text-zinc-600 leading-relaxed space-y-4"
            >
              <p>
                Nam tempus turpis at metus scelerisque placerat nulla deumantos
                solicitud felis. Pellentesque diam dolor, elementum etos
                lobortis des mollis ut risus.
              </p>
              <div>
                <h5 className="text-lg font-semibold text-zinc-800">
                  Product Information
                </h5>
                <p className="mt-2">
                  A Pocket PC is a handheld computer, featuring email, contact,
                  appointments, internet, messaging and more with touchscreen
                  support.
                </p>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-zinc-800 mt-4">
                  Materials Used
                </h5>
                <p className="mt-2">
                  Polyester is synthetic and non-breathable. Velvet offers
                  luxurious texture and year-round wearability.
                </p>
              </div>
            </TabsContent>

            <TabsContent
              value="reviews"
              className="mt-28 sm:mt-6 text-zinc-600 leading-relaxed"
            >
              <p>Reviews will go here.</p>
            </TabsContent>

            <TabsContent
              value="info"
              className="mt-28 sm:mt-6 text-zinc-600 leading-relaxed"
            >
              <p>Additional product info will go here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 ">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Related Products
        </h3>
        <div className="flex flex-wrap mb-20">
          {[
            {
              name: "Piqué Biker Jacket",
              price: 67.24,
              img: product1,
              label: "New",
              category: "new-arrivals",
              rating: 0,
            },
            {
              name: "Piqué Biker Jacket",
              price: 67.24,
              img: product2,
              category: "hot-sales",
              rating: 0,
            },
            {
              name: "Multi-pocket Chest Bag",
              price: 43.48,
              img: product3,
              label: "Sale",
              category: "new-arrivals",
              rating: 4,
            },
            {
              name: "Diagonal Textured Cap",
              price: 60.9,
              img: product4,
              category: "hot-sales",
              rating: 0,
            },
            {
              name: "Multi-pocket Chest Bag",
              price: 43.48,
              img: product3,
              label: "Sale",
              category: "new-arrivals",
              rating: 4,
            },
            {
              name: "Diagonal Textured Cap",
              price: 60.9,
              img: product4,
              category: "hot-sales",
              rating: 0,
            },
          ].map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price}
              img={product.img}
              label={product.label}
              rating={product.rating}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShopDetail;
