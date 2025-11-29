import React from "react";
import { Copy, Share2, Gift, Users, Wallet } from "lucide-react";

type Props = {};

const ReferAndEarn = (props: Props) => {
  const referralCode = "MYURA123"; // you can make this dynamic later
  const referralLink = `https://www.myurawellness.com/?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    // optional: show toast
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    // optional: show toast
  };

  return (
    <div className="min-h-[80vh] w-full bg-slate-50 px-4 py-8 md:px-8 lg:px-12">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 flex items-center gap-2">
          <Gift className="w-7 h-7" />
          Refer & Earn
        </h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">
          Invite your friends and earn rewards on every successful order they place.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-[2fr,1.5fr]">
        {/* Left: Referral Code & Steps */}
        <div className="space-y-6">
          {/* Referral Code Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Your referral code
            </p>

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                  <span className="font-mono text-lg md:text-xl font-semibold tracking-widest text-slate-900">
                    {referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Share your referral link
              </p>
              <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex-1 truncate text-xs md:text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  {referralLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="mt-1 md:mt-0 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition"
                >
                  <Share2 className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3">
              How it works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 text-sm font-semibold">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Share your code</p>
                  <p className="text-xs md:text-sm text-slate-500">
                    Send your referral code or link to your friends via WhatsApp, SMS, or email.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 text-sm font-semibold">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Friend places their first order
                  </p>
                  <p className="text-xs md:text-sm text-slate-500">
                    They get an instant discount on their first purchase using your code.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 text-sm font-semibold">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">You earn rewards</p>
                  <p className="text-xs md:text-sm text-slate-500">
                    You receive wallet credits / coupons for every successful referral that you can
                    use on your next order.
                  </p>
                </div>
              </div>
            </div>

            {/* Small Note */}
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              * Rewards will be credited once your friend&apos;s order is successfully delivered.
              Terms and conditions apply.
            </p>
          </div>
        </div>

        {/* Right: Stats + Recent Referrals */}
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                  Total Rewards
                </p>
                <Wallet className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-900">₹1,250</p>
              <p className="text-[11px] text-slate-400 mt-1">Available in wallet</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
                  Friends Joined
                </p>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-900">08</p>
              <p className="text-[11px] text-slate-400 mt-1">via your referral</p>
            </div>
          </div>

          {/* Recent referrals list (dummy data) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
            <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3">
              Recent referrals
            </h3>
            <div className="space-y-3 text-xs md:text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Rahul Sharma</p>
                  <p className="text-[11px] text-slate-400">Order delivered · 2 days ago</p>
                </div>
                <span className="text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-600 px-3 py-1">
                  +₹150
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Neha Verma</p>
                  <p className="text-[11px] text-slate-400">Order placed · Pending</p>
                </div>
                <span className="text-[11px] font-semibold rounded-full bg-amber-50 text-amber-600 px-3 py-1">
                  Pending
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Aman Gupta</p>
                  <p className="text-[11px] text-slate-400">Cancelled · No rewards</p>
                </div>
                <span className="text-[11px] font-semibold rounded-full bg-slate-100 text-slate-500 px-3 py-1">
                  0
                </span>
              </div>
            </div>

            <button className="mt-4 w-full text-xs md:text-sm font-medium text-sky-600 hover:text-sky-700">
              View all referrals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferAndEarn;
