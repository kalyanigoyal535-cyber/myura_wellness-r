import React from "react";

const orders = [
  {
    id: 1,
    status: "Canceled",
    date: "Oct 24",
    image: "https://via.placeholder.com/300x300", // Replace with your product image
    itemsCount: 0,
    orderId: "#1035",
    total: "₹0.00 INR",
  },
  {
    id: 2,
    status: "Canceled",
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

const OrdersPage = () => {
  return (
    <div className="min-h-screen  px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden"
          >
            {/* Top Status */}
            <div className="px-5 py-4 bg-gray-50 flex items-center gap-3">
              <div className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="text-xs">✕</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">{order.status}</p>
                <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
              </div>
            </div>

            {/* Product Image */}
            <div className="p-6 bg-[#f7f7f7] flex-1 flex items-center justify-center">
              <img
                src={order.image}
                alt="product"
                className="max-h-64 object-contain"
              />
            </div>

            {/* Bottom Details */}
            <div className="px-5 py-4 border-t border-gray-100 text-sm">
              <p className="font-semibold text-gray-800">
                {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Order {order.orderId}</p>

              <p className="mt-4 font-semibold text-gray-900">{order.total}</p>

              <button
                className="mt-4 w-full rounded-lg border border-emerald-700 text-emerald-700 font-semibold text-sm py-2 hover:bg-emerald-50 transition"
                onClick={() => console.log("Buy again clicked", order.orderId)}
              >
     View More 
              </button>
              <button
                className="mt-4 w-full rounded-lg border border-emerald-700 text-emerald-700 font-semibold text-sm py-2 hover:bg-emerald-50 transition"
                onClick={() => console.log("Buy again clicked", order.orderId)}
              >
                Buy again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
