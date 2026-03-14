import React from 'react';
import payment from '../img/addnew.png'
const PageHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-black text-[40px]">Payment Methods</h1>
        <p className="text-[#64748B]">Manage your saved cards and digital wallets securely.</p>
      </div>
      <button className="bg-orange-500 text-white rounded-full px-6 py-2 flex justify-between"><img src={payment} alt="payment"/> Add New Payment Method</button>
    </div>
  );
};

export default PageHeader;
