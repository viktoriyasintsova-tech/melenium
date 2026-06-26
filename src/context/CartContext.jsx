import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addItem = useCallback(
    (product, volumeMl, { openDrawer = true } = {}) => {
      const price = product.prices[volumeMl];
      if (!price) return;

      setItems((prev) => {
        const existing = prev.find(
          (i) => i.slug === product.slug && i.volumeMl === volumeMl,
        );
        if (existing) {
          return prev.map((i) =>
            i.slug === product.slug && i.volumeMl === volumeMl
              ? { ...i, qty: i.qty + 1 }
              : i,
          );
        }
        return [
          ...prev,
          {
            slug: product.slug,
            brand: product.brand,
            name: product.name,
            volumeMl,
            price,
            qty: 1,
          },
        ];
      });

      if (openDrawer) openCart();
    },
    [openCart],
  );

  const incrementItem = useCallback((slug, volumeMl) => {
    setItems((prev) =>
      prev.map((i) =>
        i.slug === slug && i.volumeMl === volumeMl ? { ...i, qty: i.qty + 1 } : i,
      ),
    );
  }, []);

  const decrementItem = useCallback((slug, volumeMl) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.slug === slug && i.volumeMl === volumeMl
            ? { ...i, qty: i.qty - 1 }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  }, []);

  const removeItem = useCallback((slug, volumeMl) => {
    setItems((prev) =>
      prev.filter((i) => !(i.slug === slug && i.volumeMl === volumeMl)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getItemQty = useCallback(
    (slug, volumeMl) =>
      items.find((i) => i.slug === slug && i.volumeMl === volumeMl)?.qty ?? 0,
    [items],
  );

  const hasItem = useCallback(
    (slug, volumeMl) => getItemQty(slug, volumeMl) > 0,
    [getItemQty],
  );

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      getItemQty,
      hasItem,
      totalCount,
      totalPrice,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      isOpen,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      getItemQty,
      hasItem,
      totalCount,
      totalPrice,
      openCart,
      closeCart,
      toggleCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
