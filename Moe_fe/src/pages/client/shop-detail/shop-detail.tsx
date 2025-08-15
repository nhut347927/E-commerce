import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heart, RefreshCcw } from "lucide-react";
import ProductCard from "@/components/cl-home/product";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatVnPrice } from "@/common/lib/utils";
import { ClientProduct, ProductFilterParams } from "../types";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Page } from "@/common/hooks/type";
import axiosInstance from "@/services/axios/axios-instance";
import payment from "../../../assets/img/shop-details/details-payment.png";
const ShopDetail = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [activeTab, setActiveTab] = useState("0"); // Index for images
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [productList, setProductList] = useState<ClientProduct[]>([]);

  const [filters] = useState<ProductFilterParams>({
    page: 0,
    size: 6,
    sort: "desc",
  });

  const {
    data: product,
    loading,
    error,
  } = useGetApi<ClientProduct>({
    endpoint: "/product/client",
    params: { code },
    enabled: !!code,
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message || "Failed to load product",
        variant: "destructive",
      }),
  });

  const {
    loading: isLoading,
    error: productsError,
  } = useGetApi<Page<ClientProduct>>({
    endpoint: "/product/client/all",
    params: {
      q: filters.q,
      page: filters.page,
      size: filters.size,
      sort: filters.sort,
    },
    onSuccess: (res) => {
      if (res?.contents) {
        setProductList(res?.contents?.filter((p) => p.code !== code)); // Exclude current product
      }
    },
    enabled: true,
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message || "Failed to load related products",
        variant: "destructive",
      }),
  });

  // Get unique colors from colorOne, colorTwo, colorThree, and listVersion
  const getAvailableColors = () => {
    const colors = new Set<string>();
    if (product) {
      [product.colorOne, product.colorTwo, product.colorThree]
        .filter((color) => color)
        .forEach((color) => colors.add(color));
      product.listVersion?.forEach((version) => {
        if (version.color) colors.add(version.color);
      });
    }
    return Array.from(colors);
  };

  // Get unique sizes from listVersion
  const getAvailableSizes = () => {
    const sizes = new Set<string>();
    if (product) {
      product.listVersion?.forEach((version) => {
        if (version.size) sizes.add(version.size);
      });
    }
    return Array.from(sizes);
  };

  // Set default size and color on product load
  useEffect(() => {
    if (product) {
      const sizes = getAvailableSizes();
      const colors = getAvailableColors();
      setSelectedSize(sizes[0] || null);
      setSelectedColor(colors[0] || null);
      setActiveTab("0");
    }
  }, [product]);

  const toggleWishlist = async (
    productCode: string,
    isMainProduct: boolean = false
  ) => {
    try {
      const response = await axiosInstance.post("/wishlist/toggle", {
        code: productCode,
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: `Product ${
            response.data.data.liked ? "added to" : "removed from"
          } wishlist.`,
        });
        if (isMainProduct) {
          product?.liked && (product.liked = !product.liked);
        } else {
          setProductList((prev) =>
            prev.map((p) =>
              p.code === productCode ? { ...p, liked: !p.liked } : p
            )
          );
        }
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
          err.response?.data?.message || "Failed to toggle wishlist.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-12 mb-32">
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

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 flex flex-col mb-16">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-36 w-36 bg-gray-200 animate-pulse mb-6"
                  />
                ))}
              </div>
              <div className="md:col-span-9">
                <div className="h-[80vh] bg-gray-200 animate-pulse" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500">
              Failed to load product. Please try again.
            </div>
          )}

          {!loading && !error && product && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <ScrollArea className="max-h-[80vh] md:col-span-3 flex flex-col mb-16">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveTab(index.toString())}
                    className={`relative cursor-pointer overflow-hidden mb-6 border-2 ${
                      activeTab === index.toString()
                        ? "border-red-500"
                        : "border-gray-200"
                    } hover:border-red-500 transition-all duration-200`}
                  >
                    <img
                      src={`https://res.cloudinary.com/dazttnakn/image/upload/${image}`}
                      alt="thumbnail"
                      className="aspect-[4/5] w-36 object-cover mx-auto"
                    />
                  </div>
                ))}
              </ScrollArea>
              <div className="md:col-span-9">
                <div className="relative overflow-hidden">
                  <img
                    src={`https://res.cloudinary.com/dazttnakn/image/upload/${product.images[parseInt(activeTab)] || product.image}`}
                    alt={product.name}
                    className="max-h-[80vh] h-[80vh] object-cover mx-auto"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {loading && (
          <div className="w-full mx-auto max-w-2xl">
            <div className="h-8 bg-gray-200 animate-pulse mb-4" />
            <div className="h-4 bg-gray-200 animate-pulse mb-4" />
            <div className="h-10 bg-gray-200 animate-pulse mb-6" />
            <div className="h-20 bg-gray-200 animate-pulse mb-6" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500">
            Failed to load product details. Please try again.
          </div>
        )}

        {!loading && !error && product && (
          <div className="w-full mx-auto max-w-2xl">
            {/* Product Info */}
            <h1 className="text-3xl text-center font-bold text-zinc-900">
              {product.name}
            </h1>

            {/* Rating & Review */}
            <div className="flex justify-center items-center gap-2 mt-3">
              <div className="flex text-yellow-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(product.rating) ? "" : "text-zinc-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-zinc-500">
                {product.rating.toFixed(1)} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex justify-center gap-2 mt-4">
              <span className="text-3xl font-semibold text-zinc-900">
                $
                {product.isDiscount && product.discountPrice
                  ? formatVnPrice(product.discountPrice)
                  : formatVnPrice(product.price)}
              </span>
              {product.isDiscount && product.discountPrice && (
                <span className="text-sm text-zinc-400 line-through mt-3.5">
                  {formatVnPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-center text-zinc-600 text-sm mt-6 leading-relaxed">
              {product.shortDescription || "No description available."}
            </p>

            {/* Size Selector */}
            <div className="my-6 flex flex-col items-center">
              <h4 className="text-lg font-medium text-zinc-700 mb-6">Size:</h4>
              <RadioGroup
                value={selectedSize || ""}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-5 mt-2"
              >
                {getAvailableSizes().map((size) => (
                  <div key={size}>
                    <RadioGroupItem
                      value={size}
                      id={size}
                      className="sr-only"
                    />
                    <Button
                      variant="outline"
                      className={cn(
                        "text-base px-8 py-5 rounded-none text-zinc-700 border-zinc-300 hover:bg-zinc-900 hover:text-white transition",
                        selectedSize === size ? "bg-zinc-900 text-white" : ""
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
                value={selectedColor || ""}
                onValueChange={setSelectedColor}
                className="flex flex-wrap gap-5 mt-2"
              >
                {getAvailableColors().map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center mb-2"
                  >
                    <RadioGroupItem
                      value={color}
                      id={`color-${index}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`color-${index}`}
                      className="w-8 h-8 rounded-full cursor-pointer ring-zinc-300 ring-2 hover:ring-4 transition-all duration-200"
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
              <span
                className="flex items-center uppercase hover:text-red-500 cursor-pointer"
                onClick={() => toggleWishlist(product.code, true)}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    product.liked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {product.liked ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
              <span className="flex items-center uppercase hover:text-red-500 cursor-pointer">
                <RefreshCcw className="w-4 h-4 mr-2" /> Add to Compare
              </span>
            </div>

            {/* Safe Checkout */}
            <div className="mt-12 flex flex-col items-center">
              <h5 className="text-xl font-semibold text-zinc-800 mb-6">
                <span className="text-black">Guaranteed Safe Checkout</span>
              </h5>
              <img
                src={payment}
                alt="Payment Methods"
                className="mt-2 h-6 mb-10"
              />
              <ul className="text-center text-sm text-zinc-600 space-y-3">
                <li>
                  SKU: <strong>{product.code}</strong>
                </li>
                {/* <li>
                  Categories:{" "}
                  <strong>{product.categoryCode || "Clothes"}</strong>
                </li>
                <li>
                  Tags:{" "}
                  <strong>{product.tagCode || "Clothes, Skin, Body"}</strong>
                </li> */}
              </ul>
            </div>
          </div>
        )}

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
                Customer Reviews (
                {product?.rating ? Math.round(product.rating * 10) : 0})
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
                {product?.fullDescription ||
                  product?.shortDescription ||
                  "No description available."}
              </p>
              <div>
                <h5 className="text-lg font-semibold text-zinc-800">
                  Product Information
                </h5>
                <p className="mt-2">
                  {product?.shortDescription ||
                    "No additional information available."}
                </p>
              </div>
              <div>
                <h5 className="text-lg font-semibold text-zinc-800 mt-4">
                  Materials Used
                </h5>
                <p className="mt-2">
                  {product?.fullDescription?.includes("material")
                    ? product.fullDescription
                    : "Materials information not provided."}
                </p>
              </div>
            </TabsContent>

            <TabsContent
              value="reviews"
              className="mt-28 sm:mt-6 text-zinc-600 leading-relaxed"
            >
              <p>Customer reviews will be displayed here.</p>
            </TabsContent>

            <TabsContent
              value="info"
              className="mt-28 sm:mt-6 text-zinc-600 leading-relaxed"
            >
              <p>Additional product info will be displayed here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16">
        <h3 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Related Products
        </h3>
        <div className="flex flex-wrap">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-64 bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
          )}

          {productsError && (
            <div className="text-center text-red-500">
              Failed to load related products. Please try again.
            </div>
          )}

          {!isLoading && !productsError && productList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {productList.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.code}
                  code={relatedProduct.code}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  img={relatedProduct.image}
                  rating={relatedProduct.rating}
                  liked={relatedProduct.liked}
                  isDiscount={relatedProduct.isDiscount}
                  discountValue={relatedProduct.discountValue}
                  discountPrice={relatedProduct.discountPrice}
                  colorOne={relatedProduct.colorOne}
                  colorTwo={relatedProduct.colorTwo}
                  colorThree={relatedProduct.colorThree}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopDetail;
