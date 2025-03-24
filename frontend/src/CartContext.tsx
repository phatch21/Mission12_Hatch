import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface CartItem {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = sessionStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.bookID === item.bookID);
      if (existing) {
        return prev.map((p) =>
          p.bookID === item.bookID
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (bookID: number) => {
    setCart((prev) => prev.filter((item) => item.bookID !== bookID));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
