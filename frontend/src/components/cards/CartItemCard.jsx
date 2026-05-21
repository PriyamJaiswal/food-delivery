import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CartItemCard = ({ item, onUpdate, onRemove }) => {
  const { id, foodItemName, foodItemImageUrl, quantity, price, subtotal } = item;

  return (
    <div
      className="flex gap-4 p-4 rounded-xl animate-fade-in"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={foodItemImageUrl || '/images/default-food.jpg'}
          alt={foodItemName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
          {foodItemName}
        </h4>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
          {formatCurrency(price)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                quantity > 1
                  ? onUpdate(id, { quantity: quantity - 1 })
                  : onRemove(id)
              }
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-primary)',
              }}
            >
              {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-500" /> : <Minus className="w-3.5 h-3.5" />}
            </button>
            <span className="w-8 text-center font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {quantity}
            </span>
            <button
              onClick={() => onUpdate(id, { quantity: quantity + 1 })}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
