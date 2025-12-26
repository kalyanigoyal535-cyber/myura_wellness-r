import { useEffect, useState } from "react";
import { Copy, Tag, Sparkles, Loader2 } from "lucide-react";
import { couponsApi, Coupon } from "../../services/coupons";

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await couponsApi.getActiveCoupons();
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setCoupons(data);
      } else {
        console.warn("Unexpected coupons data format:", data);
        setCoupons([]);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      setError(err instanceof Error ? err.message : "Failed to load coupons");
      setCoupons([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon copied: ${code}`);
  };

  const formatOffer = (coupon: Coupon): string => {
    if (coupon.discount_type === "percentage") {
      return `✨ Flat ${coupon.discount_value}% OFF`;
    } else {
      return `✨ Flat ₹${coupon.discount_value} OFF`;
    }
  };

  const formatDescription = (coupon: Coupon): string => {
    if (coupon.min_order_amount > 0) {
      return `Valid on all products above ₹${coupon.min_order_amount}`;
    }
    return coupon.description || "Valid on all products";
  };

  const formatExpiry = (coupon: Coupon): string => {
    const validTo = new Date(coupon.valid_to);
    const today = new Date();

    if (validTo < today) {
      return "Expired";
    }

    return `Valid till ${validTo.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  };

  const getCouponColor = (index: number): string => {
    const colors = [
      "#5BD4C5",
      "#FFB547",
      "#FF6B81",
      "#9B59B6",
      "#3498DB",
      "#E74C3C",
    ];
    return colors[index % colors.length];
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#1E2738]" size={32} />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCoupons}
            className="px-4 py-2 bg-[#1E2738] text-white rounded-lg hover:bg-[#2D3748] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Coupon Cards */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {coupons.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Tag size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                No active coupons available at the moment
              </p>
            </div>
          ) : (
            coupons.map((coupon, i) => {
              const color = getCouponColor(i);
              return (
                <div
                  key={coupon.id}
                  className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 bg-white flex flex-col gap-3 relative border"
                  style={{ borderColor: color + "30" }} // subtle border tint
                >
                  {/* Tag */}
                  <div
                    className="absolute -top-3 right-3 px-3 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: color }}
                  >
                    Coupon
                  </div>

                  {/* Offer */}
                  <h3 className="text-lg md:text-xl font-semibold text-[#1E2738]">
                    {formatOffer(coupon)}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {formatDescription(coupon)}
                  </p>

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
                  <p className="text-xs text-gray-500">
                    {formatExpiry(coupon)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

export default Coupons;
