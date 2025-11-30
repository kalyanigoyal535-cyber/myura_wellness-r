import React from "react";

type Props = {};

const TermsAndConditionSection = (props: Props) => {
  return (
    <section className="w-full bg-slate-50 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            Terms of Use
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            TERMS AND CONDITIONS
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-3xl mx-auto">
            Welcome to MYURA WELLNESS. By accessing or using our website, mobile
            application, or purchasing any of our products or services, you agree
            to be bound by these Terms and Conditions. Please read them carefully.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-6 md:p-8 space-y-7 md:space-y-8">
          {/* Intro */}
          <section className="text-sm md:text-base leading-relaxed text-slate-600">
            Welcome to <span className="font-semibold">MYURA WELLNESS</span>. By
            accessing or using our website (&quot;Site&quot;), mobile application,
            or purchasing any of our products or services, you agree to be bound
            by the following Terms and Conditions. These terms govern your
            relationship with us and explain the rules that apply when you use our
            platform. If you do not agree with these Terms, please do not use the
            Site.
          </section>

          {/* 1. Acceptance of Terms */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                1
              </span>
              <span>Acceptance of Terms</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              By using this Site, you confirm that you have read, understood, and
              agree to be bound by these Terms of Use, including our{" "}
              <span className="font-semibold">Privacy Policy</span>,{" "}
              <span className="font-semibold">Disclaimer</span>,{" "}
              <span className="font-semibold">Return &amp; Refund Policy</span>, and
              any other applicable policies. If you are using the Site on behalf of
              an organization, you are agreeing on behalf of that organization and
              represent that you have the authority to do so.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                2
              </span>
              <span>Eligibility</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              To access and use our Site or purchase products, you must be at least{" "}
              <span className="font-semibold">18 years of age</span> or the age of
              majority in your jurisdiction, whichever is higher. By agreeing to
              these terms, you represent that:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>You are of legal age.</li>
              <li>You have not been previously suspended or removed from our services.</li>
              <li>Your use of the platform does not violate any applicable law or regulation.</li>
            </ul>
          </section>

          {/* 3. Product Information and Availability */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                3
              </span>
              <span>Product Information and Availability</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              All products featured on our Site are subject to availability and may be
              withdrawn or modified at our discretion. We aim to provide the most
              accurate product descriptions, ingredients, benefits, and visuals.
              However, due to the dynamic nature of wellness science and natural
              ingredients, there may be slight variations. We do not warrant that
              product information or other content is complete, accurate, current, or
              error-free. If a product ordered is unavailable, we will inform you and
              may suggest a substitute or offer a refund.
            </p>
          </section>

          {/* 4. Orders and Payments */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                4
              </span>
              <span>Orders and Payments</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Placing an order on MYURA WELLNESS constitutes an offer to purchase. All
              orders are subject to acceptance and availability. Once your order is
              placed, you will receive an order confirmation email.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>Reject or cancel any order without obligation.</li>
              <li>Limit the quantity of products ordered.</li>
              <li>Refuse service to anyone for any reason at any time.</li>
            </ul>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Payments must be made using approved methods such as debit/credit cards,
              UPI, wallets, or net banking. We use secure third-party payment gateways
              to help safeguard your payment information.
            </p>
          </section>

          {/* 5. Shipping and Delivery */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                5
              </span>
              <span>Shipping and Delivery</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              We deliver across India through trusted logistic partners. Shipping
              charges and estimated delivery timelines will be visible at checkout.
              Orders are processed within 24–48 hours (excluding Sundays and public
              holidays). Estimated delivery time ranges between{" "}
              <span className="font-semibold">2 to 7 working days</span> depending on
              your location.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Delays may occur due to factors beyond our control, such as weather,
              courier issues, or high order volumes during festivals or sales. Once
              the order is dispatched, tracking details will be shared via email/SMS.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              We are not liable for delays after dispatch, but we will support you in
              resolving any delivery-related concerns.
            </p>
          </section>

          {/* 6. Return and Refund Policy */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                6
              </span>
              <span>Return and Refund Policy</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Our products are non-returnable due to the nature of consumable goods,
              unless the item received is damaged, defective, expired, or incorrect.
              To be eligible for a return:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>You must raise a request within 3 days of receiving the product.</li>
              <li>The item must be unused, sealed, and in its original packaging.</li>
            </ul>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              After inspection and approval, a replacement or refund will be initiated.
              Please refer to our separate{" "}
              <span className="font-semibold">Return &amp; Refund Policy</span> page
              for detailed instructions and timelines.
            </p>
          </section>

          {/* 7. Health and Medical Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                7
              </span>
              <span>Health and Medical Disclaimer</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              The products offered by MYURA WELLNESS are designed to support general
              health and wellness. However:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>They are not meant to diagnose, treat, cure, or prevent any disease.</li>
              <li>Results may vary from person to person.</li>
              <li>They should not be considered a substitute for professional medical advice.</li>
            </ul>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Always consult your healthcare provider before starting any supplement,
              especially if you are pregnant, nursing, have a pre-existing condition,
              or are taking other medications.
            </p>
          </section>

          {/* 8. Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                8
              </span>
              <span>Intellectual Property</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              All content on this Site, including brand name, logos, product names,
              formulas, photographs, graphics, articles, videos, and all forms of
              media and text, are the intellectual property of{" "}
              <span className="font-semibold">MYURA WELLNESS</span> or its affiliates.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              You may not:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>Copy, reproduce, republish, upload, distribute, or transmit any material.</li>
              <li>
                Use our branding or likeness for commercial purposes without express written
                consent.
              </li>
            </ul>
          </section>

          {/* 9. User Conduct */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                9
              </span>
              <span>User Conduct</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              You agree to use the Site only for lawful purposes. You are prohibited from:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>
                Posting or transmitting any material that is unlawful, harmful, threatening,
                defamatory, obscene, or otherwise objectionable.
              </li>
              <li>Attempting to interfere with the functioning of the Site.</li>
              <li>Collecting personal data of other users without their consent.</li>
            </ul>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Any violation may lead to restricted access, legal consequences, or permanent
              bans from the platform.
            </p>
          </section>

          {/* 10. Privacy Policy */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                10
              </span>
              <span>Privacy Policy</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              We value your privacy. By using the Site, you agree to the collection and
              use of your information as outlined in our{" "}
              <span className="font-semibold">Privacy Policy</span>. This includes how we
              collect data, how it is used, our security practices, and your rights related
              to your data. We do not sell your personal data.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                11
              </span>
              <span>Limitation of Liability</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              MYURA WELLNESS shall not be liable for any direct, indirect, incidental,
              special, or consequential damages resulting from:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>The use or inability to use the Site or products.</li>
              <li>Unauthorized access to user data.</li>
              <li>Any errors or omissions in the content of the Site.</li>
            </ul>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Our total liability, in any case, shall be limited to the amount paid by the
              customer for the products purchased.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                12
              </span>
              <span>Indemnification</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              You agree to indemnify, defend, and hold harmless MYURA WELLNESS and its
              affiliates, partners, employees, and agents from any claims or demands,
              including reasonable attorney fees, arising from:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>Your breach of these Terms.</li>
              <li>Your use or misuse of the Site or its content.</li>
              <li>Your violation of applicable law or rights of a third party.</li>
            </ul>
          </section>

          {/* 13. Governing Law and Jurisdiction */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                13
              </span>
              <span>Governing Law and Jurisdiction</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              These Terms shall be governed and construed in accordance with the laws of
              India. In case of any disputes, the courts located in{" "}
              <span className="font-semibold">New Delhi</span> shall have exclusive
              jurisdiction.
            </p>
          </section>

          {/* 14. Offers, Discounts, and Coupons */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                14
              </span>
              <span>Offers, Discounts, and Coupons</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              All promotional offers are subject to terms and conditions. Coupons must be
              applied at checkout and cannot be clubbed with other discounts unless
              explicitly mentioned. We reserve the right to cancel offers at any time.
            </p>
          </section>

          {/* 15. Changes to Terms */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                15
              </span>
              <span>Changes to Terms</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              We reserve the right to update or revise these Terms at our sole discretion.
              The latest version will always be posted on the Site. It is your
              responsibility to review these Terms periodically. Continued use of the Site
              implies acceptance of any changes.
            </p>
          </section>

          {/* 16. Feedback and Reviews */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                16
              </span>
              <span>Feedback and Reviews</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              By submitting feedback, reviews, or testimonials, you grant us the right to
              publish, modify, and display it for promotional or operational purposes. Any
              content that is misleading, offensive, or promotional of competitors may be
              removed.
            </p>
          </section>

          {/* 17. Contact Information */}
          <section className="space-y-3 border-t border-slate-100 pt-5 md:pt-6">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                17
              </span>
              <span>Contact Information</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              For queries, clarifications, or concerns about these Terms, you may contact
              us at:
            </p>
            <div className="space-y-2 text-sm md:text-base text-slate-700">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <span>care@myurawellness.com</span>
              </p>
              <p>
                <span className="font-semibold">Customer Care:</span>
                <span>+91 9133 001 177</span>
              </p>
              <p>
                <span className="font-semibold">Registered Office:</span>
                <span>Plot No. 15C, IT Park, Sector 22, Panchkula, Haryana, 134109
                </span>
              </p>
            </div>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              Thank you for trusting <span className="font-semibold">MYURA WELLNESS</span>.
              We are honored to support your wellness journey with science-backed and
              nature-rooted solutions.
            </p>
  
          </section>
        </div>
      </div>
    </section>
  );
};

export default TermsAndConditionSection;
