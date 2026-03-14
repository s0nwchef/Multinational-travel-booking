import React from 'react';
// import payment from "../img/payment.png"
const SectionContainer = ({ title, icon, children }) => {
  return (
    <div className="rounded-xl">
      <div className="flex items-center mb-4 space-x-2 ">
          <img src={icon} alt="icon"/>
        <h2 className="text-lg font-semibold text-black font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default SectionContainer;
