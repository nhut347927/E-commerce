import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useToast } from "@/common/hooks/use-toast";
import { useGetApi } from "@/common/hooks/use-get-api";
import { Link } from "react-router-dom";

const Banner = () => {
  const { toast } = useToast();
  const { data: res } = useGetApi<any>({
    endpoint: "/setting/get",
    params: { code: "28ad35d2-1713-420d-9241-0db8581b7bce" },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const banners = React.useMemo(() => {
    try {
      return res?.data ? JSON.parse(res.data) : [];
    } catch {
      return [];
    }
  }, [res]);

  if (!banners || banners.length < 3) return null;

  return (
    <section>
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
        <ResizablePanelGroup direction="horizontal" className="w-full border">
          {/* Banner lớn bên trái */}
          <ResizablePanel
            defaultSize={60}
            minSize={30}
            maxSize={70}
            className="h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]"
          >
            <div className="relative group overflow-hidden h-full">
              <img
                src={banners[0].imageUrl}
                alt={banners[0].title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-700" />
              <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-8 md:px-10 text-white z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">
                  {banners[0].subtitle}
                </h2>
                {banners[0].description && (
                  <Link className="mt-4 sm:mt-5" to={"/shop"}>
                    {" "}
                    <span className=" px-5 sm:px-6 py-3 bg-white text-black font-semibold text-xs sm:text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition cursor-pointer">
                      {banners[0].description}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-gray-300 w-1" />

          {/* Cột bên phải gồm 2 banner nhỏ */}
          <ResizablePanel
            defaultSize={40}
            minSize={30}
            maxSize={70}
            className="h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]"
          >
            <ResizablePanelGroup direction="vertical">
              {/* Banner nhỏ 1 */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="relative group h-full overflow-hidden">
                  <img
                    src={banners[1].imageUrl}
                    alt={banners[1].title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-700" />
                  <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 text-white z-10">
                    <h2 className="text-lg sm:text-xl font-semibold drop-shadow-md">
                      {banners[1].subtitle}
                    </h2>
                    {banners[1].description && (
                      <Link to={"/shop"}>
                        {" "}
                        <span className="mt-2 inline-block px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition cursor-pointer">
                          {banners[1].description}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-gray-300 h-1" />

              {/* Banner nhỏ 2 */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="relative group h-full overflow-hidden">
                  <img
                    src={banners[2].imageUrl}
                    alt={banners[2].title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-700" />
                  <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 text-white z-10">
                    <h2 className="text-lg sm:text-xl font-semibold drop-shadow-md">
                      {banners[2].subtitle}
                    </h2>
                    {banners[2].description && (
                      <Link to={"/shop"}>
                        <span className="mt-2 inline-block px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition cursor-pointer">
                          {banners[2].description}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </section>
  );
};

export default Banner;
