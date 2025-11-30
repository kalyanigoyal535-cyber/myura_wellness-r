import React from "react";

type Props = {};

const ReturnPolicySection = (props: Props) => {
  return (
    <section className="w-full bg-slate-50 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            Returns &amp; Refunds
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            RETURN POLICY – MYURA WELLNESS
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
            At MYURA WELLNESS, we prioritise your satisfaction and are committed
            to delivering high-quality wellness solutions. If you are not
            entirely satisfied with your purchase, this policy explains how
            returns and refunds work.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-6 md:p-8 space-y-7 md:space-y-8">
          {/* Intro text */}
          <section className="text-sm md:text-base leading-relaxed text-slate-600">
            At <span className="font-semibold">MYURA WELLNESS</span>, we
            prioritise your satisfaction and are committed to delivering
            high-quality wellness solutions. If you are not entirely satisfied
            with your purchase, we’re here to help, in accordance with the
            policy outlined below.
          </section>

          {/* 1. Return Eligibility */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                1
              </span>
              <span>Return Eligibility</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Returns will be accepted only under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>The product is unused, unopened, and in its original packaging.</li>
              <li>The return request is raised within 7 days from the date of delivery.</li>
              <li>The product is accompanied by the original invoice or proof of purchase.</li>
            </ul>
          </section>

          {/* 2. Non-Returnable Products */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                2
              </span>
              <span>Non-Returnable Products</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              The following products are not eligible for return:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>Opened or partially used products.</li>
              <li>Products that have been tampered with or damaged after delivery.</li>
              <li>
                Items purchased during promotional campaigns or sales (unless received in a
                damaged or defective condition).
              </li>
              <li>Products returned without original packaging or invoice.</li>
            </ul>
          </section>

          {/* 3. Damaged or Incorrect Products */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                3
              </span>
              <span>Damaged or Incorrect Products</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              In case you receive a product that is damaged, defective, or different from
              what you ordered, please contact us within <span className="font-semibold">48 hours</span> of
              delivery. We may request photographic evidence to initiate a replacement or refund.
            </p>
          </section>

          {/* 4. Refunds */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                4
              </span>
              <span>Refunds</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Once the returned product is received and inspected, a refund will be
              initiated to your original method of payment within{" "}
              <span className="font-semibold">5–7 business days</span>, provided the return
              meets the above criteria.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Refund timelines may vary depending on your bank or payment provider.
            </p>
          </section>

          {/* 5. Return Shipping */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                5
              </span>
              <span>Return Shipping</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>
                If the return is due to a damaged, defective, or incorrect product,{" "}
                <span className="font-semibold">MYURA WELLNESS</span> will bear the return
                shipping charges.
              </li>
              <li>
                For all other eligible returns, the customer is responsible for the return
                shipping costs.
              </li>
            </ul>
          </section>

          {/* 6. How to Initiate a Return */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                6
              </span>
              <span>How to Initiate a Return</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              To initiate a return or report an issue with your order, please contact our
              support team at:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm md:text-base text-slate-700">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📧</span>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <span>
                  care@myurawellness.com</span>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📞</span>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  <span>+91 9133 001 177</span>
                </p>
              </div>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Please include your order ID, reason for return, and supporting images (if
              applicable).
            </p>
          </section>

          {/* Policy note & closing */}
          <section className="space-y-3 border-t border-slate-100 pt-5 md:pt-6">
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              <span className="font-semibold">MYURA WELLNESS</span> reserves the right to
              modify or update this policy at any time. We encourage you to review this
              page periodically for any changes.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              For any further assistance, feel free to reach out to our customer support
              team. Your well-being and experience with MYURA remain our top priority.
            </p>

            <div className="text-xs md:text-sm text-slate-500 md:text-right">
              Last updated:{" "}
              <span className="font-medium text-slate-700">
                {new Date().getFullYear()}
              </span>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ReturnPolicySection;
