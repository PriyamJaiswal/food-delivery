import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTime } from '../../utils/formatters';

const RestaurantCard = ({ restaurant }) => {
  const {
    id,
    name,
    description,
    imageUrl,
    address,
    averageRating,
    totalReviews,
    openingTime,
    closingTime,
    active,
  } = restaurant;

  return (
    <Link to={`/restaurants/${id}`} className="block group h-full">
      <div
        className="h-full rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Image & Badges */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl || '/images/default-restaurant.jpg'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {!active && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg tracking-wide uppercase px-4 py-2 border-2 border-white/20 rounded-xl">Closed</span>
            </div>
          )}
          
          {averageRating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass shadow-sm backdrop-blur-md bg-black/30 border border-white/20 text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-xs text-white/80 font-medium">({totalReviews})</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between" style={{ height: 'calc(100% - 12rem)' }}>
          <div>
            <h3
              className="font-black text-xl mb-1.5 group-hover:bg-gradient-to-r group-hover:from-[var(--color-primary)] group-hover:to-[var(--color-secondary)] group-hover:bg-clip-text group-hover:text-transparent transition-all truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {name}
            </h3>
            <p
              className="text-sm mb-4 line-clamp-2 leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {description || 'Experience a culinary journey crafted with the finest ingredients.'}
            </p>
          </div>
          
          {/* Meta Data */}
          <div className="flex items-center justify-between text-xs font-medium pt-3 mt-auto border-t" style={{ borderColor: 'var(--color-border-light)', color: 'var(--color-text-tertiary)' }}>
            <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[120px]">{address}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--color-bg-tertiary)] px-2 py-1 rounded-md text-[var(--color-text-secondary)]">
              <Clock className="w-4 h-4" />
              <span>{formatTime(openingTime)} - {formatTime(closingTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
