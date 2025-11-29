import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const orders = [
  {
    id: 1,
    status: "Canceled",
    date: "Oct 24",
    image: "https://via.placeholder.com/300x300",
    itemsCount: 0,
    orderId: "#1035",
    total: "₹0.00 INR",
  },
  {
    id: 2,
    status: "Completed",
    date: "Oct 15",
    image: "https://via.placeholder.com/300x300",
    itemsCount: 0,
    orderId: "#1030",
    total: "₹0.00 INR",
  },
  {
    id: 3,
    status: "Canceled",
    date: "Oct 15",
    image: "https://via.placeholder.com/300x300",
    itemsCount: 0,
    orderId: "#1029",
    total: "₹0.00 INR",
  },
];

const OrderCard = () => {
const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">Orders</h1>

      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden"
          >
            {/* Top Status */}
            <div className="px-4 py-3 bg-gray-50 flex items-center gap-3">
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{order.status}</p>
                <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
              </div>
            </div>

            {/* Product Image */}
            <div className="w-full aspect-square bg-gray-100">
              <img
                src="/Final Images/Bons &  Joints/main.png"
                alt="Bons & Joints"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Section */}
            <div className="px-4 py-4 text-sm">
              <p className="font-semibold text-gray-800">
                {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Order {order.orderId}
              </p>

              <p className="mt-4 font-semibold text-[#1C2638]">{order.total}</p>

              <div className="mt-4 space-y-3">
                <button
                  className="w-full rounded-lg border border-[#1C2638] text-[#1C2638] font-semibold text-sm py-2 hover:bg-[#dee0e3] transition"
                  onClick={() => navigate("/order-details/12345")}
                >
                  View Details
                </button>
                <button className="w-full rounded-lg border border-[#1C2638] text-[#1C2638] font-semibold text-sm py-2 hover:bg-[#dee0e3] transition">
                  Buy Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
