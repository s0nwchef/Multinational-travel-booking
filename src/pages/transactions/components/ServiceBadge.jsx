import React from 'react';
import plane from '../img/plane.png'
import hotel from '../img/bed.png'
import train from '../img/train.png'

const ServiceBadge = ({ service }) => {
  const icons = {
    Flight: plane,
    Hotel: hotel,
    Train: train,
  };
  const Icon = icons[service];

  return (
    <div className="flex items-center gap-2 text-black">
      <img src={Icon} alt="service" />
      <span>{service}</span>
    </div>
  );
};

export default ServiceBadge;
