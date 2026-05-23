import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fetchTopRestaurants } from '../../store/slices/restaurantSlice';
import RestaurantCard from '../cards/RestaurantCard';

const FeaturedRestaurants = () => {
  const dispatch = useDispatch();
  const { topRestaurants } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(fetchTopRestaurants(6));
  }, [dispatch]);

  if (!topRestaurants || topRestaurants.length === 0) return null;

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Top Restaurants
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Highest rated restaurants in your area
            </p>
          </div>
          <Link
            to="/restaurants"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold transition-colors hover:gap-2"
            style={{ color: 'var(--color-primary)' }}
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {topRestaurants.slice(0, 6).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            View All Restaurants <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
