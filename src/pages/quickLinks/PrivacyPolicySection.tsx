import React from "react";

type Props = {};

const PrivacyPolicySection = (props: Props) => {
  return (
    <section className="w-full bg-slate-50 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            Privacy &amp; Data Protection
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            Privacy Policy – MYURA
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
            This Privacy Policy explains how MYURA collects, uses, shares, and protects
            your information when you use our website, app, and wellness services.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] rounded-3xl p-6 md:p-8 space-y-8 md:space-y-9">
          {/* Collection of Information */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Collection of Information
            </h2>

            {/* Information You Provide to Us */}
            <div className="space-y-2">
              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Information You Provide to Us
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                We collect the information you directly provide to us, such as when you
                create or update your account, subscribe to wellness services, contact
                customer support, or communicate with us in any other way. This information
                may include your name, email address, phone number, postal address, health
                preferences, payment method, product choices, and any other data you choose
                to share.
              </p>
            </div>

            {/* Information We Collect Through Use of Our Services */}
            <div className="space-y-2">
              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Information We Collect Through Use of Our Services
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                When you interact with MYURA’s website, platform, or app, we may collect
                information in the following categories:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                <li>
                  <span className="font-semibold">Location Information:</span> With your
                  permission, we collect accurate location data via GPS or network-based
                  services to personalize offers, find your nearest delivery zones, or
                  promote local wellness solutions. Approximate location data may also be
                  derived from your IP address to optimize performance.
                </li>
                <li>
                  <span className="font-semibold">Contacts Information:</span> With your
                  consent, we may access your contact list to enable features such as
                  referrals, health buddy programs, or direct messaging within our wellness
                  community.
                </li>
                <li>
                  <span className="font-semibold">Transaction Information:</span> We store
                  your transaction history with MYURA—including purchased items,
                  subscriptions, wellness plans, transaction timestamps, and payment
                  details—for analytics and improved service.
                </li>
                <li>
                  <span className="font-semibold">Usage and Preference Information:</span>{" "}
                  We collect data on how you interact with our platform (visited pages,
                  clicked links, saved preferences) through cookies or similar technologies
                  to enhance user experience.
                </li>
                <li>
                  <span className="font-semibold">Device Information:</span> We may collect
                  details such as device model, OS version, mobile network, language
                  settings, IP address, and advertising identifiers to ensure security and
                  performance optimization.
                </li>
                <li>
                  <span className="font-semibold">Call and SMS Data:</span> If you interact
                  with MYURA’s customer care through calls or SMS, we may log the date/time,
                  phone numbers, and content (such as OTPs or inquiries) to support your
                  wellness journey efficiently.
                </li>
                <li>
                  <span className="font-semibold">Log Information:</span> Server logs may
                  include IP address, access time, error reports, browser type, and the last
                  visited third-party site to help us improve performance and security.
                </li>
              </ul>
            </div>
          </section>

          {/* Use of Information */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Use of Information
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-slate-600">
              The data we collect helps us:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>
                Deliver, personalize, and improve our wellness solutions—including natural
                health supplements, Ayurvedic therapies, and lifestyle plans.
              </li>
              <li>
                Authenticate users, manage orders, process payments, and provide real-time
                updates on purchases and wellness consultations.
              </li>
              <li>
                Send service-related messages and MYURA updates (product launches, order
                tracking, usage tips, etc.).
              </li>
              <li>
                Offer tailored promotions, wellness challenges, and loyalty rewards.
              </li>
              <li>
                Improve platform functionality, analyze trends, monitor performance, and
                resolve bugs or potential abuse.
              </li>
            </ul>
          </section>

          {/* Sharing of Information */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Sharing of Information
            </h2>

            <div className="space-y-2">
              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Through Our Services
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                <li>
                  With partners or collaborators where a product or service is jointly
                  developed or promoted by MYURA.
                </li>
                <li>
                  With the public if you post on public forums, blogs, or engage in
                  community challenges.
                </li>
                <li>
                  With third-party apps or websites you choose to integrate with through
                  your MYURA account.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm md:text-base font-semibold text-slate-900">
                Other Important Sharing
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                <li>
                  With our affiliate companies or wellness professionals to fulfill orders
                  or services.
                </li>
                <li>
                  With trusted vendors, logistics teams, or analytics providers who work
                  under confidentiality agreements.
                </li>
                <li>
                  To comply with legal obligations, enforce our terms, or protect the
                  integrity of MYURA and its users.
                </li>
                <li>
                  In the event of a merger, acquisition, or reorganization of MYURA’s
                  business.
                </li>
                <li>
                  In anonymized or aggregated form for research, wellness studies, or
                  trends analysis.
                </li>
              </ul>
            </div>
          </section>

          {/* Chatbot Services & Social Sharing */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Chatbot Services
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                MYURA may partner with third-party AI chatbot platforms (e.g., Haptik,
                Freshchat) to enhance your experience. These platforms may collect and use
                data in accordance with their own privacy policies. We encourage you to
                review those policies for more details.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Social Sharing
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                You may choose to link or share MYURA experiences via social media.
                Please review each platform’s privacy settings to control how your shared
                content is used, displayed, or further distributed.
              </p>
            </div>
          </section>

          {/* Offers, Failed Transactions, Analytics */}
          <section className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Promotional Offers
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                Discounts or promotional codes may be restricted to specific MYURA wellness
                categories. These codes may not be applicable on certain bundles,
                limited-edition products, or offers defined at MYURA’s sole discretion.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Failed Transactions
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                Failed payments or errors may be logged in your account history for up to
                30 days. If an amount is deducted without confirmation from MYURA, please
                contact your bank or payment provider for resolution, and share details
                with us for support.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Analytics &amp; Advertising
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                We may allow analytics and advertising providers to evaluate the
                effectiveness of our ads, social content, or product campaigns. These
                providers may use cookies or identifiers to track device behavior across
                websites and apps, in line with their own privacy practices.
              </p>
            </div>
          </section>

          {/* Your Choices */}
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Your Choices
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
              <li>
                <span className="font-semibold">Account Access:</span> You may update your
                MYURA profile or preferences anytime through your account settings.
              </li>
              <li>
                <span className="font-semibold">Access Rights:</span> You can email us at{" "}
                <span className="font-medium">care@myurawellness.in</span> to request
                access to, correction of, or deletion of your personal data, subject to
                applicable laws.
              </li>
              <li>
                <span className="font-semibold">
                  Location &amp; Contact Permissions:
                </span>{" "}
                You can revoke permissions for location and contacts from your mobile or
                browser settings.
              </li>
              <li>
                <span className="font-semibold">Promotional Communications:</span> You may
                opt out of promotional emails or messages via the unsubscribe links or
                settings provided. Transactional or service-related communications will
                continue to be sent.
              </li>
              <li>
                <span className="font-semibold">WhatsApp Messages:</span> By accepting our
                terms, you allow MYURA to share wellness tips, order updates, and exclusive
                offers through WhatsApp. You may opt out anytime via your account or
                communication settings.
              </li>
            </ul>
          </section>

          {/* Policy Updates & Contact */}
          <section className="space-y-3 border-t border-slate-100 pt-5 md:pt-6">
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Policy Updates
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                MYURA may periodically update this Privacy Policy. If significant changes
                are made, we will notify you through our platform or via email. Continued
                use of our services after such updates constitutes your consent to the
                revised policy.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
              <div className="space-y-1">
                <h3 className="text-sm md:text-base font-semibold text-slate-900">
                  Questions or Concerns?
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-slate-600">
                  If you have any questions or concerns about this Privacy Policy, you can
                  reach out to us at{" "}
                  <span className="font-medium">l: care@myurawellness.com</span>.
                </p>
              </div>
        
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicySection;
