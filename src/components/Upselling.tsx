import React from "react";
import { useCart } from "../context/CartContext";
import { productCatalog } from "../data/products";

const Upselling = () => {
  //   const { addToCart } = useCart();

  // show only first 4 products or filter based on logic
  const upsellItems = productCatalog;

  return (
    <div className="w-full col-span-full mt-10 bg-gradient-to-b from-[#1C273A] via-[#2F3E52] to-[#3E4F65] p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-6 px-4 text-white ">Customers Also Bought</h2>

      <div className="flex gap-4 overflow-x-auto px-4 pb-3 hide-scrollbar">
        {upsellItems.map((item) => (
          <div
            key={item.id}
            className="relative min-w-[150px] max-w-[150px] bg-white 
                   border rounded-xl shadow-sm hover:shadow-md 
                   transition p-4 overflow-hidden"
          >
            {item.originalPrice && (
              <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                {Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) * 100
                )}
                % off
              </span>
            )}

            <img
              src={item.image?.fallback}
              alt={item.name}
              className="w-full h-40 object-contain"
            />
            <div className="flex flex-col justify-between h-28">
              <h3 className="text-sm font-medium line-clamp-2 min-h-[40px]">
                {item.name}
              </h3>

              <p className="text-lg font-semibold">₹ {item.price}</p>

              <button className="w-full bg-[#1C273A] text-white py-1.5 rounded text-sm font-semibold">
                ADD
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upselling;
