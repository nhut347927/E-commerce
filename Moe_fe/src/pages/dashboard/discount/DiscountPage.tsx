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
import { RefreshCw, Search, Eraser, Edit, Trash2, Plus } from "lucide-react";
import axiosInstance from "@/services/axios/axios-instance";
import { formatDateTime, formatVnPrice } from "@/common/lib/utils";
import { Page } from "@/common/hooks/type";
import {
  DiscountAll,
  DiscountCreateCo,
  DiscountCreatePro,
  DiscountUpdateCo,
  DiscountUpdatePro,
  ProductAll,
} from "../type";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormErrors {
  code?: string;
  discountCode?: string;
  discountType?: string;
  description?: string;
  discountValue?: string;
  maxDiscount?: string;
  startDate?: string;
  endDate?: string;
  isActive?: string;
  productCode?: string;
  usageLimit?: string;
}

const DiscountPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(25);
  const [sort, setSort] = useState<string>("desc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [createDialogType, setCreateDialogType] = useState<
    "PRODUCT" | "CODE" | null
  >(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<
    DiscountCreatePro | DiscountCreateCo
  >({
    discountType: "PRODUCT",
    description: "",
    discountValue: 0,
    maxDiscount: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    productCode: "",
    discountCode: "",
    usageLimit: 0,
  });
  const [updateFormData, setUpdateFormData] = useState<
    DiscountUpdatePro | DiscountUpdateCo
  >({
    code: "",
    discountType: "PRODUCT",
    description: "",
    discountValue: 0,
    maxDiscount: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    productCode: "",
    discountCode: "",
    usageLimit: 0,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // state thêm vào component cha:
  const [searchTermP, setSearchTermP] = useState("");
  const [sortOptionP, setSortOptionP] = useState("asc");
  const [sizeP, setSizeP] = useState(20);
  const [selectedProductCodeP, setSelectedProductCodeP] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch discounts
  const { data, loading, error, refetch } = useGetApi<Page<DiscountAll>>({
    endpoint: "/discount/all",
    params: { q: debouncedSearchTerm, page, size, sort },
    enabled: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to load discounts",
        variant: "destructive",
      });
    },
  });

  // Fetch products for product selection

  const { data: products } = useGetApi<Page<ProductAll>>({
    endpoint: "/product/all/basic",
    params: {
      q: searchTermP,
      sort: sortOptionP,
      size: sizeP,
    },
    enabled: true,
  });

  const validateForm = (
    formData:
      | DiscountCreatePro
      | DiscountCreateCo
      | DiscountUpdatePro
      | DiscountUpdateCo,
    isUpdate: boolean
  ): boolean => {
    const errors: FormErrors = {};

    if (isUpdate && "code" in formData && !formData.code.trim()) {
      errors.code = "Code is required";
    }

    if (!formData.discountType) {
      errors.discountType = "Discount type is required";
    } else if (!["PRODUCT", "CODE"].includes(formData.discountType)) {
      errors.discountType = "Discount type must be either 'PRODUCT' or 'CODE'";
    }

    if (formData.description && formData.description.length > 255) {
      errors.description = "Description must not exceed 255 characters";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      errors.discountValue = "Discount value must be greater than 0";
    } else if (formData.discountValue > 50) {
      errors.discountValue = "Discount value must not exceed 50%";
    }

    if (formData.maxDiscount < 0) {
      errors.maxDiscount =
        "Maximum discount must be greater than or equal to 0";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (formData.isActive === null || formData.isActive === undefined) {
      errors.isActive = "Status is required";
    }

    if (formData.discountType === "PRODUCT") {
      if ("productCode" in formData && !formData.productCode.trim()) {
        errors.productCode = "Product code is required";
      }
    } else if (formData.discountType === "CODE") {
      if ("discountCode" in formData && !formData.discountCode.trim()) {
        errors.discountCode = "Discount code is required";
      } else if (
        "discountCode" in formData &&
        formData.discountCode.length > 20
      ) {
        errors.discountCode = "Discount code must not exceed 20 characters";
      }
      if ("usageLimit" in formData && formData.usageLimit < 0) {
        errors.usageLimit = "Usage limit must be greater than or equal to 0";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(createFormData, false)) {
      toast({
        title: "Form Error",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const endpoint =
        createFormData.discountType === "PRODUCT"
          ? "/discount/product"
          : "/discount/code";
      const response = await axiosInstance.post(endpoint, createFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Discount created successfully.",
        });
        setCreateDialogType(null);
        setCreateFormData({
          discountType: "PRODUCT",
          description: "",
          discountValue: 0,
          maxDiscount: 0,
          startDate: "",
          endDate: "",
          isActive: true,
          productCode: "",
          discountCode: "",
          usageLimit: 0,
        });
        setSelectedProductCodeP("");
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
          "An error occurred while creating discount.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm(updateFormData, true)) {
      toast({
        title: "Form Error",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const endpoint =
        updateFormData.discountType === "PRODUCT"
          ? "/discount/product"
          : "/discount/code";
      const response = await axiosInstance.put(endpoint, updateFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Discount updated successfully.",
        });
        setIsUpdateDialogOpen(false);
        setUpdateFormData({
          code: "",
          discountType: "PRODUCT",
          description: "",
          discountValue: 0,
          maxDiscount: 0,
          startDate: "",
          endDate: "",
          isActive: true,
          productCode: "",
          discountCode: "",
          usageLimit: 0,
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
          "An error occurred while updating discount.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/discount", {
        data: { code },
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Discount deleted successfully.",
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
          "An error occurred while deleting discount.",
        variant: "destructive",
      });
    }
  };

  const handleOpenUpdateDialog = (discount: DiscountAll) => {
    setUpdateFormData({
      code: discount.code,
      discountType: discount.discountType,
      description: discount.description || "",
      discountValue: discount.discountValue,
      maxDiscount: discount.maxDiscount,
      startDate: discount.startDate,
      endDate: discount.endDate || "",
      isActive: discount.isActive,
      productCode: discount.productCode || "",
      discountCode: discount.discountCode || "",
      usageLimit: discount.usageLimit || 0,
    });
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Discount Management
      </h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search discounts by keyword..."
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
              {[10, 25, 50, 100].map((sizeOption) => (
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
            onClick={() => {
              setCreateDialogType("PRODUCT");
              setCreateFormData({
                discountType: "PRODUCT",
                description: "",
                discountValue: 0,
                maxDiscount: 0,
                startDate: "",
                endDate: "",
                isActive: true,
                productCode: "",
              });
            }}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Product Discount
          </Button>
          <Button
            onClick={() => {
              setCreateDialogType("CODE");
              setCreateFormData({
                discountType: "CODE",
                description: "",
                discountValue: 0,
                maxDiscount: 0,
                startDate: "",
                endDate: "",
                isActive: true,
                discountCode: "",
                usageLimit: 0,
              });
            }}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Discount Code
          </Button>
        </div>
      </div>

      {/* Total Discounts */}
      <div className="mb-4">
        <p className="text-lg text-gray-600">
          Total Discounts:{" "}
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
              <TableHead className="w-[120px]">Discount Code</TableHead>
              <TableHead className="w-[130px]">Type</TableHead>
              <TableHead className="w-[150px]">Description</TableHead>
              <TableHead className="w-[100px]">Value (%)</TableHead>
              <TableHead className="w-[120px]">Max Discount</TableHead>
              <TableHead className="w-[150px]">Product</TableHead>
              <TableHead className="w-[100px]">Usage Limit</TableHead>
              <TableHead className="w-[120px]">Start Date</TableHead>
              <TableHead className="w-[120px]">End Date</TableHead>
              <TableHead className="w-[80px]">Validity</TableHead>
              <TableHead className="w-[80px]">Active</TableHead>
              <TableHead className="w-[150px]">Created At</TableHead>
              <TableHead className="w-[150px]">Created By</TableHead>
              <TableHead className="w-[150px]">Update At</TableHead>
              <TableHead className="w-[150px]">Update By</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center">
                  <RefreshCw className="inline-block h-5 w-5 animate-spin text-gray-600" />
                  <span className="ml-2 text-gray-600">Loading...</span>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center text-zinc-500">
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.contents.length ? (
              data.contents.map((discount, index) => (
                <TableRow key={discount.code}>
                  <TableCell className="truncate">{index + 1}</TableCell>
                  <TableCell>{discount.discountCode || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`${
                        discount.discountType === "PRODUCT"
                          ? "px-3 py-1 rounded-md font-bold bg-green-400 text-white"
                          : "px-3 py-1 rounded-md font-bold bg-blue-400 text-white"
                      }`}
                    >
                      {discount.discountType}
                    </span>
                  </TableCell>
                  <TableCell className="truncate">
                    {discount.description || "-"}
                  </TableCell>
                  <TableCell>{discount.discountValue}%</TableCell>
                  <TableCell>{formatVnPrice(discount.maxDiscount)}</TableCell>
                  <TableCell className="truncate">
                    {discount.productName || discount.productCode || "-"}
                  </TableCell>
                  <TableCell>{discount.usageLimit || "-"}</TableCell>
                  <TableCell>{formatDateTime(discount.startDate)}</TableCell>
                  <TableCell>
                    {discount.endDate ? formatDateTime(discount.endDate) : "-"}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const now = new Date();
                      const start = new Date(discount.startDate);
                      const end = discount.endDate
                        ? new Date(discount.endDate)
                        : null;

                      const isActive = end
                        ? now >= start && now <= end
                        : now >= start;

                      return (
                        <span
                          className={
                            isActive
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {isActive ? "Active" : "Expired"}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${
                        discount.isActive
                          ? "px-3 py-1 rounded-md font-bold bg-green-400 text-white"
                          : ""
                      }`}
                    >
                      {discount.isActive ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDateTime(discount.createAt)}</TableCell>
                  <TableCell>{discount.userCreateDisplayName}</TableCell>
                  <TableCell>{formatDateTime(discount.updateAt)}</TableCell>
                  <TableCell>{discount.userUpdateDisplayName}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenUpdateDialog(discount)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(discount.code)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} className="text-center text-zinc-500">
                  No discounts found
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
      {createDialogType && (
        <Dialog
          open={!!createDialogType}
          onOpenChange={() => {
            setCreateDialogType(null);
            setCreateFormData({
              discountType: "PRODUCT",
              description: "",
              discountValue: 0,
              maxDiscount: 0,
              startDate: "",
              endDate: "",
              isActive: true,
              productCode: "",
              discountCode: "",
              usageLimit: 0,
            });
            setFormErrors({});
          }}
        >
          <DialogContent className="max-w-3xl p-0">
            <ScrollArea className="w-full max-h-[80vh] ">
              <div className="h-full p-5">
                <DialogHeader className="mb-3">
                  <DialogTitle>
                    Create{" "}
                    {createDialogType === "PRODUCT"
                      ? "Product Discount"
                      : "Discount Code"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  {createDialogType === "CODE" && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Discount Code"
                        value={
                          (createFormData as DiscountCreateCo).discountCode ||
                          ""
                        }
                        onChange={(e) =>
                          setCreateFormData({
                            ...createFormData,
                            discountCode: e.target.value,
                          })
                        }
                        className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                          formErrors.discountCode ? "border-zinc-500" : ""
                        }`}
                      />
                      {formErrors.discountCode && (
                        <p className="text-zinc-500 text-xs mt-1">
                          {formErrors.discountCode}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <Textarea
                      placeholder="Description"
                      value={createFormData.description || ""}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          description: e.target.value,
                        })
                      }
                      className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.description ? "border-zinc-500" : ""
                      }`}
                      rows={3}
                    />
                    {formErrors.description && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Discount Value (%)"
                      value={createFormData.discountValue || ""}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          discountValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0.01"
                      max="50"
                      step="0.01"
                      className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.discountValue ? "border-zinc-500" : ""
                      }`}
                    />
                    {formErrors.discountValue && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.discountValue}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max Discount (VND)"
                      value={createFormData.maxDiscount || ""}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          maxDiscount: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      step="1000"
                      className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.maxDiscount ? "border-zinc-500" : ""
                      }`}
                    />
                    {createFormData.maxDiscount > 0 && (
                      <p className="text-sm text-green-600">
                        💵 {formatVnPrice(createFormData.maxDiscount)}
                      </p>
                    )}
                    {formErrors.maxDiscount && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.maxDiscount}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="datetime-local"
                      placeholder="Start Date"
                      value={createFormData.startDate}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          startDate: e.target.value,
                        })
                      }
                      className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.startDate ? "border-zinc-500" : ""
                      }`}
                    />
                    {formErrors.startDate && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="datetime-local"
                      placeholder="End Date"
                      value={createFormData.endDate || ""}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          endDate: e.target.value,
                        })
                      }
                      className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.endDate ? "border-zinc-500" : ""
                      }`}
                    />
                    {formErrors.endDate && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.endDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <Select
                      value={createFormData.isActive ? "true" : "false"}
                      onValueChange={(value) =>
                        setCreateFormData({
                          ...createFormData,
                          isActive: value === "true",
                        })
                      }
                    >
                      <SelectTrigger
                        className={`border-gray-300 rounded-lg ${
                          formErrors.isActive ? "border-zinc-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.isActive && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.isActive}
                      </p>
                    )}
                  </div>
                  {createDialogType === "PRODUCT" && (
                    <div className="space-y-4 p-5 bg-zinc-100 rounded-xl">
                      {/* Search & Clear */}
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Search product..."
                          value={searchTermP}
                          onChange={(e) => setSearchTermP(e.target.value)}
                          className="w-full"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setSearchTermP("")}
                          className="text-sm"
                        >
                          Clear
                        </Button>
                      </div>

                      {/* Sort + Size */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Sort:</span>
                          <Select
                            value={sortOptionP}
                            onValueChange={setSortOptionP}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="desc">
                                Newest to Oldest
                              </SelectItem>
                              <SelectItem value="asc">
                                Oldest to Newest
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Size:</span>
                          <Select
                            value={sizeP.toString()}
                            onValueChange={(v) => setSizeP(Number(v))}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Product cards with checkbox */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
                        {products?.contents.map((product: ProductAll) => {
                          const isSelected =
                            selectedProductCodeP === product.code;
                          return (
                            <label
                              key={product.code}
                              className={`relative p-2 border rounded-lg cursor-pointer flex flex-col items-center text-center transition 
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow"
                  : "border-gray-300 hover:border-gray-400"
              }`}
                            >
                              <img
                                src={`https://res.cloudinary.com/dazttnakn/image/upload/c_fill,w_100,h_100/${product.image}`}
                                alt={product.name}
                                className="w-20 h-20 object-cover mb-2 rounded"
                              />
                              <p className="text-sm font-medium line-clamp-2">
                                {product.name}
                              </p>

                              <input
                                type="checkbox"
                                className="absolute top-2 left-2"
                                checked={isSelected}
                                onChange={() => {
                                  const value = isSelected ? "" : product.code;
                                  setSelectedProductCodeP(value);
                                  setCreateFormData({
                                    ...createFormData,
                                    productCode: value,
                                  });
                                }}
                              />
                            </label>
                          );
                        })}
                      </div>

                      {formErrors.productCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.productCode}
                        </p>
                      )}
                    </div>
                  )}
                  {createDialogType === "CODE" && (
                    <div>
                      <Input
                        type="number"
                        placeholder="Usage Limit"
                        value={
                          (createFormData as DiscountCreateCo).usageLimit || ""
                        }
                        onChange={(e) =>
                          setCreateFormData({
                            ...createFormData,
                            usageLimit: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                          formErrors.usageLimit ? "border-zinc-500" : ""
                        }`}
                      />
                      {formErrors.usageLimit && (
                        <p className="text-zinc-500 text-xs mt-1">
                          {formErrors.usageLimit}
                        </p>
                      )}
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCreateDialogType(null);
                        setCreateFormData({
                          discountType: "PRODUCT",
                          description: "",
                          discountValue: 0,
                          maxDiscount: 0,
                          startDate: "",
                          endDate: "",
                          isActive: true,
                          productCode: "",
                          discountCode: "",
                          usageLimit: 0,
                        });
                        setFormErrors({});
                        setSelectedProductCodeP("");
                      }}
                      className="border-gray-300 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-3xl p-0">
          <ScrollArea className="w-full max-h-[80vh] ">
            <div className="h-full p-5">
              <DialogHeader>
                <DialogTitle>
                  Update{" "}
                  {updateFormData.discountType === "PRODUCT"
                    ? "Product Discount"
                    : "Discount Code"}
                </DialogTitle>
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
                    <p className="text-zinc-500 text-xs mt-1">
                      {formErrors.code}
                    </p>
                  )}
                </div>
                {updateFormData.discountType === "CODE" && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Discount Code"
                      value={
                        (updateFormData as DiscountUpdateCo).discountCode || ""
                      }
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          discountCode: e.target.value,
                        })
                      }
                      className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.discountCode ? "border-zinc-500" : ""
                      }`}
                    />
                    {formErrors.discountCode && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.discountCode}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <Textarea
                    placeholder="Description"
                    value={updateFormData.description || ""}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        description: e.target.value,
                      })
                    }
                    className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                      formErrors.description ? "border-zinc-500" : ""
                    }`}
                    rows={3}
                  />
                  {formErrors.description && (
                    <p className="text-zinc-500 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Discount Value (%)"
                    value={updateFormData.discountValue || ""}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        discountValue: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0.01"
                    max="50"
                    step="0.01"
                    className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                      formErrors.discountValue ? "border-zinc-500" : ""
                    }`}
                  />
                  {formErrors.discountValue && (
                    <p className="text-zinc-500 text-xs mt-1">
                      {formErrors.discountValue}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max Discount (VND)"
                    value={updateFormData.maxDiscount || ""}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        maxDiscount: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="1000"
                    className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                      formErrors.maxDiscount ? "border-zinc-500" : ""
                    }`}
                  />
                  {updateFormData.maxDiscount > 0 && (
                    <p className="text-sm text-green-600">
                      💵 {formatVnPrice(updateFormData.maxDiscount)}
                    </p>
                  )}
                  {formErrors.maxDiscount && (
                    <p className="text-zinc-500 text-xs mt-1">
                      {formErrors.maxDiscount}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="datetime-local"
                    placeholder="Start Date"
                    value={updateFormData.startDate}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        startDate: e.target.value,
                      })
                    }
                    className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                      formErrors.startDate ? "border-zinc-500" : ""
                    }`}
                  />
                  {formErrors.startDate && (
                    <p className="text-zinc-500 text-xs mt-1">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="datetime-local"
                    placeholder="End Date"
                    value={updateFormData.endDate || ""}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        endDate: e.target.value,
                      })
                    }
                    className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                      formErrors.endDate ? "border-zinc-500" : ""
                    }`}
                  />
                  {formErrors.endDate && (
                    <p className="text-zinc-500 text-xs mt-1">
                      {formErrors.endDate}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    value={updateFormData.isActive ? "true" : "false"}
                    onValueChange={(value) =>
                      setUpdateFormData({
                        ...updateFormData,
                        isActive: value === "true",
                      })
                    }
                  >
                    <SelectTrigger
                      className={`border-gray-300 rounded-lg ${
                        formErrors.isActive ? "border-zinc-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.isActive && (
                    <p className="text-zinc-500 text-xs mt-1">
                      {formErrors.isActive}
                    </p>
                  )}
                </div>
                {updateFormData.discountType === "PRODUCT" && (
                  <div className="space-y-4 p-5 bg-zinc-100 rounded-xl">
                    {/* Search & Clear */}
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Search product..."
                        value={searchTermP}
                        onChange={(e) => setSearchTermP(e.target.value)}
                        className="w-full"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setSearchTermP("")}
                        className="text-sm"
                      >
                        Clear
                      </Button>
                    </div>

                    {/* Sort + Size */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Sort:</span>
                        <Select
                          value={sortOptionP}
                          onValueChange={setSortOptionP}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desc">
                              Newest to Oldest
                            </SelectItem>
                            <SelectItem value="asc">
                              Oldest to Newest
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Size:</span>
                        <Select
                          value={sizeP.toString()}
                          onValueChange={(v) => setSizeP(Number(v))}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Product cards with checkbox */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
                      {products?.contents.map((product: ProductAll) => {
                        const isSelected =
                          (updateFormData as DiscountUpdatePro).productCode ===
                          product.code;
                        return (
                          <label
                            key={product.code}
                            className={`relative p-2 border rounded-lg cursor-pointer flex flex-col items-center text-center transition 
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow"
                  : "border-gray-300 hover:border-gray-400"
              }`}
                          >
                            <img
                              src={`https://res.cloudinary.com/dazttnakn/image/upload/c_fill,w_100,h_100/${product.image}`}
                              alt={product.name}
                              className="w-20 h-20 object-cover mb-2 rounded"
                            />
                            <p className="text-sm font-medium line-clamp-2">
                              {product.name}
                            </p>

                            <input
                              type="checkbox"
                              className="absolute top-2 left-2"
                              checked={isSelected}
                              onChange={() => {
                                const value = isSelected ? "" : product.code;
                                setSelectedProductCodeP(value);
                                setUpdateFormData({
                                  ...updateFormData,
                                  productCode: value,
                                });
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>

                    {formErrors.productCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.productCode}
                      </p>
                    )}
                  </div>
                )}
                {updateFormData.discountType === "CODE" && (
                  <div>
                    <Input
                      type="number"
                      placeholder="Usage Limit"
                      value={
                        (updateFormData as DiscountUpdateCo).usageLimit || ""
                      }
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          usageLimit: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                        formErrors.usageLimit ? "border-zinc-500" : ""
                      }`}
                    />
                    {formErrors.usageLimit && (
                      <p className="text-zinc-500 text-xs mt-1">
                        {formErrors.usageLimit}
                      </p>
                    )}
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsUpdateDialogOpen(false);
                      setUpdateFormData({
                        code: "",
                        discountType: "PRODUCT",
                        description: "",
                        discountValue: 0,
                        maxDiscount: 0,
                        startDate: "",
                        endDate: "",
                        isActive: true,
                        productCode: "",
                        discountCode: "",
                        usageLimit: 0,
                      });
                      setFormErrors({});
                    }}
                    className="border-gray-300 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountPage;
