import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoodsByRestaurant } from '../../store/slices/foodSlice';
import { fetchRestaurants } from '../../store/slices/restaurantSlice';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { ArrowLeft, UtensilsCrossed, Plus, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { requiredRule, priceRules } from '../../utils/validators';
import { CATEGORIES } from '../../utils/constants';
import foodService from '../../services/foodService';
import toast from 'react-hot-toast';

const OwnerMenu = () => {
  const dispatch = useDispatch();
  const { foodsByRestaurant, loading } = useSelector((state) => state.foods);
  const { restaurants } = useSelector((state) => state.restaurants);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Pick first restaurant as the owner's restaurant
  const myRestaurant = restaurants?.[0];

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    if (myRestaurant?.id) dispatch(fetchFoodsByRestaurant(myRestaurant.id));
  }, [dispatch, myRestaurant?.id]);

  const inputStyle = (error) => ({
    backgroundColor: 'var(--color-bg-secondary)',
    border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
    color: 'var(--color-text-primary)',
  });

  const onSubmit = async (data) => {
    if (!myRestaurant?.id) return toast.error('Create a restaurant first');
    setSubmitting(true);
    try {
      await foodService.create({ ...data, restaurantId: myRestaurant.id, price: parseFloat(data.price) });
      toast.success('Menu item added!');
      reset();
      setShowForm(false);
      dispatch(fetchFoodsByRestaurant(myRestaurant.id));
    } catch (err) {
      toast.error(err?.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await foodService.delete(id);
      toast.success('Item deleted');
      if (myRestaurant?.id) dispatch(fetchFoodsByRestaurant(myRestaurant.id));
    } catch (err) {
      toast.error(err?.message || 'Failed to delete');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/owner" className="p-2 rounded-xl transition-colors hover:bg-[var(--color-bg-tertiary)]">
              <ArrowLeft className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            </Link>
            <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>
              <UtensilsCrossed className="inline w-6 h-6 mr-2" /> Menu Management
            </h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl p-6 mb-8 animate-fade-in space-y-4" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Name</label>
                <input {...register('name', requiredRule('Name'))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle(errors.name)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Price (₹)</label>
                <input type="number" step="0.01" {...register('price', priceRules)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inputStyle(errors.price)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Category</label>
                <select {...register('category', requiredRule('Category'))} className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer" style={inputStyle(errors.category)}>
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-4 pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  <input type="checkbox" {...register('veg')} className="w-4 h-4" /> Vegetarian
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  <input type="checkbox" {...register('available')} defaultChecked className="w-4 h-4" /> Available
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Description</label>
              <textarea {...register('description')} rows={2} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle(false)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>Image URL</label>
              <input {...register('imageUrl')} className="w-full px-4 py-3 rounded-xl text-sm outline-none" placeholder="https://..." style={inputStyle(false)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" type="button" onClick={() => { setShowForm(false); reset(); }}>Cancel</Button>
              <Button type="submit" loading={submitting}>Add Item</Button>
            </div>
          </form>
        )}

        {/* Items List */}
        {loading ? <LoadingSpinner text="Loading menu..." /> : foodsByRestaurant.length === 0 ? (
          <EmptyState icon="🍕" title="No menu items" description="Add your first dish to start receiving orders" action={<Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Add Item</Button>} />
        ) : (
          <div className="grid gap-3 stagger-children">
            {foodsByRestaurant.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl || '/images/default-food.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={item.veg ? 'veg-indicator' : 'nonveg-indicator'} style={{ width: 14, height: 14 }} />
                    <h4 className="font-bold text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>{item.name}</h4>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{item.category}</p>
                </div>
                <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatCurrency(item.price)}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.available ? 'Available' : 'Unavailable'}</span>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OwnerMenu;
