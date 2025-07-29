import React from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const ShopSlider = () => {

    const colors = ['#FF0000', '#0000FF', '#808080', '#FFA500', '#008000', '#FFC0CB', '#800080', '#FFFF00', '#A52A2A']
  return (
    <div className="space-y-8 text-sm">
      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Search products..."
          className="w-full rounded-none border border-zinc-300 focus:ring-2 focus:ring-red-500 focus:outline-none text-zinc-700"
        />
        <Button
          type="submit"
          variant="outline"
          className="rounded-none bg-white border-zinc-300 hover:bg-red-500 hover:text-white transition"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Accordion Filters */}
      <Accordion
        type="multiple"
        defaultValue={[
          "categories",
          "branding",
          "price",
          "size",
          "color",
          "tags",
        ]}
        className="w-full space-y-2"
      >
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Categories
          </AccordionTrigger>
          <AccordionContent className="max-h-52 overflow-y-auto pt-1">
            <ul className="space-y-2">
              {[
                "Men",
                "Women",
                "Bags",
                "Clothing",
                "Shoes",
                "Accessories",
                "Kids",
              ].map((cat, idx) => (
                <li key={idx}>
                  <span className="block text-[14px] text-zinc-400 hover:text-zinc-900 transition cursor-pointer">
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Branding */}
        <AccordionItem value="branding">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Branding
          </AccordionTrigger>
          <AccordionContent className="max-h-48 overflow-y-auto pt-1">
            <ul className="space-y-2">
              {["Louis Vuitton", "Chanel", "Hermes", "Gucci"].map(
                (brand, idx) => (
                  <li key={idx}>
                    <span className="block text-[14px] text-zinc-400 hover:text-zinc-900 transition cursor-pointer">
                      {brand}
                    </span>
                  </li>
                )
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Filter Price
          </AccordionTrigger>
          <AccordionContent className="max-h-48 overflow-y-auto pt-1">
            <ul className="space-y-2">
              {[
                "$0 - $50",
                "$50 - $100",
                "$100 - $150",
                "$150 - $200",
                "$200 - $250",
                "$250+",
              ].map((p, idx) => (
                <li key={idx}>
                  <span className="block text-[14px] text-zinc-400 hover:text-zinc-900 transition cursor-pointer">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Size
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-4 gap-2">
              {["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  className="text-[13px] px-2 py-1 rounded-none text-zinc-700 border-zinc-300 hover:bg-zinc-900 hover:text-white transition"
                >
                  {size}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors */}
        <AccordionItem value="color">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Colors
          </AccordionTrigger>
          <AccordionContent className="pt-2">
             <RadioGroup className="grid grid-cols-5 gap-2">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center justify-center mb-2">
                  <RadioGroupItem
                    value={`c-${index}`}
                    id={`sp-${index}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`sp-${index}`}
                    className="w-8 h-8 rounded-full cursor-pointer ring-zinc-300 hover:ring-4 transition-all duration-200"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags">
          <AccordionTrigger className="uppercase text-base text-zinc-800 tracking-wide font-semibold hover:text-red-500 transition">
            Tags
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-wrap gap-2">
              {[
                "Product",
                "Bags",
                "Shoes",
                "Fashion",
                "Clothing",
                "Hats",
                "Accessories",
              ].map((tag, index) => (
                <Button
                  key={index}
                  className="text-[13px] px-3 py-1 bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white rounded-full transition"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ShopSlider;
