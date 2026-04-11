import React from 'react';
import CouponStatusBadge from './CouponStatusBadge';
import copy from "../img/copy.png"
import "../css/CouponCss.css"
const CouponCard = ({ title, subtitle, description, expires, code, status, icon }) => {

    const isInactive = status !== "ACTIVE";


    return (
    <div className={`
        coupon-card glass-card rounded-xl p-6 shadow-sm transition
        ${isInactive
        ? "opacity-60 grayscale cursor-not-allowed"
        : "card-hover"}
    `}>
        <div className="flex justify-between items-center mb-4">
            <img src={icon} alt="icon"/>
            <CouponStatusBadge status={status}/>
        </div>
      <h3 className="text-[40px] font-bold mb-1
        bg-gradient-to-r from-orange-500 to-orange-400
        bg-clip-text text-transparent">
          {title}
      </h3>
      <p className="text-surface-dark font-bold text-xl mb-2">{subtitle}</p>
      <p className="text-sm text-[#6B7280] mb-4">{description}</p>
        <hr/>
      <div className="flex justify-between items-center p-3">
        <span className="text-sm text-black font-bold">Expires: <br/>{expires}</span>
          <div className="flex items-center border border-[#E5E7EB] px-3 py-2 bg-[#F9FAFB] rounded-lg hover:bg-gray-100 transition">
          <span className="text-sm text-black font-mono px-2 py-1 rounded">{code}</span>
          <button className="ml-2 text-gray-500"><img src={copy} alt="copy"/> </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
