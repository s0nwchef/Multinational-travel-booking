import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import SectionContainer from '../components/SectionContainer';
import PaymentCard from '../components/PaymentCard';
import Dosisa from '../img/visa.png'
import { cards } from '../../../data/data.js'
import payment from "../img/payment.png"

const SavedCardsSection = () => {
  return (
    // <SectionContainer title="Saved Cards" icon={FiCreditCard}>
    //     <div>
    //         <PaymentCard brand="Visa" number="4242" holder="Alex Johnson" expiry="12/26" isDefault={true} />
    //     </div>
    //   <div className="space-y-4">
    //     <PaymentCard brand="Mastercard" number="8841" holder="Alex Johnson" expiry="08/25" isDefault={false} />
    //   </div>
    // </SectionContainer>
      <SectionContainer title="Saved Cards" icon={payment}>
          <div className="space-y-4s">
              {cards.map((card, index) => (
                  <div
                      key={index}
                      className="flex items-center justify-between border border-gray-200 rounded-xl p-5 bg-white"
                  >
                      <PaymentCard {...card} />
                  </div>
              ))}
          </div>
      </SectionContainer>
  );
};

export default SavedCardsSection;
