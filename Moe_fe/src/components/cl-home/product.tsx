import { ArrowRightLeft, Heart, Search } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  img: string;
  label?: string;
  rating: number;
}

const ProductCard = ({ name, price, img, label, rating }: ProductCardProps) => {
  return (
    <div className="group w-full sm:w-1/2 lg:w-1/3 pe-0 sm:pe-4 mb-8">
      <div className="relative overflow-hidden">
        <img
          src={img}
          alt={name}
          className="aspect-square w-full  object-cover group-hover:scale-105 transition duration-300"
        />
        {label && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
            {label}
          </span>
        )}
        <ul className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <li className="w-12 h-12 bg-zinc-100 flex justify-center items-center">
            <Heart className="w-5 h-5 mt-1 cursor-pointer hover:opacity-75" />
          </li>
          <li className="w-12 h-12 bg-zinc-100 flex justify-center items-center">
            <ArrowRightLeft className="w-6 h-6 cursor-pointer hover:opacity-75" />
          </li>
          <li className="w-12 h-12 bg-zinc-100 flex justify-center items-center">
            <Search className="w-6 h-6 cursor-pointer hover:opacity-75" />
          </li>
        </ul>
      </div>
      <div className="mt-4">
        <h6 className="h-6 text-gray-800 font-medium group-hover:hidden">
          {name}
        </h6>
        <span className="h-6 text-red-500 font-medium hidden group-hover:block transition-opacity duration-300 cursor-pointer">
          + Add to Cart
        </span>
        <div className="flex space-x-1 mt-2">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={index < rating ? "text-yellow-500" : "text-gray-300"}
            >
              ★
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          <h5 className="text-gray-700 font-semibold">${price.toFixed(2)}</h5>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <label className="w-4 h-4 bg-gray-300 rounded-full cursor-pointer"></label>
            <label className="w-4 h-4 bg-black rounded-full cursor-pointer"></label>
            <label className="w-4 h-4 bg-gray-500 rounded-full cursor-pointer"></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
