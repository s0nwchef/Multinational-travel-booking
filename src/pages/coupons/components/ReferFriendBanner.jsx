import React from 'react';
import gift from "../img/gift.png"
const ReferFriendBanner = () => {
  return (

    <div className="w-full bg-gradient-to-r from-[#111827] to-[#1F2937] text-white p-6 flex justify-between items-center rounded-[24px]">

      <div className="flex gap-3">
          <img src={gift} alt="gift"/>
        <div>
            <h3 className="text-lg font-semibold mb-1">Refer friend and earn reward?</h3>
            <p className="text-sm">Our support team is available 24/7 to help you.</p>
        </div>
      </div>
      <button className="bg-orange-500 text-white px-4 py-2 rounded-[9999px] hover:bg-orange-600 px-10 font-bold">Refer friend</button>
    </div>
  );
};

export default ReferFriendBanner;
