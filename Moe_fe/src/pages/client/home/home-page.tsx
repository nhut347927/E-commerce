import product1 from "../../../assets/img/product/product-1.jpg";
import product2 from "../../../assets/img/product/product-2.jpg";
import product3 from "../../../assets/img/product/product-3.jpg";
import product4 from "../../../assets/img/product/product-4.jpg";

import product5 from "../../../assets/img/product/product-5.jpg";
import product6 from "../../../assets/img/product/product-6.jpg";
import product7 from "../../../assets/img/product/product-7.jpg";
import product8 from "../../../assets/img/product/product-8.jpg";
import Carousel from "@/components/cl-home/carousel";
import Banner from "@/components/cl-home/banner";
import ProductCard from "@/components/cl-home/product";
import { useState } from "react";
import Categories from "@/components/cl-home/categories";
import Instagram from "@/components/cl-home/Instagram";
import Blog from "@/components/cl-home/blog";

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const filters = [
    "Best Sellers",
    "New Arrivals",
    "Hot Sales",
    "Featured",
    "Top Rated",
  ];

  return (
    <div className="w-full space-y-20">
      {/* Hero Section */}
      <Carousel />

      {/* Banner Section */}
      <Banner />

      {/* Product Section */}
      <section>
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 ">
          <div className="w-full mb-12">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-4">
              {filters.map((filter, index) => (
                <li
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`cursor-pointer px-4 py-2 text-xl whitespace-nowrap transition 
          ${
            activeIndex === index
              ? "text-gray-900 font-bold border-b-2 border-gray-900"
              : "text-gray-400 font-bold hover:text-gray-900"
          }`}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap">
            {[
              {
                name: "Piqué Biker Jacket",
                price: 67.24,
                img: product1,
                label: "New",
                category: "new-arrivals",
                rating: 0,
              },
              {
                name: "Piqué Biker Jacket",
                price: 67.24,
                img: product2,
                category: "hot-sales",
                rating: 0,
              },
              {
                name: "Multi-pocket Chest Bag",
                price: 43.48,
                img: product3,
                label: "Sale",
                category: "new-arrivals",
                rating: 4,
              },
              {
                name: "Diagonal Textured Cap",
                price: 60.9,
                img: product4,
                category: "hot-sales",
                rating: 0,
              },
              {
                name: "Lether Backpack",
                price: 31.37,
                img: product5,
                category: "new-arrivals",
                rating: 0,
              },
              {
                name: "Ankle Boots",
                price: 98.49,
                img: product6,
                label: "Sale",
                category: "hot-sales",
                rating: 4,
              },
              {
                name: "T-shirt Contrast Pocket",
                price: 49.66,
                img: product7,
                category: "new-arrivals",
                rating: 0,
              },
              {
                name: "Basic Flowing Scarf",
                price: 26.28,
                img: product8,
                category: "hot-sales",
                rating: 0,
              },
            ].map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                price={product.price}
                img={product.img}
                label={product.label}
                rating={product.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Instagram Section */}
      <Instagram />

      {/* Latest Blog Section */}
      <Blog />
    </div>
  );
};

export default HomePage;
