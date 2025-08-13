import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/common/hooks/use-toast";
import { useGetApi } from "@/common/hooks/use-get-api";
import { Link } from "react-router-dom";

interface CarouselItem {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const Carousel = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: carousel } = useGetApi<{ data: string }>({
    endpoint: "/setting/get",
    params: { code: "c69acef4-7981-4790-9865-1ed9f5531580" },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const slides: CarouselItem[] = carousel?.data
    ? JSON.parse(carousel.data)
    : [];

  const autoSlideInterval = 5000; // 5s

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, autoSlideInterval);
      return () => clearInterval(timer);
    }
  }, [slides]);

  if (!slides.length) {
    return null; // hoặc loading spinner
  }

  return (
    <section className="max-w-screen w-screen h-screen relative">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            currentSlide === index ? "opacity-100 z-20" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full max-h-screen h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
              <div className="text-white">
                <h6 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-10">
                  {slide.title}
                </h6>
                <h2 className="text-black text-5xl font-medium w-1/2 mb-10">
                  {slide.subtitle}
                </h2>
                <p className="text-black text-base font-sans w-1/2 mb-8">
                  {slide.description}
                </p>
                <Link to={"/shop"}>
                  <button className="bg-black text-white text-sm uppercase font-semibold px-12 py-4 tracking-widest items-center hover:bg-gray-900 transition">
                    Shop now <span className="ml-2">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-20 top-1/2 transform -translate-y-1/2 z-30"
      >
        <ArrowLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-20 top-1/2 transform -translate-y-1/2 z-30"
      >
        <ArrowRight size={24} />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === index ? "bg-white" : "bg-white/40"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
