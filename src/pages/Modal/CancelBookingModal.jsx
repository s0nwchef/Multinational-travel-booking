import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, ChevronDown, CircleX } from "lucide-react";

export default function CancelBookingModal({
  isOpen = true,
  onClose,
  bookingData,
}) {
  const [reason, setReason] = useState("");

  const refundDetails = {
    originalPrice: 450.0,
    cancellationFee: 50.0,
    refundAmount: 400.0,
    cardEnding: "4242",
  };

  return (
    <AnimatePresence>
      {/* {isOpen && ( */}
      <>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 flex items-center justify-between border-b border-gray-50">
              <h2 className="text-2xl font-black text-[#1A1D2E]">
                Cancel Booking
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Cancellation Policy Alert */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-4">
                <AlertCircle className="text-orange-500 shrink-0" size={24} />
                <div className="space-y-1">
                  <h3 className="font-bold text-orange-900 text-sm">
                    Cancellation Policy
                  </h3>
                  <p className="text-orange-800/80 text-xs leading-relaxed">
                    You are cancelling your booking for the{" "}
                    <span className="font-bold text-orange-900">
                      Grand Hotel
                    </span>
                    . According to the policy, cancelling less than 48 hours
                    before check-in incurs a fee.
                  </p>
                </div>
              </div>

              <div className="bg-[#F8F9FB] rounded-[2rem] p-8 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">
                    Original Price
                  </span>
                  <span className="text-gray-900 font-bold">
                    ${refundDetails.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 font-medium">
                      Cancellation Fee
                    </span>
                    <AlertCircle size={14} className="text-gray-300" />
                  </div>
                  <span className="text-red-500 font-bold">
                    -${refundDetails.cancellationFee.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500 font-medium">
                      Refund Amount
                    </span>
                    <p className="text-[10px] text-gray-400">
                      Refunded to Visa ending in {refundDetails.cardEnding}
                    </p>
                  </div>
                  <span className="text-3xl font-black text-orange-500">
                    ${refundDetails.refundAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Reason for cancellation
                </label>
                <div className="relative">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium appearance-none focus:ring-2 focus:ring-orange-200 outline-none transition-all pr-12 text-gray-600"
                  >
                    <option value="">Select a reason</option>
                    <option value="change-plan">Change of plans</option>
                    <option value="emergency">Personal emergency</option>
                    <option value="found-better">Found a better deal</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 px-6 rounded-2xl border border-gray-200 font-bold text-[#1A1D2E] hover:bg-gray-50 transition-all active:scale-95"
              >
                Keep My Booking
              </button>
              <button className="flex-1 py-4 px-6 rounded-2xl bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 active:scale-95">
                <CircleX size={20} />
                Confirm Cancellation
              </button>
            </div>
          </motion.div>
        </motion.div>
      </>
      {/* )} */}
    </AnimatePresence>
  );
}
