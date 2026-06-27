import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { getProductImageUrl } from "@/lib/productUtils";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  //const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 const { openAuthModal } = useModalStore();
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const handleCheckout = () => {
    onClose();
     if (!isAuthenticated) { 
        openAuthModal();
     } else {
      router.push("/checkout");
     }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Fallback style
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          {/* <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Shopping Cart ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div> */}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={getProductImageUrl(item.image)}
                      width={64}
                      height={64}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                      {/* <div className="text-xs text-gray-500 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div> */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            disabled={item.quantity >= item.stock}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">৳{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
              
              {/* <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button> */}
              <button
                onClick={() => {
                  clearCart();
                  onClose();
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Clear Cart
            </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;