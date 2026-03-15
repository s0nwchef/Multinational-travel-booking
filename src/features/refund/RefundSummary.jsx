import React from "react";
import { CreditCard, Calendar, Info, DollarSign } from "lucide-react";

const RefundSummary = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 w-full h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-7 bg-orange-500 rounded-full"></div>
          <h3 className="font-black text-gray-900 text-xl tracking-tight">
            Refund Summary
          </h3>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-bold text-sm">
              Original Amount
            </span>
            <span className="text-[#1A1D2E] font-black text-lg">$450.00</span>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold text-sm">
                Cancellation Fee
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-300 font-bold italic">
                <Info size={12} className="text-gray-300" />
                <span>Policy: Standard 10% fee</span>
              </div>
            </div>
            <span className="text-red-500 font-black text-lg">-$45.00</span>
          </div>

          <div className="border-t border-dashed border-gray-100 pt-8 flex justify-between items-center">
            <span className="font-black text-[#1A1D2E] text-xl">
              Total Refund Amount
            </span>
            <div className="text-right">
              <span className="text-4xl font-black text-orange-500 tracking-tighter">
                $405.00
              </span>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                Fully Refunded
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:bg-white hover:border-orange-200 transition-all duration-300">
          <p className="text-[10px] uppercase text-gray-400 font-black mb-4 tracking-widest">
            Refund Method
          </p>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1A1D2E] rounded-xl text-white shadow-lg shadow-blue-100">
              <CreditCard size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-[#1A1D2E]">
                Visa ending in 1234
              </span>
              <span className="text-[10px] text-gray-400 font-medium italic">
                Personal Bank Account
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:bg-white hover:border-orange-200 transition-all duration-300">
          <p className="text-[10px] uppercase text-gray-400 font-black mb-4 tracking-widest">
            Estimated Arrival
          </p>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl text-green-600 shadow-lg shadow-green-50">
              <Calendar size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-[#1A1D2E]">
                Oct 28 - Oct 30
              </span>
              <span className="text-[10px] text-gray-400 font-bold">
                3-5 business days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundSummary;
