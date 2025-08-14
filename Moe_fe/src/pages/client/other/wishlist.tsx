import ProductCard from "@/components/cl-home/product";

import { Page } from "@/common/hooks/type";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import {
  PaginationItem,
  PaginationLink,
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import axiosInstance from "@/services/axios/axios-instance";
import { useState } from "react";
import { ClientProduct, ProductFilterParams } from "../types";
const Wishlist = () => {
  const { toast } = useToast();
  const [productList, setProductList] = useState<ClientProduct[]>([]);

  const [filters, setFilters] = useState<ProductFilterParams>({
    q: "",
    page: 0,
    size: 12,
    sort: "desc",
  });

  const {
    data: products,
    loading: isLoading,
    error,
  } = useGetApi<Page<ClientProduct>>({
    endpoint: "/wishlist/all",
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Generate pagination links
  const renderPaginationLinks = () => {
    const totalPages = products?.totalPages || 1;
    const currentPage = products?.page || 0;
    const maxVisiblePages = 5;
    const pages: JSX.Element[] = [];

    let startPage = Math.max(
      0,
      Number(currentPage) - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      Number(totalPages) - 1,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  // const addToCart = async (code: string) => {
  //   try {
  //     const response = await axiosInstance.post("/cart/add", { code }); // bọc vào object
  //     if (response.data.code === 200) {
  //       toast({
  //         title: "Success",
  //         description: "Product added to cart successfully.",
  //       });
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: response.data.message,
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (err: any) {
  //     toast({
  //       title: "Error",
  //       description:
  //         err.response?.data?.message || "An error occurred while adding to cart.",
  //       variant: "destructive",
  //     });
  //   }
  // };

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
    <div>
      {/* Breadcrumb Section */}
      <section className="py-8 bg-gray-100 mb-20">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">Wishlist</h4>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <span className="text-sm cursor-pointer">Home</span>
              <span className="text-sm">/</span>
              <span className="text-sm text-gray-400">Wishlist</span>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-32">
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

        {/* Pagination */}
        {products && (
          <div className="flex justify-center mt-8 mb-24">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (products.hasPrevious)
                        handlePageChange(Number(products.page) - 1);
                    }}
                    className={
                      products.hasPrevious
                        ? ""
                        : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>
                {renderPaginationLinks()}
                {Number(products.totalPages) > 5 &&
                  Number(products.page) < Number(products.totalPages) - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (products.hasNext)
                        handlePageChange(Number(products.page) + 1);
                    }}
                    className={
                      products.hasNext ? "" : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
export default Wishlist;
