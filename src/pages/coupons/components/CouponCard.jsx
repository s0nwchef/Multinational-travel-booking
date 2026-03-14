import React from 'react';
import CouponStatusBadge from './CouponStatusBadge';
import copy from "../img/copy.png"
const CouponCard = ({ title, subtitle, description, expires, code, status, icon }) => {
  return (
    <div className="rounded-xl border-dashed border-gray-300 p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
          <img src={icon} alt="icon" />
        <CouponStatusBadge status={status} />
      </div>
      <h3 className="text-[40px] font-bold mb-1 text-[#FF5A1F]">{title}</h3>
      <p className="text-surface-dark font-bold text-xl mb-2">{subtitle}</p>
      <p className="text-sm text-[#6B7280] mb-4">{description}</p>
        <hr/>
      <div className="flex justify-between items-center p-3">
        <span className="text-sm text-black font-bold">Expires: <br/>{expires}</span>
        <div className="flex items-center border boder-[#E5E7EB] p-2 bg-[#F9FAFB] rounded-[8px]">
          <span className="text-sm text-black font-mono px-2 py-1 rounded">{code}</span>
          <button className="ml-2 text-gray-500"><img src={copy} alt="copy"/> </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
