const CategoryCard = ({ category, onClick, isActive }) => {
  return (
    <div
      onClick={() => onClick?.(category.value)}
      className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0 w-24"
    >
      <div className={`w-20 h-20 rounded-full overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 ${isActive ? 'ring-4 ring-[var(--color-primary)] ring-offset-2' : ''}`}>
        <img
          src={category.image}
          alt={category.label}
          className="w-full h-full object-cover"
        />
      </div>
      <span
        className={`text-sm font-semibold transition-colors duration-200 text-center ${isActive ? 'text-[var(--color-primary-dark)]' : 'text-gray-700 group-hover:text-[var(--color-primary)]'}`}
      >
        {category.label}
      </span>
    </div>
  );
};

export default CategoryCard;
