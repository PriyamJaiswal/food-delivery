import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, loginUser, registerUser, logout, clearError } from '../store/slices/authSlice';
import { ROLES } from '../utils/constants';

/**
 * Custom hook for authentication state and actions.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  return {
    ...auth,
    isCustomer: auth.user?.role === ROLES.CUSTOMER,
    isAdmin: auth.user?.role === ROLES.ADMIN,
    isOwner: auth.user?.role === ROLES.RESTAURANT_OWNER,
    login: (credentials) => dispatch(loginUser(credentials)),
    register: (userData) => dispatch(registerUser(userData)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
};
