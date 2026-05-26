import MainLayout from '../../layouts/MainLayout';
import HeroSection from '../../components/sections/HeroSection';
import PopularCategories from '../../components/sections/PopularCategories';
import FeaturedRestaurants from '../../components/sections/FeaturedRestaurants';
import TrendingFoods from '../../components/sections/TrendingFoods';
import OffersBanner from '../../components/sections/OffersBanner';

const HomePage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <PopularCategories />
      <OffersBanner />
      <FeaturedRestaurants />
      <TrendingFoods />
    </MainLayout>
  );
};

export default HomePage;
