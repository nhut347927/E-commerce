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
import { ColorAll } from "../type";
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

const ColorPage: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [color, setColor] = useState<number>(10);
  const [sort, setSort] = useState<string>("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    name: "#000000",
  });
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    code: "",
    name: "#000000",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { data, loading, error, refetch } = useGetApi<Page<ColorAll>>({
    endpoint: "/color",
    params: { q: search, page, color, sort },
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
    if (!createFormData.name.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.name = "Please select a valid color";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpdateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!updateFormData.code.trim()) {
      errors.code = "Code is required";
    }
    if (!updateFormData.name.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.name = "Please select a valid color";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCreateForm()) {
      toast({
        title: "Form Error",
        description: "Please select a valid color.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/color", createFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Color created successfully.",
        });
        setIsCreateDialogOpen(false);
        setCreateFormData({ name: "#000000" });
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
          "An error occurred while creating Color.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateUpdateForm()) {
      toast({
        title: "Form Error",
        description: "Please select a valid color.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axiosInstance.put("/color", updateFormData);
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Color updated successfully.",
        });
        setIsUpdateDialogOpen(false);
        setUpdateFormData({ code: "", name: "#000000" });
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
          "An error occurred while updating Color.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/color", { data: { code } });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Color deleted successfully.",
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
          "An error occurred while deleting Color.",
        variant: "destructive",
      });
    }
  };

  const handleOpenUpdateDialog = (color: ColorAll) => {
    setUpdateFormData({ code: color.code, name: color.name });
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Color Management
      </h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search colors..."
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
            value={color.toString()}
            onValueChange={(value) => {
              setColor(Number(value));
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
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Color
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stt</TableHead>
              <TableHead>Color</TableHead>
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
              data.contents.map((color, index) => (
                <TableRow key={color.code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="flex items-center space-x-2 mt-3">
                    <span
                      className="h-8 w-8 rounded-full border-2"
                      style={{ backgroundColor: color.name }}
                    ></span>
                    <span>Color code: {color.name}</span>
                  </TableCell>
                  <TableCell>{color.userCreateDisplayName}</TableCell>
                  <TableCell>{formatDateTime(color.createAt)}</TableCell>
                  <TableCell>{color.userUpdateDisplayName || "-"}</TableCell>
                  <TableCell>{formatDateTime(color.updateAt)}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenUpdateDialog(color)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(color.code)}
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
                  No colors found
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
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
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
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Color</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Input
                type="color"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ name: e.target.value })}
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 h-10 w-full ${
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
            <DialogTitle>Update Color</DialogTitle>
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
                type="color"
                value={updateFormData.name}
                onChange={(e) =>
                  setUpdateFormData({ ...updateFormData, name: e.target.value })
                }
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 h-10 w-full ${
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

export default ColorPage;
