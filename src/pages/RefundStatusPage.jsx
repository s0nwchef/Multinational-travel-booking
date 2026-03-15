import React from "react";
import { ArrowLeft, Receipt, Headset } from "lucide-react";
import RefundTimeline from "../features/refund/RefundTimeline";
import RefundSummary from "../features/refund/RefundSummary";
import RefundHelp from "../features/refund/RefundHelp";

export default function RefundStatusPage() {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] p-6 md:p-10">
      <div className="w-full space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <button className="flex items-center gap-2 text-xs font-black text-gray-400 mb-2 hover:text-orange-500 transition-all">
              <ArrowLeft size={14} /> Back to Bookings
            </button>
            <h1 className="text-4xl font-black text-[#1A1D2E] tracking-tight">
              Refund Status
            </h1>
            <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">
              Booking ID:{" "}
              <span className="text-gray-900 font-black">#WL-8842910</span>
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-gray-200 bg-white text-xs font-black text-[#1A1D2E] hover:bg-gray-50 transition-all">
              <Receipt size={16} /> View Invoice
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
              <Headset size={16} /> Contact Support
            </button>
          </div>
        </div>

        <div className="w-full">
          <RefundTimeline />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="flex-[2] flex">
            <div className="w-full h-full">
              <RefundSummary />
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="w-full h-full">
              <RefundHelp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
