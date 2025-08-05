"use client";

import { useState, useEffect } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus, RefreshCw, Search, Eraser } from "lucide-react";
import axiosInstance from "@/services/axios/axios-instance";
import {
  formatDateTime,
  convertFileToBase64,
  formatVnPrice,
} from "@/common/lib/utils";
import {
  ProductAll,
  ProductUpdate,
  BrandAll,
  CategoryAll,
  TagAll,
  ProductVersionAll,
  ProductVersionUpdate,
  ProductVersionCreate,
  SizeAll,
  ColorAll,
} from "../type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "react-router-dom";

interface FormErrors {
  name?: string;
  price?: string;
  image?: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryCode?: string;
  brandCode?: string;
  listTagCode?: string;
  code?: string;
  quantity?: string;
  sizeCode?: string;
  colorCode?: string;
  productCode?: string;
}

const ProductDetailPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const productCode = searchParams.get("code") || "";
  const [isCreateVersionDialogOpen, setIsCreateVersionDialogOpen] =
    useState<boolean>(false);
  const [productFormData, setProductFormData] = useState<ProductUpdate>({
    code: "",
    name: "",
    price: 0,
    image: "",
    shortDescription: "",
    fullDescription: "",
    categoryCode: "",
    brandCode: "",
    listTagCode: [],
  });
  const [versionFormData, setVersionFormData] = useState<{
    [key: string]: ProductVersionUpdate;
  }>({});
  const [createVersionFormData, setCreateVersionFormData] =
    useState<ProductVersionCreate>({
      name: "",
      quantity: 0,
      image: "",
      sizeCode: "",
      colorCode: "",
      productCode: productCode,
    });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Fetch product
  const {
    data: product,
    loading: productLoading,
    error: productError,
    refetch: refetchProduct,
  } = useGetApi<ProductAll>({
    endpoint: "/product",
    params: { code: productCode },
    enabled: !!productCode,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to load product",
        variant: "destructive",
      });
    },
  });

  // Fetch product versions
  const {
    data: versions,
    loading: versionsLoading,
    error: versionsError,
    refetch: refetchVersions,
  } = useGetApi<{
    contents: ProductVersionAll[];
    totalElements: number;
    totalPages: number;
    page: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }>({
    endpoint: "/product-version/all",
    params: {
      code: productCode,
      q: searchQuery,
      page: currentPage,
      size: pageSize,
      sort: sortOrder,
    },
    enabled: !!productCode,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to load product versions",
        variant: "destructive",
      });
    },
  });

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

  // Populate product form when product data is fetched
  useEffect(() => {
    if (product) {
      setProductFormData({
        code: product.code,
        name: product.name,
        price: product.price,
        image: product.image,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        categoryCode: product.categoryCode,
        brandCode: product.brandCode,
        listTagCode: product.listTagCode,
      });
    }
  }, [product]);

  // Initialize version form data when versions are fetched
  useEffect(() => {
    if (versions?.contents) {
      const newVersionFormData = versions.contents.reduce((acc, version) => {
        acc[version.code] = {
          code: version.code,
          name: version.name,
          quantity: version.quantity,
          image: version.image,
          sizeCode: version.sizeCode,
          colorCode: version.colorCode,
          productCode: version.productCode,
        };
        return acc;
      }, {} as { [key: string]: ProductVersionUpdate });
      setVersionFormData(newVersionFormData);
    }
  }, [versions]);

  const validateProductForm = (): boolean => {
    const errors: FormErrors = {};
    if (!productFormData.code.trim()) {
      errors.code = "Code is required";
    }
    if (!productFormData.name.trim()) {
      errors.name = "Name is required";
    } else if (productFormData.name.length > 50) {
      errors.name = "Name must not exceed 50 characters";
    }
    if (!productFormData.price || productFormData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }
    if (!productFormData.image) {
      errors.image = "Image is required";
    }
    if (!productFormData.shortDescription.trim()) {
      errors.shortDescription = "Short description is required";
    } else if (productFormData.shortDescription.length > 150) {
      errors.shortDescription =
        "Short description must not exceed 150 characters";
    }
    if (!productFormData.fullDescription.trim()) {
      errors.fullDescription = "Full description is required";
    } else if (productFormData.fullDescription.length > 2000) {
      errors.fullDescription =
        "Full description must not exceed 2000 characters";
    }
    if (!productFormData.categoryCode) {
      errors.categoryCode = "Category is required";
    }
    if (!productFormData.brandCode) {
      errors.brandCode = "Brand is required";
    }
    if (!productFormData.listTagCode.length) {
      errors.listTagCode = "At least one tag is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateVersionForm = (
    formData: ProductVersionUpdate | ProductVersionCreate
  ): boolean => {
    const errors: FormErrors = {};
    if ("code" in formData && !formData.code.trim()) {
      errors.code = "Code is required";
    }
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length > 50) {
      errors.name = "Name must not exceed 50 characters";
    }
    if (!formData.quantity || formData.quantity < 0) {
      errors.quantity = "Quantity must be 0 or greater";
    }
    if (!formData.image) {
      errors.image = "Image is required";
    }
    if (!formData.sizeCode) {
      errors.sizeCode = "Size is required";
    }
    if (!formData.colorCode) {
      errors.colorCode = "Color is required";
    }
    if (!formData.productCode) {
      errors.productCode = "Product code is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const base64 = await convertFileToBase64(file);
      const response = await axiosInstance.post("/files/upload/images", {
        base64,
      });
      if (response.data.code === 200) {
        return response.data.data; // Returns public_id
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicId = await handleImageUpload(file);
        setProductFormData({ ...productFormData, image: publicId });
        setFormErrors({ ...formErrors, image: undefined });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleVersionImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isCreate: boolean,
    versionCode?: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicId = await handleImageUpload(file);
        if (isCreate) {
          setCreateVersionFormData({
            ...createVersionFormData,
            image: publicId,
          });
        } else if (versionCode) {
          setVersionFormData((prev) => ({
            ...prev,
            [versionCode]: { ...prev[versionCode], image: publicId },
          }));
        }
        setFormErrors({ ...formErrors, image: undefined });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateProductSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!validateProductForm()) {
      toast({
        title: "Form Error",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.put("/product", productFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
        refetchProduct();
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
          "An error occurred while updating product.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVersionSubmit = async (versionCode: string) => {
    toast({
      title: "Processing",
      description: "Your request is being processed...",
    });

    const formData = versionFormData[versionCode];
    if (!validateVersionForm(formData)) {
      toast({
        title: "Form Error",
        description:
          "Please fill out all required fields correctly for version " +
          formData.name,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.put("/product-version", formData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product version updated successfully.",
        });
        refetchVersions();
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
          "An error occurred while updating product version.",
        variant: "destructive",
      });
    }
  };

  const handleCreateVersionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!validateVersionForm(createVersionFormData)) {
      toast({
        title: "Form Error",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/product-version",
        createVersionFormData
      );
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product version created successfully.",
        });
        setIsCreateVersionDialogOpen(false);
        setCreateVersionFormData({
          name: "",
          quantity: 0,
          image: "",
          sizeCode: "",
          colorCode: "",
          productCode: productCode,
        });
        refetchVersions();
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
          "An error occurred while creating product version.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVersion = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/product-version", {
        data: { code },
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product version deleted successfully.",
        });
        refetchVersions();
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
          "An error occurred while deleting product version.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Details</h2>

      {/* Product Info */}
      {productLoading ? (
        <div className="flex justify-center">
          <RefreshCw className="h-5 w-5 animate-spin text-gray-600" />
          <span className="ml-2 text-gray-600">Loading product...</span>
        </div>
      ) : productError ? (
        <div className="text-center text-zinc-500">
          Error: {productError.message}
        </div>
      ) : product ? (
        <form onSubmit={handleUpdateProductSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left column - image */}
            <div className="md:col-span-4">
              <div className="mb-4">
                <img
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/c_fill,w_200,h_200/${productFormData.image}`}
                  alt={productFormData.name}
                  className="w-full aspect-[4/5] object-cover rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Upload New Image
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageChange}
                  disabled={isUploading}
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.image ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.image && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.image}
                  </p>
                )}
                {isUploading && (
                  <p className="text-gray-600 text-xs mt-1">
                    Uploading image...
                  </p>
                )}
              </div>
            </div>

            {/* Right column - form */}
            <div className="md:col-span-8 space-y-4">
              {/* Code (disabled) */}
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <Input
                  type="text"
                  value={productFormData.code}
                  disabled
                  className="border-gray-300 rounded-lg bg-gray-100"
                />
                {formErrors.code && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.code}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  placeholder="Product Name"
                  value={productFormData.name}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      name: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.name ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.name && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input
                  type="number"
                  placeholder="Price"
                  value={productFormData.price || ""}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0.01"
                  step="0.01"
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.price ? "border-zinc-500" : ""
                  }`}
                />
                {productFormData.price > 0 && (
                  <p className="text-sm text-green-600">
                    💵 {formatVnPrice(productFormData.price)}
                  </p>
                )}
                {formErrors.price && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Short Description
                </label>
                <Input
                  type="text"
                  placeholder="Short Description"
                  value={productFormData.shortDescription}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      shortDescription: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.shortDescription ? "border-zinc-500" : ""
                  }`}
                />
                {formErrors.shortDescription && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.shortDescription}
                  </p>
                )}
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Description
                </label>
                <Textarea
                  placeholder="Full Description"
                  value={productFormData.fullDescription}
                  onChange={(e) =>
                    setProductFormData({
                      ...productFormData,
                      fullDescription: e.target.value,
                    })
                  }
                  className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                    formErrors.fullDescription ? "border-zinc-500" : ""
                  }`}
                  rows={4}
                />
                {formErrors.fullDescription && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.fullDescription}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <Select
                  value={productFormData.categoryCode}
                  onValueChange={(value) =>
                    setProductFormData({
                      ...productFormData,
                      categoryCode: value,
                    })
                  }
                >
                  <SelectTrigger
                    className={`border-gray-300 rounded-lg ${
                      formErrors.categoryCode ? "border-zinc-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.code} value={category.code}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.categoryCode && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.categoryCode}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <Select
                  value={productFormData.brandCode}
                  onValueChange={(value) =>
                    setProductFormData({ ...productFormData, brandCode: value })
                  }
                >
                  <SelectTrigger
                    className={`border-gray-300 rounded-lg ${
                      formErrors.brandCode ? "border-zinc-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.code} value={brand.code}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.brandCode && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.brandCode}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.listTagCode ? "border-zinc-500" : ""
                      }`}
                    >
                      <span className="block max-w-[600px] truncate">
                        {productFormData.listTagCode.length > 0
                          ? productFormData.listTagCode
                              .map(
                                (code) =>
                                  tags?.find((t) => t.code === code)?.name ||
                                  code
                              )
                              .join(", ")
                          : "Select Tags"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0">
                    <ScrollArea className="p-4 max-h-[300px]">
                      <div className="flex flex-wrap gap-4">
                        {tags?.length ? (
                          tags.map((tag) => {
                            const checked =
                              productFormData.listTagCode.includes(tag.code);
                            return (
                              <label
                                key={tag.code}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checkedValue) => {
                                    setProductFormData((prev) => {
                                      const newList = checkedValue
                                        ? [...prev.listTagCode, tag.code]
                                        : prev.listTagCode.filter(
                                            (t) => t !== tag.code
                                          );
                                      return { ...prev, listTagCode: newList };
                                    });
                                    setFormErrors((prev) => ({
                                      ...prev,
                                      listTagCode: undefined,
                                    }));
                                  }}
                                />
                                <span className="text-gray-700">
                                  {tag.name}
                                </span>
                              </label>
                            );
                          })
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No tags available
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                {formErrors.listTagCode && (
                  <p className="text-zinc-500 text-xs mt-1">
                    {formErrors.listTagCode}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 w-full text-end">
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
                >
                  Save Product
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center text-zinc-500">No product found</div>
      )}

      {/* Product Versions */}
      <div className="mb-6">
        <div className="flex justify-start items-center mb-4">
          <h3 className="text-xl font-semibold">Product Versions</h3>
        </div>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="border-gray-300 text-gray-600 hover:text-zinc-500"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px] border-gray-300 rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest to Oldest</SelectItem>
                <SelectItem value="asc">Oldest to Newest</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(0);
              }}
            >
              <SelectTrigger className="w-[100px] border-gray-300 rounded-lg">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100, 200].map((sizeOption) => (
                  <SelectItem key={sizeOption} value={sizeOption.toString()}>
                    {sizeOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={refetchVersions}
              disabled={versionsLoading}
              className="border-gray-300 text-gray-600 hover:text-zinc-500"
            >
              <RefreshCw
                className={`h-4 w-4 ${versionsLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={() => setIsCreateVersionDialogOpen(true)}
              className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Version
            </Button>
          </div>
        </div>
        <div className="overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Stt</TableHead>
                <TableHead className="w-[200px]">Image</TableHead>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead className="w-[100px]">Quantity</TableHead>
                <TableHead className="w-[150px]">Size</TableHead>
                <TableHead className="w-[150px]">Color</TableHead>
                <TableHead className="w-[160px]">Created At</TableHead>
                <TableHead className="w-[160px]">Created By</TableHead>
                <TableHead className="w-[160px]">Updated At</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versionsLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    <RefreshCw className="inline-block h-5 w-5 animate-spin text-gray-600" />
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : versionsError ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-zinc-500">
                    Error: {versionsError.message}
                  </TableCell>
                </TableRow>
              ) : versions?.contents.length ? (
                versions.contents.map((version, index) => (
                  <TableRow key={version.code}>
                    <TableCell className="truncate">
                      {index + 1 + currentPage * pageSize}
                    </TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <img
                        src={`https://res.cloudinary.com/dazttnakn/image/upload/c_fill,w_80,h_80/${
                          versionFormData[version.code]?.image || version.image
                        }`}
                        alt={version.name}
                        className="w-12 h-12 object-cover rounded "
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleVersionImageChange(e, false, version.code)
                        }
                        disabled={isUploading}
                        className={`border-gray-300 rounded-lg focus:ring-zinc-500  ${
                          formErrors.image ? "border-zinc-500" : ""
                        }`}
                      />
                      {formErrors.image && (
                        <p className="text-zinc-500 text-xs ">
                          {formErrors.image}
                        </p>
                      )}
                      {isUploading && (
                        <p className="text-gray-600 text-xs ">
                          Uploading image...
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={
                          versionFormData[version.code]?.name || version.name
                        }
                        onChange={(e) =>
                          setVersionFormData((prev) => ({
                            ...prev,
                            [version.code]: {
                              ...prev[version.code],
                              name: e.target.value,
                            },
                          }))
                        }
                        className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                          formErrors.name ? "border-zinc-500" : ""
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-zinc-500 text-xs mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={
                          versionFormData[version.code]?.quantity ||
                          version.quantity
                        }
                        onChange={(e) =>
                          setVersionFormData((prev) => ({
                            ...prev,
                            [version.code]: {
                              ...prev[version.code],
                              quantity: parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                        min="0"
                        className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                          formErrors.quantity ? "border-zinc-500" : ""
                        }`}
                      />
                      {formErrors.quantity && (
                        <p className="text-zinc-500 text-xs mt-1">
                          {formErrors.quantity}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={
                          versionFormData[version.code]?.sizeCode ||
                          version.sizeCode
                        }
                        onValueChange={(value) =>
                          setVersionFormData((prev) => ({
                            ...prev,
                            [version.code]: {
                              ...prev[version.code],
                              sizeCode: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger
                          className={`border-gray-300 rounded-lg ${
                            formErrors.sizeCode ? "border-zinc-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes?.map((size) => (
                            <SelectItem key={size.code} value={size.code}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.sizeCode && (
                        <p className="text-zinc-500 text-xs mt-1">
                          {formErrors.sizeCode}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={
                          versionFormData[version.code]?.colorCode ||
                          version.colorCode
                        }
                        onValueChange={(value) =>
                          setVersionFormData((prev) => ({
                            ...prev,
                            [version.code]: {
                              ...prev[version.code],
                              colorCode: value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger
                          className={`border-gray-300 rounded-lg ${
                            formErrors.colorCode ? "border-zinc-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select Color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors?.map((color) => (
                            <SelectItem key={color.code} value={color.code}>
                              <div className="flex items-center space-x-2">
                                <span
                                  className="h-4 w-4 rounded-full border"
                                  style={{ backgroundColor: color.name }}
                                ></span>
                                <span>{color.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.colorCode && (
                        <p className="text-zinc-500 text-xs mt-1">
                          {formErrors.colorCode}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(version.createAt)}</TableCell>
                    <TableCell>{version.userCreateDisplayName}</TableCell>
                    <TableCell>
                      {version.updateAt
                        ? formatDateTime(version.updateAt)
                        : "-"}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateVersionSubmit(version.code)}
                        className="w-20 border-gray-300 text-gray-600 hover:text-zinc-500"
                      >
                        <Edit className="h-4 w-4" /> Save
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteVersion(version.code)}
                        className="border-gray-300 text-gray-600 hover:text-zinc-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-zinc-500">
                    No product versions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {versions && versions.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={!versions.hasPrevious}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
            >
              Previous
            </Button>
            <span>
              Page {versions.page + 1} of {versions.totalPages} (
              {versions.totalElements} items)
            </span>
            <Button
              disabled={!versions.hasNext}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create Product Version Dialog */}
      <Dialog
        open={isCreateVersionDialogOpen}
        onOpenChange={setIsCreateVersionDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Product Version</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateVersionSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={createVersionFormData.name}
                onChange={(e) =>
                  setCreateVersionFormData({
                    ...createVersionFormData,
                    name: e.target.value,
                  })
                }
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.name ? "border-zinc-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Quantity"
                value={createVersionFormData.quantity || ""}
                onChange={(e) =>
                  setCreateVersionFormData({
                    ...createVersionFormData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.quantity ? "border-zinc-500" : ""
                }`}
              />
              {formErrors.quantity && (
                <p className="text-zinc-500 text-xs mt-1">
                  {formErrors.quantity}
                </p>
              )}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleVersionImageChange(e, true)}
                disabled={isUploading}
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.image ? "border-zinc-500" : ""
                }`}
              />
              {formErrors.image && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.image}</p>
              )}
              {isUploading && (
                <p className="text-gray-600 text-xs mt-1">Uploading image...</p>
              )}
              {createVersionFormData.image && (
                <img
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/c_fill,w_80,h_80/${createVersionFormData.image}`}
                  alt="Selected version image"
                  className="h-24 w-24 object-cover rounded mt-2"
                />
              )}
            </div>
            <div>
              <Select
                value={createVersionFormData.sizeCode}
                onValueChange={(value) =>
                  setCreateVersionFormData({
                    ...createVersionFormData,
                    sizeCode: value,
                  })
                }
              >
                <SelectTrigger
                  className={`border-gray-300 rounded-lg ${
                    formErrors.sizeCode ? "border-zinc-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes?.map((size) => (
                    <SelectItem key={size.code} value={size.code}>
                      {size.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.sizeCode && (
                <p className="text-zinc-500 text-xs mt-1">
                  {formErrors.sizeCode}
                </p>
              )}
            </div>
            <div>
              <Select
                value={createVersionFormData.colorCode}
                onValueChange={(value) =>
                  setCreateVersionFormData({
                    ...createVersionFormData,
                    colorCode: value,
                  })
                }
              >
                <SelectTrigger
                  className={`border-gray-300 rounded-lg ${
                    formErrors.colorCode ? "border-zinc-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors?.map((color) => (
                    <SelectItem key={color.code} value={color.code}>
                      <div className="flex items-center space-x-2">
                        <span
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: color.name }}
                        ></span>
                        <span>{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.colorCode && (
                <p className="text-zinc-500 text-xs mt-1">
                  {formErrors.colorCode}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateVersionDialogOpen(false);
                  setCreateVersionFormData({
                    name: "",
                    quantity: 0,
                    image: "",
                    sizeCode: "",
                    colorCode: "",
                    productCode: productCode,
                  });
                }}
                className="border-gray-300 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetailPage;
