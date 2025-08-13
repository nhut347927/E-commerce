import { useMemo } from "react";
import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";

// Define interface for Instagram data
interface InstagramData {
  platform: string;
  description: string;
  hashtag: string;
  images: string[];
}

interface SettingAll {
  data: string; // JSON string containing InstagramData
}

const Instagram = () => {
  const { toast } = useToast();

  // Fetch Instagram data using useGetApi
  const {
    data: setting,
    loading: isLoading,
    error,
  } = useGetApi<SettingAll>({
    endpoint: "/setting/get",
    params: { code: "5aa102f4-c338-4879-8695-31032e054437" },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  // Parse Instagram data safely
  const instagramData: InstagramData | null = useMemo(() => {
    try {
      return setting?.data ? JSON.parse(setting.data) : null;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to parse Instagram data",
        variant: "destructive",
      });
      return null;
    }
  }, [setting, toast]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-16">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="w-full sm:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square w-full sm:w-60 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
            <div className="w-full sm:w-1/3 flex">
              <div className="my-auto space-y-4">
                <div className="h-8 w-40 bg-gray-200 rounded" />
                <div className="h-16 w-full bg-gray-200 rounded" />
                <div className="h-6 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !instagramData) {
    return (
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-16 text-center">
          <p className="text-red-600 text-lg">Unable to load Instagram data.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-16">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {instagramData.images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square w-full bg-center bg-cover rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={img}
                    alt={`Instagram post ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-1/3 flex">
            <div className="my-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                {instagramData.platform}
              </h2>
              <p className="text-gray-700 text-sm sm:text-base mt-4 sm:mt-6 mb-8 sm:mb-12">
                {instagramData.description}
              </p>
              <h3 className="text-xl sm:text-2xl text-red-600 font-normal">
                {instagramData.hashtag}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instagram;
