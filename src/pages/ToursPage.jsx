import React, { useState } from "react";
import { List, LayoutGrid, Map as MapIcon, ChevronDown, X } from "lucide-react";
import TourList from "../features/tours/TourList";

export default function ToursPage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      <main className="max-w-full mx-auto px-4 md:px-10">
        <TourList />
      </main>

      {/* MODAL BẢN ĐỒ */}
      {showMap && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
          <div className="bg-white w-full max-w-[95vw] h-[90vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border border-white">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/90 hover:bg-red-500 hover:text-white rounded-2xl shadow-xl transition-all active:scale-90"
            >
              <X size={24} />
            </button>

            <div className="w-full h-full">
              <iframe
                title="Italy Tour Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093643!2d144.95373531531615!3d-37.816279742021234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d2230d570895!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2s!4v1614835151522!5m2!1sen!2s"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
