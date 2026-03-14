import React from 'react';
import SettingSection from '../components/SettingSection';
import PaymentCard from '../components/PaymentCard';
import Payment from '../img/payment.png';

const PaymentMethodsSection = () => {
  return (
    <SettingSection title="Payment Methods" icon={Payment}>
      <div className="space-y-4">
        <PaymentCard type="Mastercard" digits="4242" expiry="12/26" primary={true} />
        <PaymentCard type="Visa" digits="8899" expiry="08/25" primary={false} />
      </div>
    </SettingSection>
  );
};

export default PaymentMethodsSection;
