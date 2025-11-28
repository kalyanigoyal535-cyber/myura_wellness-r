import React from "react";
import { useParams, Link } from "react-router-dom";

type Props = {};

const OrderDetails: React.FC<Props> = () => {
  const { id } = useParams<{ id: string }>();

  // 🔹 Mock data for now – replace with real data later
  const order = {
    number: id || "1030",
    status: "Canceled",
    statusDate: "Oct 15",
    createdAt: "Oct 15",
    paymentMethod: "Cash on Delivery (COD)",
    total: 0,
    currency: "INR",
    contact: {
      name: "Atul Kumar",
      email: "myurawellness@gmail.com",
      phone: "+917827720481",
    },
    shippingAddress: {
      name: "Atul Kumar",
      line1: "46-g, Anukampa Appartment",
      line2: "Abhay khand-4",
      city: "Indirapuram",
      state: "Uttar Pradesh",
      postalCode: "201014",
      country: "India",
      phone: "+917827720481",
    },
    billingAddress: {
      name: "Atul Kumar",
      line1: "46-g, Anukampa Appartment",
      line2: "Abhay khand-4",
      city: "Indirapuram",
      state: "Uttar Pradesh",
      postalCode: "201014",
      country: "India",
      phone: "+917827720481",
    },
    items: [
      {
        id: "1",
        name: "DIA CARE",
        qty: 1,
        price: 0,
        image: "", // add image URL later
      },
    ],
    shippingLabel: "Standard",
    shippingCost: 0,
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Top header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Link
              to="/profile"
              className="text-sm text-gray-600 hover:underline inline-flex items-center gap-1"
            >
              <span>←</span> Back to orders
            </Link>
            <h1 className="text-2xl font-semibold text-[#1C2638]">
              Order #{order.number}
            </h1>
            <p className="text-sm text-gray-500">
              Confirmed {order.createdAt}
            </p>
          </div>

          <button className="rounded-lg border border-[#1C2638] px-4 py-2 text-sm font-medium text-[#1C2638] hover:bg-[#e3e4de] transition">
            Buy again
          </button>
        </div>

        {/* Top cards: status + payment canceled */}
        <div className="mb-6 grid gap-4 md:grid-cols-[2fr,1.2fr]">
          {/* Status card */}
          <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {order.status}
            </div>
            <p className="text-sm text-gray-700">
              Your order has been canceled
            </p>
            <p className="mt-1 text-xs text-gray-500">{order.statusDate}</p>
          </div>

          {/* Payment info small card */}
          <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-semibold text-gray-800">
              Payment canceled
            </p>
            <p className="mt-1 text-sm text-gray-500">
              You were not charged.
            </p>
          </div>
        </div>

        {/* Main content: left info + right summary */}
        <div className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
          {/* Left column: contact & addresses */}
          <div className="space-y-4">
            {/* Contact & Payment */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Contact information */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Contact information
                </h2>
                <p className="text-sm text-gray-800">{order.contact.name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.contact.email}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.contact.phone}
                </p>

                <h3 className="mt-4 text-sm font-semibold text-gray-800">
                  Shipping method
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {order.shippingLabel}
                </p>
              </div>

              {/* Payment */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Payment
                </h2>
                <p className="text-sm text-gray-800">
                  {order.paymentMethod}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  ₹{order.total.toFixed(2)} {order.currency}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {order.createdAt}
                </p>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Shipping address */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Shipping address
                </h2>
                <p className="text-sm text-gray-800">
                  {order.shippingAddress.name}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.shippingAddress.line1}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.line2}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.country}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.shippingAddress.phone}
                </p>
              </div>

              {/* Billing address */}
              <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-gray-800">
                  Billing address
                </h2>
                <p className="text-sm text-gray-800">
                  {order.billingAddress.name}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.billingAddress.line1}
                </p>
                <p className="text-sm text-gray-600">
                  {order.billingAddress.line2}
                </p>
                <p className="text-sm text-gray-600">
                  {order.billingAddress.city}, {order.billingAddress.state}{" "}
                  {order.billingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">
                  {order.billingAddress.country}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.billingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Right column: order summary */}
          <div className="rounded-xl bg-white p-4 md:p-6 shadow-sm h-fit">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">
              Order summary
            </h2>

            {/* Product line items */}
            <div className="space-y-4 border-b border-gray-100 pb-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Image placeholder */}
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                      Img
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">
                  {order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>
                  {order.currency} ₹{(order.total + order.shippingCost).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links (optional) */}
        <div className="mt-10 flex flex-wrap gap-4 text-xs text-gray-500">
          <button className="hover:underline">Refund policy</button>
          <button className="hover:underline">Privacy policy</button>
          <button className="hover:underline">Terms of service</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
