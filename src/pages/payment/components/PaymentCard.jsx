import React from 'react';
import CreditCardPreview from './CreditCardPreview';
import PaymentActions from './PaymentActions';

const PaymentCard = ({ brand, number, holder, expiry, isDefault }) => {
  return (
    <div className="flex gap-6 items-center">
      <CreditCardPreview brand={brand} number={number} holder={holder} expiry={expiry} />
        <div className="flex flex-col flex-1 w-175">
            <div className="flex items-center">
                <p className="text-black font-bold text-[22px]">
                    {brand} ending in {number.slice(-4)}
                </p>

                {isDefault && (
                    <span className="ml-auto text-[#FF5B00] font-semibold bg-[#137FEC1A] px-3 py-1 rounded">
        DEFAULT
      </span>
                )}
            </div>

            <p className="text-[#64748B] mb-4">Expires {expiry}</p>
            <hr className="mb-5"/>
            <PaymentActions  isDefault={isDefault} />
        </div>


    </div>
  );
};

export default PaymentCard;
