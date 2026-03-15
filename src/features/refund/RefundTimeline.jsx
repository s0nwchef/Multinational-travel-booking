import React from "react";
import { CheckCircle2, RefreshCw, Circle } from "lucide-react";

const RefundTimeline = () => {
  const steps = [
    {
      label: "Refund Requested",
      date: "Oct 24, 2024",
      time: "10:30 AM",
      status: "completed",
    },
    {
      label: "Processing by Wanderlust",
      date: "Oct 25, 2024",
      time: "02:15 PM",
      status: "completed",
    },
    { label: "Sent to Bank", status: "in-progress", note: "Expected soon" },
    { label: "Refund Completed", status: "pending", note: "Pending" },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-7 bg-orange-500 rounded-full"></div>
        <h3 className="font-black text-[#1A1D2E] text-xl tracking-tight">
          Timeline
        </h3>
      </div>
      <div className="relative flex justify-between">
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 -z-0"></div>

        {steps.map((step, index) => (
          <div
            key={index}
            className="relative z-10 flex flex-col items-center flex-1 text-center"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                step.status === "completed"
                  ? "bg-orange-500 text-white"
                  : step.status === "in-progress"
                    ? "bg-white border-2 border-orange-500 text-orange-500"
                    : "bg-white border-2 border-gray-200 text-gray-300"
              }`}
            >
              {step.status === "completed" ? (
                <CheckCircle2 size={20} />
              ) : (
                <RefreshCw
                  size={20}
                  className={
                    step.status === "in-progress" ? "animate-spin" : ""
                  }
                />
              )}
            </div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">
              {step.label}
            </h4>
            <p className="text-[10px] text-gray-400 font-medium">
              {step.date ? `${step.date}\n${step.time}` : step.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundTimeline;
