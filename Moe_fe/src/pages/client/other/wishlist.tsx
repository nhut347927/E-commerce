import ProductCard from "@/components/cl-home/product";
import product1 from "../../../assets/img/product/product-1.jpg";
import product2 from "../../../assets/img/product/product-2.jpg";
import product3 from "../../../assets/img/product/product-3.jpg";
import product4 from "../../../assets/img/product/product-4.jpg";

import product5 from "../../../assets/img/product/product-5.jpg";
import product6 from "../../../assets/img/product/product-6.jpg";
import product7 from "../../../assets/img/product/product-7.jpg";
import product8 from "../../../assets/img/product/product-8.jpg";
const Wishlist = () => {
  return (
    <div>
      {/* Breadcrumb Section */}
      <section className="py-8 bg-gray-100 mb-20">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">Wishlist</h4>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <span className="text-sm cursor-pointer">Home</span>
              <span className="text-sm">/</span>
              <span className="text-sm text-gray-400">Wishlist</span>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-32">
        <div className="w-full flex flex-wrap">
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
    </div>
  );
};
export default Wishlist;
