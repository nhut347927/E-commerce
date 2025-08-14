import React, { useState } from "react";
import calendarIcon from "../../../assets/img/icon/calendar.png";
// Placeholder image imports (replace with actual paths)
import breadcrumbBg from "../../../assets/img/breadcrumb-bg.jpg";
import { Page } from "@/common/hooks/type";
import { useGetApi } from "@/common/hooks/use-get-api";
import { toast } from "@/common/hooks/use-toast";
import { BlogAll } from "@/pages/dashboard/type";
import { formatDateTime } from "@/common/lib/utils";
import { ProductFilterParams } from "../types";
import {
  PaginationItem,
  PaginationLink,
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";

const Blog: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilterParams>({
    q: "",
    page: 0,
    size: 12,
    sort: "desc",
  });

  const {
    data: blogs,
  } = useGetApi<Page<BlogAll>>({
    endpoint: "/blog/all",
    params: {
      q: filters.q,
      page: filters.page,
      size: filters.size,
      sort: filters.sort,
    },

    enabled: true,
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message || "Failed to load blogs",
        variant: "destructive",
      }),
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Generate pagination links
  const renderPaginationLinks = () => {
    const totalPages = blogs?.totalPages || 1;
    const currentPage = blogs?.page || 0;
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

  return (
    <div>
      {/* Breadcrumb Section */}
      <div
        className="h-96 bg-cover bg-center flex justify-center items-center mb-20"
        style={{ backgroundImage: `url(${breadcrumbBg})` }}
      >
        <h2 className="text-6xl font-semibold text-white">Our Blog</h2>
      </div>

      {/* Blog Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-20">
        <div className="flex flex-wrap">
          {blogs?.contents.map((blog, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white">
                <div
                  className="h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/dazttnakn/image/upload/${blog.image})`,
                  }}
                ></div>
                <div className="p-6  relative -mt-24 z-10">
                  <div className="bg-white p-6 ">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <img
                        src={calendarIcon}
                        alt="calendar"
                        className="w-4 h-4 mr-2"
                      />
                      {formatDateTime(blog.createAt)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {blog.title}
                    </h3>
                    <a
                      href={`/blog-detail?code=${encodeURIComponent(
                        blog.code
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Product Detail"
                      className="text-sm text-black font-semibold underline underline-offset-4 hover:text-red-500 transition"
                    >
                      READ MORE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Pagination */}
      {blogs && (
        <div className="flex justify-center mt-8 mb-24">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (blogs.hasPrevious)
                      handlePageChange(Number(blogs.page) - 1);
                  }}
                  className={
                    blogs.hasPrevious ? "" : "pointer-events-none opacity-50"
                  }
                />
              </PaginationItem>
              {renderPaginationLinks()}
              {Number(blogs.totalPages) > 5 &&
                Number(blogs.page) < Number(blogs.totalPages) - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (blogs.hasNext) handlePageChange(Number(blogs.page) + 1);
                  }}
                  className={
                    blogs.hasNext ? "" : "pointer-events-none opacity-50"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Blog;
