import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { useState } from 'react';
import Button from '../common/Button';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Premium Background Glows (Linear/Vercel style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-text-secondary)' }}>
                Introducing Velora Premium
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6" style={{ color: 'var(--color-text-primary)' }}>
              Craving something <br />
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                extraordinary?
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-10 max-w-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Discover the best local restaurants. Fast delivery, real-time tracking, and a world-class culinary experience delivered directly to your door.
            </p>

            {/* Premium Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-[var(--color-primary)]" style={{ color: 'var(--color-text-tertiary)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you in the mood for?"
                  className="w-full pl-14 pr-4 py-4 rounded-2xl text-base outline-none transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-lg)',
                    color: 'var(--color-text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = 'var(--shadow-glow)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)';
                    e.target.style.boxShadow = 'var(--shadow-lg)';
                  }}
                />
              </div>
              <Button type="submit" size="lg" className="py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                Find Food <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </form>

            {/* Micro Stats */}
            <div className="flex gap-10 mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
              {[
                { value: '500+', label: 'Premium Partners' },
                { value: 'Under 30m', label: 'Average Delivery' },
                { value: '24/7', label: 'Customer Support' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>{s.value}</p>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Hero Image Section */}
          <div className="hidden lg:flex justify-end animate-fade-in relative">
            <div className="relative w-[500px] h-[550px]">
              {/* Image Container with elegant border radius */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out" style={{ border: '8px solid var(--color-surface)' }}>
                <img
                  src="/images/hero-food.jpg"
                  alt="Premium food delivery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Glassmorphic Floating Badge 1 */}
              <div className="absolute top-12 -left-12 glass rounded-2xl p-4 shadow-2xl flex items-center gap-4 z-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Arriving in 15m</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Driver is nearby</p>
                </div>
              </div>

              {/* Glassmorphic Floating Badge 2 */}
              <div className="absolute bottom-20 -right-8 glass rounded-2xl p-4 shadow-2xl flex items-center gap-4 z-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="flex -space-x-3">
                  <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>4.9/5 Rating</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>From 10k+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
