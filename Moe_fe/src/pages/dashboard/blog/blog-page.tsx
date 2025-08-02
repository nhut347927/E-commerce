import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { BlogAll } from "../type";
import { Page } from "@/common/hooks/type";
import { formatDateTime } from "@/common/lib/utils";
import { convertFileToBase64 } from "@/common/lib/utils";

interface CreateFormData {
  title: string;
  image: string;
  description: string;
}

interface UpdateFormData {
  code: string;
  title: string;
  image: string;
  description: string;
}

interface FormErrors {
  title?: string;
  image?: string;
  description?: string;
  code?: string;
}

const BlogPage: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    title: "",
    image: "",
    description: "",
  });
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    code: "",
    title: "",
    image: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data, loading, error, refetch } = useGetApi<Page<BlogAll>>({
    endpoint: "/blog/all",
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
    if (!createFormData.title.trim()) {
      errors.title = "Title is required";
    } else if (createFormData.title.length > 100) {
      errors.title = "Title must not exceed 100 characters";
    }
    if (!createFormData.image) {
      errors.image = "Image is required";
    }
    if (!createFormData.description.trim()) {
      errors.description = "Description is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpdateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!updateFormData.code.trim()) {
      errors.code = "Code is required";
    }
    if (!updateFormData.title.trim()) {
      errors.title = "Title is required";
    } else if (updateFormData.title.length > 100) {
      errors.title = "Title must not exceed 100 characters";
    }
    if (!updateFormData.image) {
      errors.image = "Image is required";
    }
    if (!updateFormData.description.trim()) {
      errors.description = "Description is required";
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
      throw new Error(
        err.response?.data?.message || "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleUpdateImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await axiosInstance.post("/blog", {
        title: createFormData.title,
        image: createFormData.image,
        description: createFormData.description,
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Blog created successfully.",
        });
        setIsCreateDialogOpen(false);
        setCreateFormData({ title: "", image: "", description: "" });
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
          "An error occurred while creating blog.",
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
      const response = await axiosInstance.put("/blog", {
        code: updateFormData.code,
        title: updateFormData.title,
        image: updateFormData.image,
        description: updateFormData.description,
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Blog updated successfully.",
        });
        setIsUpdateDialogOpen(false);
        setUpdateFormData({ code: "", title: "", image: "", description: "" });
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
          "An error occurred while updating blog.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (code: string) => {
    try {
      const response = await axiosInstance.delete("/blog", {
        data: { code },
      });
      if (response.data.code === 200) {
        toast({
          title: "Success",
          description: "Blog deleted successfully.",
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
          "An error occurred while deleting blog.",
        variant: "destructive",
      });
    }
  };

  const handleOpenUpdateDialog = (blog: BlogAll) => {
    setUpdateFormData({
      code: blog.code,
      title: blog.title,
      image: blog.image,
      description: blog.description,
    });
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog Management</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search blogs..."
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
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Blog
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stt</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Description</TableHead>
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
                <TableCell colSpan={9} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-zinc-500">
                  Error: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.contents.length ? (
              data.contents.map((blog, index) => (
                <TableRow key={blog.code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{blog.title}</TableCell>
                  <TableCell>
                    <img
                      src={`https://res.cloudinary.com/dazttnakn/image/upload/${blog.image}`}
                      alt={blog.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate">{blog.description}</TableCell>
                  <TableCell>{blog.userCreateDisplayName}</TableCell>
                  <TableCell>{formatDateTime(blog.createAt)}</TableCell>
                  <TableCell>{blog.userUpdateDisplayName || "-"}</TableCell>
                  <TableCell>{formatDateTime(blog.updateAt)}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenUpdateDialog(blog)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(blog.code)}
                      className="border-gray-300 text-gray-600 hover:text-zinc-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No blogs found
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
            <DialogTitle>Create New Blog</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Title"
                value={createFormData.title}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, title: e.target.value })
                }
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.title ? "border-zinc-500" : ""
                }`}
              />
              {formErrors.title && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.title}</p>
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
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/${createFormData.image}`}
                  alt="Selected blog image"
                  className="h-12 w-12 object-cover rounded mt-2"
                />
              )}
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={createFormData.description}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    description: e.target.value,
                  })
                }
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.description ? "border-zinc-500" : ""
                }`}
                rows={4}
              />
              {formErrors.description && (
                <p className="text-zinc-500 text-xs mt-1">
                  {formErrors.description}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setCreateFormData({ title: "", image: "", description: "" });
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Blog</DialogTitle>
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
                placeholder="Title"
                value={updateFormData.title}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    title: e.target.value,
                  })
                }
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.title ? "border-zinc-500" : ""
                }`}
              />
              {formErrors.title && (
                <p className="text-zinc-500 text-xs mt-1">{formErrors.title}</p>
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
                  src={`https://res.cloudinary.com/dazttnakn/image/upload/${updateFormData.image}`}
                  alt="Current blog image"
                  className="h-12 w-12 object-cover rounded mt-2"
                />
              )}
            </div>
            <div>
              <Textarea
                placeholder="Description"
                value={updateFormData.description}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    description: e.target.value,
                  })
                }
                className={`border-gray-300 rounded-lg focus:ring-zinc-500 ${
                  formErrors.description ? "border-zinc-500" : ""
                }`}
                rows={4}
              />
              {formErrors.description && (
                <p className="text-zinc-500 text-xs mt-1">
                  {formErrors.description}
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
                    title: "",
                    image: "",
                    description: "",
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

export default BlogPage;