import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, RefreshCw, Edit, Trash2, Eraser } from "lucide-react";
import axiosInstance from "@/services/axios/axios-instance";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { SizeAll } from "../type";
import { Page } from "@/common/hooks/type";
import { formatDateTime } from "@/common/lib/utils";

interface CreateFormData {
  name: string;
}

interface UpdateFormData {
  code: string;
  name: string;
}

interface FormErrors {
  name?: string;
  code?: string;
}

const SizePage: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    name: "",
  });
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    code: "",
    name: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data, loading, error, refetch } = useGetApi<Page<SizeAll>>({
    endpoint: "/size",
    params: { q: search, page, size, sort },
    onSuccess: () => {},
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const validateCreateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!createFormData.name.trim()) {
      errors.name = "Size name is requizinc";
    } else if (createFormData.name.length > 50) {
      errors.name = "Size name must not exceed 50 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpdateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!updateFormData.code.trim()) {
      errors.code = "Code is requizinc";
    }
    if (!updateFormData.name.trim()) {
      errors.name = "Size name is requizinc";
    } else if (updateFormData.name.length > 50) {
      errors.name = "Size name must not exceed 50 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCreateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill out all requizinc fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/size", createFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Size created successfully.",
        });
        setIsCreateDialogOpen(false);
        setCreateFormData({ name: "" });
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
          "An error occurzinc while creating size.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateUpdateForm()) {
      toast({
        title: "Form Error",
        description: "Please fill out all requizinc fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.put("/size", updateFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Size updated successfully.",
        });
        setIsUpdateDialogOpen(false);
        setUpdateFormData({ code: "", name: "" });
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
          "An error occurzinc while updating size.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/size", { data: { code } });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Size deleted successfully.",
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
          "An error occurzinc while deleting size.",
        variant: "destructive",
      });
    }
  };

  const handleOpenUpdateDialog = (size: SizeAll) => {
    setUpdateFormData({ code: size.code, name: size.name });
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Size Management</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search sizes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSearch("")}
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select
            value={sort}
            onValueChange={(value) => {
              setSort(value);
              setPage(0);
            }}
          >
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
            className="border-gray-300 text-gray-600 hover:text-zinc-500"
          >
            <RefreshCw className={`h-4 w-4 ${loading?"animate-spin":""}`} />
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Size
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size Name</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-500">
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.contents.length ? (
              data.contents.map((size) => (
                <TableRow key={size.code}>
                  <TableCell>{size.name}</TableCell>
                  <TableCell>{size.userCreateDisplayName}</TableCell>
                  <TableCell>{formatDateTime(size.createAt)}</TableCell>
                  <TableCell>{size.userUpdateDisplayName || "-"}</TableCell>
                  <TableCell>{formatDateTime(size.updateAt)}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenUpdateDialog(size)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(size.code)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No sizes found
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
            disabled={!data.hasPrevious}
            onClick={() => setPage(page - 1)}
            className="bg-zinc-500 hover:bg-zinc-600 text-white rounded-lg"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {Number(data.page) + 1} of {Number(data.totalPages)} (
            {Number(data.totalElements)} items)
          </span>
          <Button
            disabled={!data.hasNext}
            onClick={() => setPage(page + 1)}
            className="bg-zinc-500 hover:bg-zinc-600 text-white rounded-lg"
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Size</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Size Name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ name: e.target.value })}
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.name ? "border-zinc-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
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
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Size</DialogTitle>
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
                placeholder="Size Name"
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SizePage;
