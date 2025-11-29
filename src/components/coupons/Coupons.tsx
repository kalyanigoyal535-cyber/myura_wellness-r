import React from "react";
import { Copy, Tag, Sparkles } from "lucide-react";

const Coupons = () => {
  const coupons = [
    {
      code: "MYURA30",
      offer: "✨ Flat 30% OFF",
      description: "Valid on all products above ₹999",
      expiry: "Valid till 31 Jan 2026",
      color: "#5BD4C5",
    },
    {
      code: "FREESHIP",
      offer: "🚚 Free Shipping",
      description: "Applicable on orders above ₹499",
      expiry: "No expiry",
      color: "#FFB547",
    },
    {
      code: "FIRST10",
      offer: "🎉 10% OFF First Order",
      description: "Only once per new customer",
      expiry: "Valid till 30 Apr 2025",
      color: "#FF6B81",
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon copied: ${code}`);
  };

  return (
    <section className="w-full py-10 px-4 md:px-8 bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <Sparkles className="mx-auto text-[#1E2738] w-6 h-6 mb-2" />
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1E2738]">
          Exclusive Coupons
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Grab your discount codes and save big on your wellness journey.
        </p>
      </div>

      {/* Coupon Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {coupons.map((coupon, i) => (
          <div
            key={i}
            className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 bg-white flex flex-col gap-3 relative border"
            style={{ borderColor: coupon.color + "30" }} // subtle border tint
          >
            {/* Tag */}
            <div
              className="absolute -top-3 right-3 px-3 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: coupon.color }}
            >
              Coupon
            </div>

            {/* Offer */}
            <h3 className="text-lg md:text-xl font-semibold text-[#1E2738]">
              {coupon.offer}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600">{coupon.description}</p>

            {/* Coupon code box */}
            <div className="flex justify-between items-center bg-[#F8F8F8] p-3 rounded-md border border-gray-200">
              <span className="font-mono text-sm">{coupon.code}</span>
              <button
                onClick={() => handleCopy(coupon.code)}
                className="hover:bg-gray-200 rounded p-2 transition"
              >
                <Copy size={16} />
              </button>
            </div>

            {/* Expiry */}
            <p className="text-xs text-gray-500">{coupon.expiry}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Coupons;
