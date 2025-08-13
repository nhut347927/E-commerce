import { useEffect, useState, useCallback, useMemo } from "react";
import productSale from "../../assets/img/product-sale.png";
import { useGetApi } from "@/common/hooks/use-get-api";
import { SettingAll } from "@/pages/dashboard/type";
import { useToast } from "@/common/hooks/use-toast";
import { Link } from "react-router-dom";

interface CarouselItem {
  title: string;
  subtitle: string;
  saleInfo: string;
  dealTitle: string;
  productName: string;
  expiryDate: string;
  cta: string;
  imageUrl: string;
}

const Categories = () => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [top, setTop] = useState<CarouselItem | null>(null);

  const {
    data: setting,
    loading,
    error,
  } = useGetApi<SettingAll>({
    endpoint: "/setting/get",
    params: { code: "08fe638a-0dbe-4da1-9206-373369221111" },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  // Parse slides safely
  const slides: CarouselItem[] = useMemo(() => {
    try {
      return setting?.data ? JSON.parse(setting.data) : [];
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to parse carousel data",
        variant: "destructive",
      });
      return [];
    }
  }, [setting, toast]);

  // Set initial top item when slides are available
  useEffect(() => {
    if (slides.length > 0 && !top) {
      setTop(slides[0]);
    }
  }, [slides, top]);

  // Countdown timer logic
  useEffect(() => {
    const targetDate = top?.expiryDate
      ? new Date(top.expiryDate)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Fallback: 7 days from now

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: Math.max(days, 0),
        hours: Math.max(hours, 0),
        minutes: Math.max(minutes, 0),
        seconds: Math.max(seconds, 0),
      });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, [top]);

  // Memoized click handler
  const handleSlideClick = useCallback(
    (index: number) => {
      if (slides[index]) {
        setTop(slides[index]);
      }
    },
    [slides]
  );

  // Loading state
  if (loading) {
    return (
      <section className="min-h-[80vh] py-10 flex items-center bg-orange-50/50">
        <div className="max-w-7xl w-full h-full mx-auto px-3 sm:px-16">
          <div className="animate-pulse flex flex-col sm:flex-row space-y-20 sm:space-y-0 sm:justify-between items-center">
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-40 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="w-96 h-96 bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded" />
              <div className="h-10 w-64 bg-gray-200 rounded" />
              <div className="flex space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 w-16 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-12 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || slides.length === 0) {
    return (
      <section className="min-h-[80vh] py-10 flex items-center bg-orange-50/50">
        <div className="max-w-7xl w-full h-full mx-auto px-3 sm:px-16 text-center">
          <p className="text-red-600 text-lg">Unable to load carousel data.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] py-10 flex items-center bg-orange-50/50">
      <div className="max-w-7xl w-full h-full flex mx-auto px-4 sm:px-16">
        <div className="w-full h-full flex flex-col sm:flex-row space-y-12 sm:space-y-0 sm:justify-between items-center">
          {/* Slide Navigation */}
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => handleSlideClick(index)}
                className={`block whitespace-nowrap text-2xl sm:text-3xl ${
                  slide.subtitle === top?.subtitle
                    ? "text-zinc-900"
                    : "text-zinc-400"
                } font-bold hover:text-zinc-800 transition-colors`}
                aria-label={`Select ${slide.subtitle}`}
              >
                {slide.subtitle}
              </button>
            ))}
          </div>

          {/* Image Section */}
          <div className="w-full max-w-md">
            <div className="flex justify-center">
              <div className="relative rounded-lg overflow-hidden transition-opacity duration-300">
                <img
                  src={top?.imageUrl || productSale}
                  alt={top?.subtitle || "Product image"}
                  className="w-full max-w-sm sm:max-w-md h-auto object-cover"
                />
                <div className="absolute top-0 right-0 bg-zinc-950 text-white flex justify-center items-center w-20 sm:w-24 h-20 sm:h-24 rounded-full">
                  <div className="text-center">
                    <span className="block text-xs uppercase">Sale Of</span>
                    <h5 className="text-base sm:text-lg font-semibold">
                      {top?.saleInfo || "$29.99"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Info */}
          <div className="text-center sm:text-left">
            <span className="text-sm text-red-600 uppercase tracking-widest font-medium">
              {top?.dealTitle || "Deal Of The Week"}
            </span>
            <h2 className="text-black text-3xl sm:text-4xl font-medium mt-4">
              {top?.productName || "Multi-pocket Chest Bag Black"}
            </h2>

            {/* Countdown Timer */}
            <div className="flex justify-center sm:justify-start text-center space-x-4 mb-4 mt-6">
              <div className="mt-1">
                <span className="text-black text-3xl sm:text-4xl font-medium">
                  {timeLeft.days}
                </span>
                <p className="text-black text-sm sm:text-base font-sans mt-4">
                  Days
                </p>
              </div>
              <p className="text-black text-3xl sm:text-4xl font-medium">:</p>
              <div className="mt-1">
                <span className="text-black text-3xl sm:text-4xl font-medium">
                  {timeLeft.hours}
                </span>
                <p className="text-black text-sm sm:text-base font-sans mt-4">
                  Hours
                </p>
              </div>
              <p className="text-black text-3xl sm:text-4xl font-medium">:</p>
              <div className="mt-1">
                <span className="text-black text-3xl sm:text-4xl font-medium">
                  {timeLeft.minutes}
                </span>
                <p className="text-black text-sm sm:text-base font-sans mt-4">
                  Minutes
                </p>
              </div>
              <p className="text-black text-3xl sm:text-4xl font-medium">:</p>
              <div className="mt-1">
                <span className="text-black text-3xl sm:text-4xl font-medium">
                  {timeLeft.seconds}
                </span>
                <p className="text-black text-sm sm:text-base font-sans mt-4">
                  Seconds
                </p>
              </div>
            </div>
            <Link to={"/shop"}>
              {" "}
              <button
                className="bg-black text-white text-sm uppercase font-semibold px-8 sm:px-12 py-3 sm:py-4 tracking-widest items-center hover:bg-gray-900 transition mt-6"
                aria-label={top?.cta || "Shop now"}
              >
                {top?.cta || "Shop now"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
