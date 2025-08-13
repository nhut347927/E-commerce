import { useState, useEffect, useRef } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Loader2,
  Plus,
  Save,
  Trash,
  Eraser,
  RefreshCw,
  Upload,
  Clipboard,
  Eye,
} from "lucide-react";
import axiosInstance from "@/services/axios/axios-instance";
import { Page, ResponseAPI } from "@/common/hooks/type";
import { SettingAll, SettingCreate, SettingUpdate } from "../type";
import { formatDateTime } from "@/common/lib/utils";

const SettingPage = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("desc");
  const [editingSetting, setEditingSetting] =
    useState<Partial<SettingAll> | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSetting, setNewSetting] = useState<SettingCreate>({
    name: "",
    data: "{}",
    description: "",
    isActive: true,
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loadingImg, setLoadingImg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewDetail, setViewDetail] = useState<string | null>(null);
  const closeDetail = () => {
    setViewDetail(null);
  };
  const {
    data: settingsPage,
    loading,
    error,
    refetch,
  } = useGetApi<Page<SettingAll>>({
    endpoint: "/setting",
    params: { q: query, page, size, sort },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(0);
  };

  const handleEdit = (setting: SettingAll) => {
    setEditingSetting({ ...setting });
  };

  const handleCancelEdit = () => {
    setEditingSetting(null);
  };

  const handleSave = async (code: string) => {
    if (!editingSetting) return;

    try {
      const update: SettingUpdate = {
        code,
        name: editingSetting.name || "",
        data: editingSetting.data || "{}",
        description: editingSetting.description || "",
        isActive: editingSetting.isActive ?? true,
      };

      // Validate JSON
      JSON.parse(update.data);

      const res = await axiosInstance.put<ResponseAPI<SettingAll>>(
        "/setting",
        update
      );
      if (res.data.code === 200) {
        toast({
          title: "Success",
          description: "Setting updated successfully",
        });
        setEditingSetting(null);
        refetch();
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const handleDisable = async (code: string) => {
    try {
      const res = await axiosInstance.post<ResponseAPI<string>>(
        "/setting/disable",
        { code }
      );
      if (res.data.code === 200) {
        toast({
          title: "Success",
          description: "Setting disabled successfully",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to disable setting",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async () => {
    try {
      // Validate JSON
      JSON.parse(newSetting.data);

      const res = await axiosInstance.post<ResponseAPI<SettingAll>>(
        "/setting",
        newSetting
      );
      if (res.data.code === 200) {
        toast({
          title: "Success",
          description: "Setting created successfully",
        });
        setIsCreateDialogOpen(false);
        setNewSetting({
          name: "",
          data: "{}",
          description: "",
          isActive: true,
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create setting",
        variant: "destructive",
      });
    }
  };

  const handleJsonChange = (value: string, isEdit: boolean) => {
    try {
      JSON.parse(value); // Validate JSON
      if (isEdit) {
        setEditingSetting((prev) => (prev ? { ...prev, data: value } : null));
      } else {
        setNewSetting((prev) => ({ ...prev, data: value }));
      }
    } catch {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Chuyển file thành base64
    const convertFileToBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64 = await convertFileToBase64(file);

    // Gửi lên server
    const res = await axiosInstance.post("/files/upload/images", {
      base64,
    });

    // Giả sử API trả về publicId
    const publicId = res.data.data;

    // Trả về URL đầy đủ của ảnh
    return `https://res.cloudinary.com/dazttnakn/image/upload/${publicId}`;
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setLoadingImg(true);
      try {
        const url = await uploadImage(event.target.files[0]);
        setImageUrl(url);
      } catch (error) {
        alert("Upload failed. Please try again.");
      }
      setLoadingImg(false);
    }
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings Management</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            {imageUrl && (
              <div className="flex items-center space-x-2">
                <span className="inline-block truncate text-blue-600 underline">
                 <a href={imageUrl}>
                   {imageUrl}
                 </a>
                </span>

                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(imageUrl)}
                  className="border-gray-300 rounded-lg"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy Data
                </Button>
              </div>
            )}
            <Button onClick={handleButtonClick}>
              <Upload className="mr-2 h-4 w-4" />{" "}
              {loadingImg ? "Uploading..." : "Upload Img"}
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Setting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Setting</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new setting.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-name">Name</Label>
                  <Input
                    id="new-name"
                    value={newSetting.name}
                    onChange={(e) =>
                      setNewSetting((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="new-description">Description</Label>
                  <Input
                    id="new-description"
                    value={newSetting.description}
                    onChange={(e) =>
                      setNewSetting((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="new-data">Data (JSON)</Label>
                  <Textarea
                    id="new-data"
                    value={newSetting.data}
                    onChange={(e) => handleJsonChange(e.target.value, false)}
                    rows={6}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-active"
                    checked={newSetting.isActive}
                    onCheckedChange={(checked) =>
                      setNewSetting((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                  <Label htmlFor="new-active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search settings..."
            value={query}
            onChange={handleSearch}
            className="border-gray-300 rounded-lg text-gray-700 focus:ring-zinc-500"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuery("")}
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : settingsPage?.contents.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsPage.contents.map((setting) => (
            <Card key={setting.code} className="shadow-none">
              <CardHeader>
                <CardTitle>
                  {editingSetting?.code === setting.code ? (
                    <Input
                      value={editingSetting.name}
                      onChange={(e) =>
                        setEditingSetting((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                  ) : (
                    setting.name
                  )}
                </CardTitle>
                <CardDescription>
                  {editingSetting?.code === setting.code ? (
                    <Input
                      value={editingSetting.description}
                      onChange={(e) =>
                        setEditingSetting((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                    />
                  ) : (
                    setting.description
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Data (JSON)</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setViewDetail(setting.data)}
                        className="border-gray-300 rounded-lg"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(setting.data)}
                        className="border-gray-300 rounded-lg"
                      >
                        <Clipboard className="w-4 h-4 mr-2" />
                        Copy Data
                      </Button>
                    </div>
                  </div>
                  {editingSetting?.code === setting.code ? (
                    <Textarea
                      value={editingSetting.data}
                      onChange={(e) => handleJsonChange(e.target.value, true)}
                      rows={6}
                    />
                  ) : (
                    <pre className="bg-muted p-2 rounded-md overflow-auto max-h-40">
                      {JSON.stringify(JSON.parse(setting.data), null, 2)}
                    </pre>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  {editingSetting?.code === setting.code ? (
                    <Switch
                      checked={editingSetting.isActive}
                      onCheckedChange={(checked) =>
                        setEditingSetting((prev) =>
                          prev ? { ...prev, isActive: checked } : null
                        )
                      }
                    />
                  ) : (
                    <Switch checked={setting.isActive} disabled />
                  )}
                  <Label>Active</Label>
                </div>
                <div className="text-sm text-muted-foreground mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Created by:</span>
                    <span>{setting.userCreateDisplayName}</span>
                    <span className="text-gray-400">at</span>
                    <time dateTime={setting.createAt} className="text-gray-500">
                      {formatDateTime(setting.createAt)}
                    </time>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Updated by:</span>
                    <span>{setting.userUpdateDisplayName}</span>
                    <span className="text-gray-400">at</span>
                    <time dateTime={setting.updateAt} className="text-gray-500">
                      {formatDateTime(setting.updateAt)}
                    </time>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {editingSetting?.code === setting.code ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSave(setting.code)}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(setting.code)}
                      className="border-gray-300 rounded-lg"
                    >
                      <Clipboard className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(setting)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDisable(setting.code)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Disable
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No settings found
        </div>
      )}

      {settingsPage && Number(settingsPage.totalPages) > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (settingsPage.hasPrevious) setPage(page - 1);
                }}
                className={
                  settingsPage.hasPrevious
                    ? ""
                    : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                {page + 1} / {Number(settingsPage.totalPages)}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (settingsPage.hasNext) setPage(page + 1);
                }}
                className={
                  settingsPage.hasNext ? "" : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {/* Detail Dialog */}
      {viewDetail && (
        <Dialog open={!!viewDetail} onOpenChange={closeDetail}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>View Data Setting</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto mb-4">
              <p className="whitespace-pre-wrap break-words">{viewDetail}</p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(viewDetail)}
                className="border-gray-300 rounded-lg"
              >
                <Clipboard className="w-4 h-4 mr-2" />
                Copy Data
              </Button>
              <Button
                onClick={closeDetail}
                className="bg-zinc-900 hover:bg-zinc-900/70 text-white rounded-lg"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SettingPage;
