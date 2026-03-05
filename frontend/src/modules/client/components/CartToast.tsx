import { useEffect, useState } from 'react';
import { useCart } from '../../../shared/context/CartContext';

export function CartToast() {
  const { toastMessage } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setVisible(true);
      const timer = window.setTimeout(() => setVisible(false), 1800);
      return () => window.clearTimeout(timer);
    }
    setVisible(false);
    return undefined;
  }, [toastMessage]);

  if (!toastMessage) return null;

  return (
    <div
      className={
        visible
          ? 'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[rgba(0,240,255,0.6)] bg-[#0A0F1E]/90 px-5 py-3 text-sm font-semibold text-primary shadow-lg transition-opacity'
          : 'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[rgba(0,240,255,0.6)] bg-[#0A0F1E]/90 px-5 py-3 text-sm font-semibold text-primary opacity-0 transition-opacity'
      }
    >
      {toastMessage}
    </div>
  );
}
