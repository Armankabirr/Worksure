import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  serviceType: string;
  serviceName: string;
  price: number;
  description: string;
  image?: string;
  quantity: number;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "worksure_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initialization
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "id" | "quantity">) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.serviceType === item.serviceType &&
          cartItem.serviceName === item.serviceName
      );

      if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // New item, add to cart
        const newItem: CartItem = {
          ...item,
          id: `${item.serviceType}-${item.serviceName}-${Date.now()}`,
          quantity: 1,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
