import React, { useState } from 'react';
import gift from "../img/gift.png"
const ReferFriendBanner = () => {
  const [open, setOpen] = useState(false);

  return (
    <>

    <div className="w-full bg-gradient-to-r from-[#111827] to-[#1F2937] text-white p-6 flex justify-between items-center rounded-[24px]">

      <div className="flex gap-3">
          <img src={gift} alt="gift"/>
        <div>
            <h3 className="text-lg font-semibold mb-1">Refer friend and earn reward?</h3>
            <p className="text-sm">Our support team is available 24/7 to help you.</p>
        </div>
      </div>
      <button
          onClick={() => setOpen(true)}
          className="bg-orange-500 text-white py-2 rounded-[9999px] hover:bg-orange-600 px-10 font-bold"
      >
          Refer friend
      </button>
    </div>
      {open && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative w-full max-w-xl overflow-hidden rounded-[36px] bg-gradient-to-br from-orange-100 via-white to-sky-100 p-8 shadow-2xl border border-white">
                  <button
                      onClick={() => setOpen(false)}
                      className="absolute top-4 right-5 text-gray-500 hover:text-gray-900 text-2xl font-black"
                  >
                      x
                  </button>
                  <div className="absolute -top-12 -left-10 w-32 h-32 rounded-full bg-orange-300/40" />
                  <div className="absolute -bottom-16 -right-10 w-40 h-40 rounded-full bg-sky-300/40" />
                  <div className="relative text-center">
                      <img src={gift} alt="gift" className="mx-auto mb-4 w-20 h-20 drop-shadow-xl" />
                      <h3 className="text-3xl font-black text-gray-900 mb-3">
                          Refer Friend Coming Soon
                      </h3>
                      <p className="text-gray-600 font-semibold max-w-md mx-auto">
                          Khung này để phát triển tiếp tính năng mời bạn bè, nhận thưởng, link chia sẻ và hiệu ứng vui nhộn sau.
                      </p>
                      <button
                          onClick={() => setOpen(false)}
                          className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-full font-black hover:bg-orange-600 shadow-lg shadow-orange-200"
                      >
                          Got it
                      </button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default ReferFriendBanner;
