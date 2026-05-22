import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Sun, Moon, Heart, Package, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';

const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isAdmin, isOwner, logout } = useAuth();
  const { itemCount } = useCart();
  const { darkMode, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isOwner) return '/owner';
    return '/profile';
  };

  return (
    <nav
      className="sticky top-0 z-[300] glass"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Velora
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" />
            <NavLink to="/restaurants" label="Restaurants" />
            {isAuthenticated && isCustomer && (
              <>
                <NavLink to="/orders" label="Orders" />
                <NavLink to="/wishlist" label="Wishlist" />
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-xl transition-colors cursor-pointer hidden sm:flex"
              style={{ color: 'var(--color-text-secondary)' }}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart (Customer only) */}
            {isAuthenticated && isCustomer && (
              <Link
                to="/cart"
                className="relative p-2 rounded-xl transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl transition-colors cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-20 animate-scale-in overflow-hidden"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                        <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {user?.fullName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <DropdownItem to={getDashboardLink()} icon={<User className="w-4 h-4" />} label="Dashboard" onClick={() => setProfileOpen(false)} />
                        {isCustomer && (
                          <>
                            <DropdownItem to="/orders" icon={<Package className="w-4 h-4" />} label="My Orders" onClick={() => setProfileOpen(false)} />
                            <DropdownItem to="/addresses" icon={<MapPin className="w-4 h-4" />} label="Addresses" onClick={() => setProfileOpen(false)} />
                            <DropdownItem to="/wishlist" icon={<Heart className="w-4 h-4" />} label="Wishlist" onClick={() => setProfileOpen(false)} />
                          </>
                        )}
                      </div>
                      <div className="border-t py-1" style={{ borderColor: 'var(--color-border)' }}>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-xl cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t animate-fade-in"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            <MobileLink to="/" label="Home" onClick={() => setMobileOpen(false)} />
            <MobileLink to="/restaurants" label="Restaurants" onClick={() => setMobileOpen(false)} />
            {isAuthenticated && isCustomer && (
              <>
                <MobileLink to="/orders" label="My Orders" onClick={() => setMobileOpen(false)} />
                <MobileLink to="/wishlist" label="Wishlist" onClick={() => setMobileOpen(false)} />
                <MobileLink to="/addresses" label="Addresses" onClick={() => setMobileOpen(false)} />
              </>
            )}
            <button
              onClick={toggle}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--color-bg-tertiary)]"
    style={{ color: 'var(--color-text-secondary)' }}
  >
    {label}
  </Link>
);

const MobileLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--color-bg-tertiary)]"
    style={{ color: 'var(--color-text-primary)' }}
  >
    {label}
  </Link>
);

const DropdownItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-bg-tertiary)]"
    style={{ color: 'var(--color-text-secondary)' }}
  >
    {icon} {label}
  </Link>
);

export default Navbar;
