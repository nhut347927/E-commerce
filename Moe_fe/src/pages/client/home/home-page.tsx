import Carousel from "@/components/cl-home/carousel";
import Banner from "@/components/cl-home/banner";
import ProductCard from "@/components/cl-home/product";
import { useState } from "react";
import Categories from "@/components/cl-home/categories";
import Instagram from "@/components/cl-home/Instagram";
import Blog from "@/components/cl-home/blog";
import { Page } from "@/common/hooks/type";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import axiosInstance from "@/services/axios/axios-instance";
import { ClientProduct, ProductFilterParams } from "../types";

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const topic = ["New Arrivals"];
  const { toast } = useToast();
  const [productList, setProductList] = useState<ClientProduct[]>([]);

  const [filters] = useState<ProductFilterParams>({
    page: 0,
    size: 6,
    sort: "desc",
  });

  const {
    data: products,
    loading: isLoading,
    error,
  } = useGetApi<Page<ClientProduct>>({
    endpoint: "/product/client/all",
    params: {
      q: filters.q,
      page: filters.page,
      size: filters.size,
      sort: filters.sort,
      categoryCode: filters.categoryCode,
      brandCode: filters.brandCode,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sizeCode: filters.sizeCode,
      colorCode: filters.colorCode,
      tagCode: filters.tagCode,
    },
    onSuccess: (res) => {
      if (res?.contents) {
        setProductList(res.contents);
      }
    },
    enabled: true,
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message || "Failed to load products",
        variant: "destructive",
      }),
  });

  const toggleWishlist = async (code: string) => {
    try {
      const response = await axiosInstance.post("/wishlist/toggle", { code }); // bọc vào object
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product added to wishlist successfully.",
        });
        setProductList((prev) =>
          prev.map((p) => (p.code === code ? { ...p, liked: !p.liked } : p))
        );
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
          "An error occurred while toggle to wishlist.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-20">
      {/* Hero Section */}
      <Carousel />

      {/* Banner Section */}
      <Banner />

      {/* Product Section */}
      <section>
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 ">
          <div className="w-full mb-12">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4">
              {topic.map((filter, index) => (
                <li
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer px-4 py-2 text-xl whitespace-nowrap transition 
          ${
            activeIndex === index
              ? "text-gray-900 font-bold border-b-2 border-gray-900"
              : "text-gray-400 font-bold hover:text-gray-900"
          }`}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-64 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center text-red-500">
                Failed to load products. Please try again.
              </div>
            )}

            {!isLoading && !error && products?.contents && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {productList.map((product) => (
                  <ProductCard
                    key={product.code}
                    code={product.code}
                    name={product.name}
                    price={product.price}
                    img={product.image}
                    rating={product.rating}
                    liked={product.liked}
                    isDiscount={product.isDiscount}
                    discountValue={product.discountValue}
                    discountPrice={product.discountPrice}
                    colorOne={product.colorOne}
                    colorTwo={product.colorTwo}
                    colorThree={product.colorThree}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Instagram Section */}
      <Instagram />

      {/* Latest Blog Section */}
      <Blog />
    </div>
  );
};

export default HomePage;
