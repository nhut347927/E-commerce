import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  BrandAll,
  CategoryAll,
  ColorAll,
  SizeAll,
  TagAll,
} from "@/pages/dashboard/type";
import { useGetApi } from "@/common/hooks/use-get-api";
import { ProductFilterParams } from "@/pages/client/types";
import { formatVnPrice } from "@/common/lib/utils";

interface ShopSliderProps {
  filters: ProductFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilterParams>>;
}

const ShopSlider: React.FC<ShopSliderProps> = ({ filters, setFilters }) => {
  // Fetch brands, categories, tags, sizes, and colors
  const { data: brands } = useGetApi<BrandAll[]>({
    endpoint: "/product/brand/all",
    enabled: true,
  });
  const { data: categories } = useGetApi<CategoryAll[]>({
    endpoint: "/product/category/all",
    enabled: true,
  });
  const { data: tags } = useGetApi<TagAll[]>({
    endpoint: "/product/tag/all",
    enabled: true,
  });
  const { data: sizes } = useGetApi<SizeAll[]>({
    endpoint: "/product-version/size/all",
    enabled: true,
  });
  const { data: colors } = useGetApi<ColorAll[]>({
    endpoint: "/product-version/color/all",
    enabled: true,
  });


   const { data: examPrice } = useGetApi<{ data: string }>({
      endpoint: "/setting/get",
      params: { code: "17ee3575-c22a-4a6a-93af-0ed2c31b93b2" },
    });
  
    const priceRanges: any[] = examPrice?.data
      ? JSON.parse(examPrice.data)
      : [];

  // State for search input
  const [searchQuery, setSearchQuery] = useState(filters.q || "");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, q: searchQuery, page: 0 }));
  };

  // Handle Enter key for search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Handle filter selection
  const handleFilterChange = (
    key: keyof ProductFilterParams,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0, // Reset to first page on filter change
    }));
  };

  const handlePriceRangeChange = (
    minPrice: number,
    maxPrice: number | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice: maxPrice ?? undefined,
      page: 0,
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      q: "",
      page: 0,
      size: 10,
      sort: "desc",
      categoryCode: undefined,
      brandCode: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sizeCode: undefined,
      colorCode: undefined,
      tagCode: undefined,
    });
  };

  return (
    <div className="space-y-8 text-sm">
      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          className="w-full rounded-none border border-zinc-300 focus:ring-2 focus:ring-red-500 focus:outline-none text-zinc-700"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSearchSubmit}
          className="rounded-none bg-white border-zinc-300 hover:bg-red-500 hover:text-white transition"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Clear Filters Button */}
      <Button
        variant="outline"
        onClick={handleClearFilters}
        className="w-full rounded-none bg-white border-zinc-300 hover:bg-red-500 hover:text-white transition"
      >
        Clear All Filters
      </Button>

      {/* Accordion Filters */}
      <Accordion
        type="multiple"
        defaultValue={[
          "categories",
          "branding",
          "price",
          "size",
          "color",
          "tags",
        ]}
        className="w-full space-y-2"
      >
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Categories
          </AccordionTrigger>
          <AccordionContent className="max-h-52 overflow-y-auto pt-1">
            <ul className="space-y-2">
              {categories?.map((cat) => (
                <li key={cat.code}>
                  <span
                    onClick={() => handleFilterChange("categoryCode", cat.code)}
                    className={`block text-[14px] cursor-pointer ${
                      cat.code === filters.categoryCode
                        ? "text-red-500 font-semibold"
                        : "text-zinc-900"
                    } hover:text-red-500 transition`}
                  >
                    {cat.name}
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Branding */}
        <AccordionItem value="branding">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Branding
          </AccordionTrigger>
          <AccordionContent className="max-h-48 overflow-y-auto pt-1">
            <ul className="space-y-2">
              {brands?.map((brand) => (
                <li key={brand.code}>
                  <span
                    onClick={() => handleFilterChange("brandCode", brand.code)}
                    className={`block text-[14px] cursor-pointer ${
                      brand.code === filters.brandCode
                        ? "text-red-500 font-semibold"
                        : "text-zinc-900"
                    } hover:text-red-500 transition`}
                  >
                    {brand.name}
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Filter Price
          </AccordionTrigger>
          <AccordionContent className="max-h-48 overflow-y-auto pt-1">
            <ul className="space-y-2">
              {priceRanges.map((p, idx) => (
                <li key={idx}>
                  <span
                    onClick={() =>
                      handlePriceRangeChange(p.minPrice, p.maxPrice)
                    }
                    className={`block text-[14px] cursor-pointer ${
                      p.minPrice === filters.minPrice &&
                      p.maxPrice === filters.maxPrice
                        ? "text-red-500 font-semibold"
                        : "text-zinc-900"
                    } hover:text-red-500 transition`}
                  >
                    {formatVnPrice(p.minPrice)} -{" "}
                    {p.maxPrice
                      ? formatVnPrice(p.maxPrice)
                      : "Above " + formatVnPrice(p.minPrice)}
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        {/* Size */}
        <AccordionItem value="size">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Size
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-4 gap-2">
              {sizes?.map((size) => (
                <Button
                  key={size.code}
                  variant="outline"
                  onClick={() => handleFilterChange("sizeCode", size.code)}
                  className={`text-[13px] px-2 py-1 rounded-none text-zinc-700 border-zinc-300 ${
                    size.code === filters.sizeCode
                      ? "bg-red-500 text-white"
                      : "hover:bg-zinc-900 hover:text-white"
                  } transition`}
                >
                  {size.name}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Colors */}
        <AccordionItem value="color">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Colors
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-5 gap-2">
              {colors?.map((color) => (
                <button
                  key={color.code}
                  onClick={() => handleFilterChange("colorCode", color.code)}
                  className={`w-8 h-8 rounded-full border border-zinc-300 transition-all duration-200
            ${
              color.code === filters.colorCode
                ? "ring-4 ring-red-500"
                : "hover:ring-4 hover:ring-zinc-400"
            }`}
                  style={{ backgroundColor: color.name }}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Tags
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <Button
                  key={tag.code}
                  onClick={() => handleFilterChange("tagCode", tag.code)}
                  className={`text-[13px] px-3 py-1 rounded-full ${
                    tag.code === filters.tagCode
                      ? "bg-red-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white"
                  } transition`}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ShopSlider;
