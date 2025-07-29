import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import hero1 from "../../assets/img/hero/hero-1.jpg";
import hero2 from "../../assets/img/hero/hero-2.jpg";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [{ image: hero1 }, { image: hero2 }];
  const autoSlideInterval = 5000; // 5 seconds

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
    const timer = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(timer);
  }, []);

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
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="w-full max-h-screen h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
              <div className="text-white">
                <h6
                  className="text-red-400 text-xs font-bold
 uppercase tracking-widest mb-10"
                >
                  Summer Collection
                </h6>
                <h2 className="text-black text-5xl font-medium w-1/2 mb-10">
                  Fall - Winter
                   Collections 2030
                </h2>
                <p className="text-black text-base font-sans w-1/2 mb-8">
                  A specialist label creating luxury essentials. Ethically
                  crafted with an unwavering commitment to exceptional quality.
                </p>
                <button className="bg-black text-white text-sm uppercase font-semibold px-12 py-4 tracking-widest items-center hover:bg-gray-900 transition">
                  Shop now <span className="ml-2">→</span>
                </button>
             
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-20 top-1/2 transform -translate-y-1/2  z-30"
      >
        <ArrowLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-20 top-1/2 transform -translate-y-1/2  z-30"
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
