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
import {
  RefreshCw,
  Search,
  Eraser,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "@/services/axios/axios-instance";
import {
  formatDateTime,
  convertFileToBase64,
  formatVnPrice,
} from "@/common/lib/utils";
import { Page } from "@/common/hooks/type";
import {
  BrandAll,
  CategoryAll,
  ProductAll,
  ProductCreate,
  ProductUpdate,
  TagAll,
} from "../type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

const ProductPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("desc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<ProductCreate>({
    name: "",
    price: 0,
    image: "",
    shortDescription: "",
    fullDescription: "",
    categoryCode: "",
    brandCode: "",
    listTagCode: [],
  });
  const [updateFormData, setUpdateFormData] = useState<ProductUpdate>({
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products
  const { data, loading, error, refetch } = useGetApi<Page<ProductAll>>({
    endpoint: "/product/all",
    params: { q: debouncedSearchTerm, page, size, sort },
    enabled: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to load products",
        variant: "destructive",
      });
    },
  });

  // Fetch brands, categories, and tags
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

  const validateCreateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!createFormData.name.trim()) {
      errors.name = "Name is required";
    } else if (createFormData.name.length > 50) {
      errors.name = "Name must not exceed 50 characters";
    }
    if (!createFormData.price || createFormData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }
    if (!createFormData.image) {
      errors.image = "Image is required";
    }
    if (!createFormData.shortDescription.trim()) {
      errors.shortDescription = "Short description is required";
    } else if (createFormData.shortDescription.length > 150) {
      errors.shortDescription =
        "Short description must not exceed 150 characters";
    }
    if (!createFormData.fullDescription.trim()) {
      errors.fullDescription = "Full description is required";
    } else if (createFormData.fullDescription.length > 2000) {
      errors.fullDescription =
        "Full description must not exceed 2000 characters";
    }
    if (!createFormData.categoryCode) {
      errors.categoryCode = "Category is required";
    }
    if (!createFormData.brandCode) {
      errors.brandCode = "Brand is required";
    }
    if (!createFormData.listTagCode.length) {
      errors.listTagCode = "At least one tag is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpdateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!updateFormData.code.trim()) {
      errors.code = "Code is required";
    }
    if (!updateFormData.name.trim()) {
      errors.name = "Name is required";
    } else if (updateFormData.name.length > 50) {
      errors.name = "Name must not exceed 50 characters";
    }
    if (!updateFormData.price || updateFormData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }
    if (!updateFormData.image) {
      errors.image = "Image is required";
    }
    if (!updateFormData.shortDescription.trim()) {
      errors.shortDescription = "Short description is required";
    } else if (updateFormData.shortDescription.length > 150) {
      errors.shortDescription =
        "Short description must not exceed 150 characters";
    }
    if (!updateFormData.fullDescription.trim()) {
      errors.fullDescription = "Full description is required";
    } else if (updateFormData.fullDescription.length > 2000) {
      errors.fullDescription =
        "Full description must not exceed 2000 characters";
    }
    if (!updateFormData.categoryCode) {
      errors.categoryCode = "Category is required";
    }
    if (!updateFormData.brandCode) {
      errors.brandCode = "Brand is required";
    }
    if (!updateFormData.listTagCode.length) {
      errors.listTagCode = "At least one tag is required";
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

  const handleCreateImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicId = await handleImageUpload(file);
        setCreateFormData({ ...createFormData, image: publicId });
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

  const handleUpdateImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicId = await handleImageUpload(file);
        setUpdateFormData({ ...updateFormData, image: publicId });
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

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCreateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/product", createFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product created successfully.",
        });
        setIsCreateDialogOpen(false);
        setCreateFormData({
          name: "",
          price: 0,
          image: "",
          shortDescription: "",
          fullDescription: "",
          categoryCode: "",
          brandCode: "",
          listTagCode: [],
        });
        refetch();
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
          "An error occurred while creating product.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateUpdateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.put("/product", updateFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
        setIsUpdateDialogOpen(false);
        setUpdateFormData({
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
        refetch();
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

  const handleDelete = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/product", {
        data: { code },
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        });
        refetch();
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
          "An error occurred while deleting product.",
        variant: "destructive",
      });
    }
  };

  const handleOpenUpdateDialog = (product: ProductAll) => {
    setUpdateFormData({
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
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Product Management
      </h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSearchTerm("")}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px] border-gray-300 rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest to Oldest</SelectItem>
              <SelectItem value="asc">Oldest to Newest</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={size.toString()}
            onValueChange={(value) => {
              setSize(Number(value));
              setPage(0);
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
            onClick={refetch}
            disabled={loading}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Total Products */}
      <div className="mb-4">
        <p className="text-lg text-gray-600">
          Total Products:{" "}
          <span className="font-semibold">
            {Number(data?.totalElements) || 0}
          </span>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Stt</TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead className="w-[200px]">Short Description</TableHead>
              <TableHead className="w-[200px]">Full Description</TableHead>
              <TableHead className="w-[150px]">Category</TableHead>
              <TableHead className="w-[150px]">Brand</TableHead>
              <TableHead className="w-[200px]">Tags</TableHead>
              <TableHead className="w-[160px]">Created At</TableHead>
              <TableHead className="w-[160px]">Created By</TableHead>
              <TableHead className="w-[160px]">Updated At</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  <RefreshCw className="inline-block h-5 w-5 animate-spin text-gray-600" />
                  <span className="ml-2 text-gray-600">Loading...</span>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center text-zinc-500">
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.contents.length ? (
              data.contents.map((product, index) => (
                <TableRow key={product.code}>
                  <TableCell className="truncate">{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={`https://res.cloudinary.com/dazttnakn/image/upload/w_80,h_80/${product.image}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="truncate">{product.name}</TableCell>
                  <TableCell>{formatVnPrice(product.price)}</TableCell>
                  <TableCell className="truncate">
                    {product.shortDescription}
                  </TableCell>
                  <TableCell className="truncate">
                    {product.fullDescription}
                  </TableCell>
                  <TableCell>
                    {categories?.find((c) => c.code === product.categoryCode)
                      ?.name || product.categoryCode}
                  </TableCell>
                  <TableCell>
                    {brands?.find((b) => b.code === product.brandCode)?.name ||
                      product.brandCode}
                  </TableCell>
                  <TableCell className="truncate">
                    {product.listTagCode
                      .map(
                        (code) =>
                          tags?.find((t) => t.code === code)?.name || code
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell>{formatDateTime(product.createAt)}</TableCell>
                  <TableCell>{product.userCreateDisplayName}</TableCell>
                  <TableCell>
                    {product.updateAt ? formatDateTime(product.updateAt) : "-"}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenUpdateDialog(product)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(product.code)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <a
                        href={`/dashboard/product/detail?code=${encodeURIComponent(
                          product.code
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Product Detail"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center text-zinc-500">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && Number(data.totalPages) > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={!data.hasPrevious || loading}
            onClick={() => setPage(page - 1)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {Number(data.page) + 1} of {Number(data.totalPages)} (
            {Number(data.totalElements)} items)
          </span>
          <Button
            disabled={!data.hasNext || loading}
            onClick={() => setPage(page + 1)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={createFormData.name}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, name: e.target.value })
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
                placeholder="Price"
                value={createFormData.price || ""}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                min="0.01"
                step="0.01"
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.price ? "border-zinc-500" : ""
                }`}
              />
              {createFormData.price > 0 && (
                <p className="text-sm text-green-600">
                  💵 {formatVnPrice(createFormData.price)}
                </p>
              )}
              {formErrors.price && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.price}</p>
              )}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleCreateImageChange}
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
              {createFormData.image && (
                <img
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/w_80,h_80/${createFormData.image}`}
                  alt="Selected product image"
                  className="h-24 w-24 object-cover rounded mt-2"
                />
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Short Description"
                value={createFormData.shortDescription}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
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
            <div>
              <Textarea
                placeholder="Full Description"
                value={createFormData.fullDescription}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
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
            <div>
              <Select
                value={createFormData.categoryCode}
                onValueChange={(value) =>
                  setCreateFormData({ ...createFormData, categoryCode: value })
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
            <div>
              <Select
                value={createFormData.brandCode}
                onValueChange={(value) =>
                  setCreateFormData({ ...createFormData, brandCode: value })
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
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left border-gray-300 rounded-lg focus:ring-zinc-500 ${
                      formErrors.listTagCode ? "border-zinc-500" : ""
                    }`}
                  >
                    <span className="block max-w-[600px] truncate">
                      {createFormData.listTagCode.length > 0
                        ? createFormData.listTagCode
                            .map(
                              (code) =>
                                tags?.find((t) => t.code === code)?.name || code
                            )
                            .join(", ")
                        : "Select Tags"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  style={{ pointerEvents: "auto" }}
                  className="w-[600px] p-0"
                >
                  <ScrollArea className="flex flex-col space-y-2 p-4 max-h-[300px]">
                    <div className="h-full">
                      {tags?.length ? (
                        <div className="flex flex-wrap gap-4">
                          {tags.map((tag) => {
                            const checked = createFormData.listTagCode.includes(
                              tag.code
                            );
                            return (
                              <label
                                key={tag.code}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checkedValue) => {
                                    setCreateFormData((prev) => {
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
                          })}
                        </div>
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setCreateFormData({
                    name: "",
                    price: 0,
                    image: "",
                    shortDescription: "",
                    fullDescription: "",
                    categoryCode: "",
                    brandCode: "",
                    listTagCode: [],
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

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Code"
                value={updateFormData.code}
                disabled
                className="border-gray-300 rounded-lg bg-gray-100"
              />
              {formErrors.code && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.code}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={updateFormData.name}
                onChange={(e) =>
                  setUpdateFormData({ ...updateFormData, name: e.target.value })
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
                placeholder="Price"
                value={updateFormData.price || ""}
                onChange={(e) =>
                  setCreateFormData({
                    ...updateFormData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                min="0.01"
                step="0.01"
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.price ? "border-zinc-500" : ""
                }`}
              />
              {updateFormData.price > 0 && (
                <p className="text-sm text-green-600">
                  💵 {formatVnPrice(updateFormData.price)}
                </p>
              )}
              {formErrors.price && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.price}</p>
              )}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpdateImageChange}
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
              {updateFormData.image && (
                <img
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/w_80,h_80/${updateFormData.image}`}
                  alt="Current product image"
                  className="h-24 w-24 object-cover rounded mt-2"
                />
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Short Description"
                value={updateFormData.shortDescription}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
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
            <div>
              <Textarea
                placeholder="Full Description"
                value={updateFormData.fullDescription}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
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
            <div>
              <Select
                value={updateFormData.categoryCode}
                onValueChange={(value) =>
                  setUpdateFormData({ ...updateFormData, categoryCode: value })
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
            <div>
              <Select
                value={updateFormData.brandCode}
                onValueChange={(value) =>
                  setUpdateFormData({ ...updateFormData, brandCode: value })
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
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left border-gray-300 rounded-lg focus:ring-zinc-500 ${
                      formErrors.listTagCode ? "border-zinc-500" : ""
                    }`}
                  >
                    <span className="block max-w-[600px] truncate">
                      {updateFormData.listTagCode.length > 0
                        ? updateFormData.listTagCode
                            .map(
                              (code) =>
                                tags?.find((t) => t.code === code)?.name || code
                            )
                            .join(", ")
                        : "Select Tags"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  style={{ pointerEvents: "auto" }}
                  className="w-[600px] p-0"
                >
                  <ScrollArea className="flex flex-col space-y-2 p-4 max-h-[300px]">
                    <div className="h-full">
                      {tags?.length ? (
                        <div className="flex flex-wrap gap-4">
                          {tags.map((tag) => {
                            const checked = updateFormData.listTagCode.includes(
                              tag.code
                            );
                            return (
                              <label
                                key={tag.code}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checkedValue) => {
                                    setUpdateFormData((prev) => {
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
                          })}
                        </div>
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateDialogOpen(false);
                  setUpdateFormData({
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

export default ProductPage;
