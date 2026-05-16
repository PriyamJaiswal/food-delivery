import { useSelector, useDispatch } from 'react-redux';
import { addToCart, updateCartItem, removeCartItem, clearCart, fetchCart, selectCart, selectCartItemCount } from '../store/slices/cartSlice';

/**
 * Custom hook for cart operations.
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const itemCount = useSelector(selectCartItemCount);
  const { loading, error } = useSelector((state) => state.cart);

  return {
    cart,
    itemCount,
    loading,
    error,
    fetchCart: () => dispatch(fetchCart()),
    addItem: (data) => dispatch(addToCart(data)),
    updateItem: (cartItemId, data) => dispatch(updateCartItem({ cartItemId, data })),
    removeItem: (cartItemId) => dispatch(removeCartItem(cartItemId)),
    clear: () => dispatch(clearCart()),
  };
};
