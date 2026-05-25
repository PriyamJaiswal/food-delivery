import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import AuthLayout from '../../layouts/AuthLayout';
import { emailRules, passwordRules, fullNameRules } from '../../utils/validators';
import { ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: ROLES.CUSTOMER },
  });
  const { register: registerUser, loading, error, isAuthenticated, user, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const selectedRole = watch('role');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === ROLES.ADMIN) navigate('/admin', { replace: true });
      else if (user.role === ROLES.RESTAURANT_OWNER) navigate('/owner', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => { clearError(); }, []);

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Account created! 🎉');
    }
  };

  const roles = [
    { value: ROLES.CUSTOMER, label: '🛒 Customer', desc: 'Order food' },
    { value: ROLES.RESTAURANT_OWNER, label: '🍳 Restaurant Owner', desc: 'Manage restaurant' },
  ];

  return (
    <AuthLayout>
      <div
        className="rounded-3xl p-8 shadow-xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🍔</span>
            <span className="text-2xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Velora
            </span>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Create Account
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Join Velora for fast food delivery
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-light)', border: '1px solid var(--color-error)' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                {...register('fullName', fullNameRules)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: `1.5px solid ${errors.fullName ? 'var(--color-error)' : 'var(--color-border)'}`,
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="email"
                {...register('email', emailRules)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: `1.5px solid ${errors.email ? 'var(--color-error)' : 'var(--color-border)'}`,
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', passwordRules)}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: `1.5px solid ${errors.password ? 'var(--color-error)' : 'var(--color-border)'}`,
                  color: 'var(--color-text-primary)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => {
                const isSelected = selectedRole === r.value;
                return (
                  <label
                    key={r.value}
                    className="flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all border-2 text-center"
                    style={{
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
                    }}
                  >
                    <input type="radio" value={r.value} {...register('role', { required: 'Role is required' })} className="sr-only" />
                    <span className="text-lg mb-1">{r.label.split(' ')[0]}</span>
                    <span className="text-xs font-semibold" style={{ color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text-primary)' }}>{r.label.split(' ').slice(1).join(' ')}</span>
                    <span className="text-[10px]" style={{ color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text-tertiary)' }}>{r.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
