import React from 'react';
import HeroSection from '../features/home/HeroSection';
import FeaturedGrid from '../features/home/FeaturedGrid';
import FavoriteChoices from '../features/home/FavoriteChoices';
import WhyChooseUs from '../features/home/WhyChooseUs';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedGrid />
      <FavoriteChoices />
      <WhyChooseUs />
    </>
  );
}
