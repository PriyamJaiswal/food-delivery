import { Percent, Truck, Gift } from 'lucide-react';

const OffersBanner = () => {
  const offers = [
    {
      icon: <Percent className="w-6 h-6" />,
      title: '50% OFF',
      desc: 'On your first order',
      bg: 'linear-gradient(135deg, #EF4444, #F97316)',
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Free Delivery',
      desc: 'On orders above ₹299',
      bg: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: 'Combo Deals',
      desc: 'Save up to ₹150',
      bg: 'linear-gradient(135deg, #10B981, #14B8A6)',
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-6 text-white overflow-hidden cursor-pointer card-hover"
              style={{ background: offer.bg }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  {offer.icon}
                </div>
                <h3 className="text-2xl font-black mb-1">{offer.title}</h3>
                <p className="text-sm text-white/80">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersBanner;
