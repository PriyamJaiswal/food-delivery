import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminRestaurants } from '../../store/slices/adminSlice';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Store, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminRestaurants = () => {
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.admin);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAdminRestaurants({ page, size: 10 }));
  }, [dispatch, page]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await adminService.approveRestaurant(id);
      else await adminService.disableRestaurant(id);
      toast.success(`Restaurant ${action}d`);
      dispatch(fetchAdminRestaurants({ page, size: 10 }));
    } catch (err) {
      toast.error(err?.message || `Failed to ${action}`);
    }
  };

  const list = restaurants?.content || (Array.isArray(restaurants) ? restaurants : []);
  const totalPages = restaurants?.totalPages || 0;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/admin" className="p-2 rounded-xl transition-colors hover:bg-[var(--color-bg-tertiary)]">
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
          </Link>
          <h1 className="text-2xl font-black" style={{ color: 'var(--color-text-primary)' }}>
            <Store className="inline w-6 h-6 mr-2" /> Restaurant Management
          </h1>
        </div>

        {loading && list.length === 0 ? (
          <LoadingSpinner text="Loading restaurants..." />
        ) : (
          <div className="grid gap-4 stagger-children">
            {list.map((r) => (
              <div key={r.id || r.orderNumber} className="flex items-center gap-4 p-5 rounded-2xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-bg-tertiary)] flex items-center justify-center text-2xl">
                  {r.imageUrl ? <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" /> : '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{r.name || `Order #${r.orderNumber}`}</h3>
                  <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>{r.address || r.deliveryAddress || '—'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.active ? 'Active' : 'Inactive'}</span>
                  <Button size="sm" variant="success" onClick={() => handleAction(r.id, 'approve')} title="Approve"><CheckCircle2 className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="danger" onClick={() => handleAction(r.id, 'disable')} title="Disable"><XCircle className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button size="sm" variant="ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="px-4 py-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Page {page + 1} of {totalPages}</span>
            <Button size="sm" variant="ghost" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminRestaurants;
