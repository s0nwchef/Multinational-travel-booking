import React from "react";
import { HelpCircle, ChevronRight, MessageSquare } from "lucide-react";

const RefundHelp = () => {
  const faqs = [
    "Why is my refund less than I paid?",
    "How long do refunds take?",
    "Refund to a different card?",
  ];

  return (
    <div className="bg-[#f8cea7] rounded-[2.5rem] p-8 border border-orange-100 w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 rounded-xl text-orange-500">
          <MessageSquare size={20} />
        </div>
        <h3 className="font-black text-[#1A1D2E] text-xl">Need Help?</h3>
      </div>

      <p className="text-xs text-gray-500 mb-8 leading-relaxed font-medium">
        If you haven't received your refund within the estimated timeframe or
        have questions about the amount, our support team is here for you 24/7.
      </p>

      <div className="space-y-3 flex-grow">
        {faqs.map((q, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl text-[11px] font-black text-gray-700 hover:text-orange-500 hover:shadow-md transition-all border border-gray-50 group"
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={14} className="text-orange-400" />
              {q}
            </div>
            <ChevronRight
              size={14}
              className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
            />
          </button>
        ))}
      </div>

      <button className="w-full mt-8 py-4 bg-[#1A1D2E] text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-50 active:scale-95">
        Visit Help Center
      </button>
    </div>
  );
};

export default RefundHelp;
