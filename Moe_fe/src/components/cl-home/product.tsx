import { formatVnPrice } from "@/common/lib/utils";
import { ArrowRightLeft, Heart, Search } from "lucide-react";

interface ProductCardProps {
  code: string;
  name: string;
  price: number;
  img: string;
  rating: number;
  liked: Boolean;
  isDiscount: Boolean;
  discountValue?: number;
  discountPrice?: number;
  colorOne?: string;
  colorTwo?: string;
  colorThree?: string;
  onToggleWishlist?: (code: string) => void;
}

const ProductCard = (prop: ProductCardProps) => {
  return (
    <div className="group w-full">
      <div className="relative overflow-hidden">
        <img
          src={`https://res.cloudinary.com/dazttnakn/image/upload/${prop.img}`}
          alt={prop.name}
          className="aspect-square w-full object-cover group-hover:scale-105 transition duration-300"
        />
        {prop.isDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold text-center">
            SALE <br />
            {prop.discountValue
              ? parseFloat(prop.discountValue.toString()).toFixed(0)
              : ""}
            %
          </span>
        )}
        <ul className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <li
            onClick={() => prop.onToggleWishlist?.(prop.code)}
            className={`w-12 h-12 bg-zinc-100  flex justify-center items-center`}
          >
            <Heart
              className={`w-5 h-5 mt-1 ${
                prop.liked ? "fill-red-600 text-red-600" : ""
              } cursor-pointer hover:opacity-75`}
            />
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
        {/* group-hover:hidden */}
        <h6 className="h-6 text-gray-800 font-medium ">{prop.name}</h6>
        {/* <span
          onClick={() => prop.onAddToCart?.(prop.code)}
          className="h-6 text-red-500 font-medium hidden group-hover:block transition-opacity duration-300 cursor-pointer"
        >
          + Add to Cart
        </span> */}
        <div className="flex space-x-1 mt-2">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={
                index < prop.rating ? "text-yellow-500" : "text-gray-300"
              }
            >
              ★
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          <h5 className="text-gray-700 font-semibold">
            {formatVnPrice(
              prop.discountPrice ? prop.discountPrice : prop.price
            )}
          </h5>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {prop.colorOne && (
              <label
                style={{ backgroundColor: prop.colorOne }}
                className="w-4 h-4 rounded-full cursor-pointer"
              ></label>
            )}
            {prop.colorTwo && (
              <label
                style={{ backgroundColor: prop.colorTwo }}
                className="w-4 h-4 rounded-full cursor-pointer"
              ></label>
            )}
            {prop.colorThree && (
              <label
                style={{ backgroundColor: prop.colorThree }}
                className="w-4 h-4 rounded-full cursor-pointer"
              ></label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
