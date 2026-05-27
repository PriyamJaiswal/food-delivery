import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import MainLayout from '../../layouts/MainLayout';
import CartItemCard from '../../components/cards/CartItemCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, updateItem, removeItem, clear } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = (cartItemId, data) => {
    updateItem(cartItemId, data);
  };

  const handleRemove = (cartItemId) => {
    removeItem(cartItemId).then(() => toast.success('Item removed'));
  };

  const handleClear = () => {
    clear().then(() => toast.success('Cart cleared'));
  };

  if (loading && !cart) return <MainLayout><LoadingSpinner text="Loading cart..." /></MainLayout>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MainLayout>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse restaurants and add some delicious food!"
          action={
            <Link to="/restaurants">
              <Button>Browse Restaurants</Button>
            </Link>
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: 'var(--color-text-primary)' }}>
              Your Cart
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Price Summary */}
          <div>
            <div
              className="rounded-3xl p-7 sticky top-24 shadow-xl glass backdrop-blur-xl border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <h3 className="font-black text-xl mb-6 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base font-medium">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Fee</span>
                  <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">FREE</span>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <span style={{ color: 'var(--color-text-secondary)' }}>Taxes</span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Included</span>
                </div>
              </div>

              <div
                className="pt-5 mb-8 flex justify-between items-center border-t border-dashed"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span className="font-black text-xl tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Total</span>
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                  {formatCurrency(cart.totalAmount)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
