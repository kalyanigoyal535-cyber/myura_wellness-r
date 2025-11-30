import React from "react";
import { Accordion } from "@mantine/core";

const FAQSection = () => {
  return (
    <section className="w-full bg-slate-50 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            FAQs • Myura Wellness
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            Have questions? We’ve got you covered.
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
            Find quick answers about your account, orders, products, payments, and more — all in one place.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-5 md:p-8 space-y-8">
          {/* Account & Access */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Account &amp; Access
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                Getting started
              </span>
            </div>
            <Accordion
              multiple
              variant="separated"
              radius="md"
              chevronPosition="right"
              className="[&_.mantine-Accordion-item]:border-slate-100 [&_.mantine-Accordion-control]:py-3"
            >
              <Accordion.Item value="login">
                <Accordion.Control>
                  How do I log in to my Myura Wellness account?
                </Accordion.Control>
                <Accordion.Panel>
                  You can log in by clicking the profile icon on the top-right corner and entering your registered email and password.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="reset-password">
                <Accordion.Control>
                  I forgot my password. How can I reset it?
                </Accordion.Control>
                <Accordion.Panel>
                  Click on <strong>“Forgot Password”</strong> on the login page and follow the steps to reset it via your email.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Our Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Our Products
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                Ayurvedic formulas
              </span>
            </div>
            <Accordion
              multiple
              variant="separated"
              radius="md"
              chevronPosition="right"
              className="[&_.mantine-Accordion-item]:border-slate-100 [&_.mantine-Accordion-control]:py-3"
            >
              <Accordion.Item value="products">
                <Accordion.Control>
                  What products does Myura Wellness offer?
                </Accordion.Control>
                <Accordion.Panel>
                  We offer a curated range of Ayurvedic wellness solutions including multivitamins, digestive support,
                  men’s &amp; women’s health boosters, plant-based Omega-3, and more.{" "}
                  <button
                    type="button"
                    className="inline-flex items-center text-emerald-600 text-sm font-medium hover:underline"
                  >
                    See full product range
                  </button>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="vegan">
                <Accordion.Control>
                  Are Myura’s products suitable for vegetarians or vegans?
                </Accordion.Control>
                <Accordion.Panel>
                  Yes, most of our products are 100% vegetarian and plant-based. Please check individual product pages
                  for specific details.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="ingredients">
                <Accordion.Control>
                  How do I find the ingredients used in Myura’s products?
                </Accordion.Control>
                <Accordion.Panel>
                  Visit the specific product page and click on the <strong>Ingredients</strong> section to view the full list.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Orders & Shipping */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Orders &amp; Shipping
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-600">
                Tracking &amp; updates
              </span>
            </div>
            <Accordion
              multiple
              variant="separated"
              radius="md"
              chevronPosition="right"
              className="[&_.mantine-Accordion-item]:border-slate-100 [&_.mantine-Accordion-control]:py-3"
            >
              <Accordion.Item value="order-status">
                <Accordion.Control>
                  How do I check the status of my order?
                </Accordion.Control>
                <Accordion.Panel>
                  After placing an order, you can track it from your <strong>My Orders</strong> section under your account dashboard.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="order-confirmation">
                <Accordion.Control>
                  How do I know if my order is confirmed?
                </Accordion.Control>
                <Accordion.Panel>
                  Once your order is placed, you’ll receive a confirmation email and SMS with your order details.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="modify-order">
                <Accordion.Control>
                  Can I modify or cancel my order after placing it?
                </Accordion.Control>
                <Accordion.Panel>
                  You can request modifications or cancellations within 2 hours of placing your order by contacting our support team at{" "}
                  <strong>care@myura.com</strong>.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Delivery, Returns & Refunds */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Delivery, Returns &amp; Refunds
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600">
                Support &amp; policies
              </span>
            </div>
            <Accordion
              multiple
              variant="separated"
              radius="md"
              chevronPosition="right"
              className="[&_.mantine-Accordion-item]:border-slate-100 [&_.mantine-Accordion-control]:py-3"
            >
              <Accordion.Item value="delivery-time">
                <Accordion.Control>
                  What is the estimated delivery time?
                </Accordion.Control>
                <Accordion.Panel>
                  Orders are typically delivered within 3–7 working days, depending on your location.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="package-delayed">
                <Accordion.Control>
                  What if my package is delayed or not delivered?
                </Accordion.Control>
                <Accordion.Panel>
                  Please contact our customer care team with your order ID, and we’ll assist you promptly.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="return-policy">
                <Accordion.Control>
                  What is your return/refund policy?
                </Accordion.Control>
                <Accordion.Panel>
                  We accept returns within 7 days of delivery only if the product is damaged, defective, or incorrect.{" "}
                  <button
                    type="button"
                    className="inline-flex items-center text-emerald-600 text-sm font-medium hover:underline"
                  >
                    Read full return policy
                  </button>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Payments, Offers & Coupons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Payments, Offers &amp; Coupons
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-fuchsia-50 text-fuchsia-600">
                Checkout help
              </span>
            </div>
            <Accordion
              multiple
              variant="separated"
              radius="md"
              chevronPosition="right"
              className="[&_.mantine-Accordion-item]:border-slate-100 [&_.mantine-Accordion-control]:py-3"
            >
              <Accordion.Item value="payment-methods">
                <Accordion.Control>
                  What payment methods do you accept?
                </Accordion.Control>
                <Accordion.Panel>
                  We accept all major credit/debit cards, UPI, net banking, and wallet payments.
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="coupon">
                <Accordion.Control>
                  How do I apply a coupon code?
                </Accordion.Control>
                <Accordion.Panel>
                  You can enter your coupon code during checkout under the <strong>“Apply Coupon”</strong> section before making the payment.
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Collaborations & Ayurveda Expectations */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Collaborations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                  Collaborations &amp; Partnerships
                </h3>
              </div>
              <Accordion
                multiple
                variant="separated"
                radius="md"
                chevronPosition="right"
                className="[&_.mantine-Accordion-item]:border-slate-100 [&_.mantine-Accordion-control]:py-3"
              >
                <Accordion.Item value="collaboration">
                  <Accordion.Control>
                    I’m an influencer/content creator. How can I collaborate with Myura?
                  </Accordion.Control>
                  <Accordion.Panel>
                    We’d love to hear from you! Please fill out our influencer collaboration form here:{" "}
                    <button
                      type="button"
                      className="inline-flex items-center text-emerald-600 text-sm font-medium hover:underline"
                    >
                      Collab with us
                    </button>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>

            {/* Ayurveda Expectations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                  Product Use &amp; Ayurveda
                </h3>
              </div>
              <Accordion
                multiple
                variant="separated"
                radius="md"
                chevronPosition="right"
                className="[&_.mantine-Accordion-item]:border-slate-100 [&_.mantine-Accordion-control]:py-3"
              >
                <Accordion.Item value="ayurveda-time">
                  <Accordion.Control>
                    How long does it take to see results with Ayurvedic products?
                  </Accordion.Control>
                  <Accordion.Panel>
                    Ayurveda works gently and naturally. You may start noticing benefits within{" "}
                    <strong>2–6 weeks</strong> of consistent usage, depending on your body and lifestyle.
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
