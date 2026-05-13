import React from 'react';
import bed from '../img/bed.png';

const ServiceBadge = ({ service, image }) => {
  return (
    <div className="flex items-center gap-2 text-black">
      <img src={image || bed} alt="service" className="w-5 h-5 object-contain" />
      <span>{service}</span>
    </div>
  );
};

export default ServiceBadge;
