import React from 'react';
import { FiCreditCard, FiSmartphone } from 'react-icons/fi';
import SectionContainer from '../components/SectionContainer';
import PaymentMethodRow from '../components/PaymentMethodRow';
import other from '../img/other.png';
import paypal from '../img/paypal.png'
import applepay from '../img/applepay.png'

const OtherPaymentMethodsSection = () => {
  return (
    <SectionContainer title="Other Payment Methods" icon={other}>
      <div className="space-y-4">
        <PaymentMethodRow icon={paypal} name="PayPal" description="alex.j@example.com" />
        <PaymentMethodRow icon={applepay} name="Apple Pay" description="Connected on iPhone 14 Pro" />
      </div>
    </SectionContainer>
  );
};

export default OtherPaymentMethodsSection;
