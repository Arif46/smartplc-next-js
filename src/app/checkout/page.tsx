'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, Shield } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/authStore';
import { createOrder } from "@/lib/checkoutApi";
import toast from "react-hot-toast";
import { useModalStore } from "@/store/modalStore";
import { useMounted } from "@/hooks/useMounted";

type ShippingState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type PaymentState = {
  method: 'cod' | 'bkash' | 'nagad' | 'card';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  nameOnCard?: string;
  txId?: string;
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { openAuthModal } = useModalStore();
  const mounted = useMounted();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState<ShippingState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
  });

  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingState, string>>>({});
  const [payment, setPayment] = useState<PaymentState>({ method: 'cod' });
  const [paymentError, setPaymentError] = useState<string>('');

  const subtotal = useMemo(() => getSubtotal(), [getSubtotal, items]);
  const shippingCost = subtotal >= 1000 ? 0 : 60;
  const tax = 0;
  const total = subtotal + shippingCost + tax;

  // autofill email + phone if user exists
  useEffect(() => {
    if (user) {
      setShipping(prev => ({
        ...prev,
        firstName: (user as any).first_name || prev.firstName,
        lastName: (user as any).last_name || prev.lastName,
        email: (user as any).email || prev.email,
        phone: (user as any).phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      openAuthModal();
      router.push("/");
    } else if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/shop");
    }
  }, [mounted, isAuthenticated, items.length, openAuthModal, router]);

  const onShippingChange = (key: keyof ShippingState, value: string) => {
    setShipping(prev => ({ ...prev, [key]: value }));
    setShippingErrors(prev => ({ ...prev, [key]: '' })); // remove error on change
  };

  const onPaymentChange = (key: keyof PaymentState, value: any) => {
    setPayment(prev => ({ ...prev, [key]: value }));
    setPaymentError(''); // remove error on change
  };

  // Shipping Validation
  const validateShipping = (): boolean => {
    const errors: Partial<Record<keyof ShippingState, string>> = {};
    if (!shipping.firstName.trim()) errors.firstName = 'First name is required';
    if (!shipping.lastName.trim()) errors.lastName = 'Last name is required';
    if (!shipping.email.trim()) errors.email = 'Email is required';
    if (!shipping.phone.trim()) errors.phone = 'Phone is required';
    if (!shipping.address.trim()) errors.address = 'Address is required';
    if (!shipping.city.trim()) errors.city = 'City is required';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Payment Validation
  const validatePayment = (): boolean => {
    if ((payment.method === 'bkash' || payment.method === 'nagad') && (!payment.txId || payment.txId.trim().length < 3)) {
      setPaymentError(`Transaction ID is required for ${payment.method.toUpperCase()}`);
      return false;
    }
    if (payment.method === 'card') {
      if (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.nameOnCard) {
        setPaymentError('All card details are required');
        return false;
      }
    }
    return true;
  };

  const goToPayment = () => {
    if (validateShipping()) setStep(2);
  };

  const goBackToShipping = () => setStep(1);

  const placeOrder = async () => {
    if (!validatePayment()) return;
    if (items.length === 0) return setPaymentError('Cart is empty');

    setLoading(true);
    try {
      await createOrder({
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        postal_code: shipping.zipCode,
        country: shipping.country,
        payment_method: payment.method,
        items: items.map(it => ({ id: it.id, name: it.name, price: it.price, quantity: it.quantity }))
      });
      toast.success('Order placed successfully');
      clearCart();
      router.push('/orderSuccess');
    } catch (err: any) {
      setPaymentError(err.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex gap-8 mb-8">
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-gray-400'}`}><MapPin /> Shipping</div>
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}><CreditCard /> Payment</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" value={shipping.firstName} onChange={e => onShippingChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${shippingErrors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
                  {shippingErrors.firstName && <p className="text-red-600 text-sm mt-1">{shippingErrors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" value={shipping.lastName} onChange={e => onShippingChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${shippingErrors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
                  {shippingErrors.lastName && <p className="text-red-600 text-sm mt-1">{shippingErrors.lastName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" value={shipping.email} onChange={e => onShippingChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${shippingErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  {shippingErrors.email && <p className="text-red-600 text-sm mt-1">{shippingErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input type="tel" value={shipping.phone} onChange={e => onShippingChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${shippingErrors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                  {shippingErrors.phone && <p className="text-red-600 text-sm mt-1">{shippingErrors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input type="text" value={shipping.address} onChange={e => onShippingChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${shippingErrors.address ? 'border-red-500' : 'border-gray-300'}`} />
                  {shippingErrors.address && <p className="text-red-600 text-sm mt-1">{shippingErrors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input type="text" value={shipping.city} onChange={e => onShippingChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 ${shippingErrors.city ? 'border-red-500' : 'border-gray-300'}`} />
                  {shippingErrors.city && <p className="text-red-600 text-sm mt-1">{shippingErrors.city}</p>}
                </div>

                {/* Optional Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State (optional)</label>
                  <input type="text" value={shipping.state} onChange={e => onShippingChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code (optional)</label>
                  <input type="text" value={shipping.zipCode} onChange={e => onShippingChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country (optional)</label>
                  <input type="text" value={shipping.country} onChange={e => onShippingChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={() => router.back()} className="px-6 py-2 border rounded-md">Back to Cart</button>
                <button onClick={goToPayment} className="px-6 py-2 bg-blue-600 text-white rounded-md">Proceed to Payment</button>
              </div>
            </div>
          )}

        {step === 2 && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>

              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-3 border rounded ${payment.method === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" checked={payment.method === 'cod'} onChange={() => onPaymentChange('method', 'cod')} />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when you receive the order.</div>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border rounded ${payment.method === 'bkash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" checked={payment.method === 'bkash'} onChange={() => onPaymentChange('method', 'bkash')} />
                  <div>
                    <div className="font-medium">bKash</div>
                    <div className="text-sm text-gray-500">Send payment to merchant bKash number then enter TXID below.</div>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border rounded ${payment.method === 'nagad' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" checked={payment.method === 'nagad'} onChange={() => onPaymentChange('method', 'nagad')} />
                  <div>
                    <div className="font-medium">Nagad</div>
                    <div className="text-sm text-gray-500">Send payment to merchant Nagad number then enter TXID below.</div>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border rounded ${payment.method === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" checked={payment.method === 'card'} onChange={() => onPaymentChange('method', 'card')} />
                  <div>
                    <div className="font-medium">Card (Visa / Master)</div>
                    <div className="text-sm text-gray-500">Enter card details. (Use a gateway in production)</div>
                  </div>
                </label>
              </div>

              {/* dynamic fields */}
              {payment.method === 'bkash' || payment.method === 'nagad' ? (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID (TXID)</label>
                  <input type="text" value={payment.txId} onChange={e => onPaymentChange('txId', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter bKash/Nagad TXID" />
                </div>
              ) : null}

              {payment.method === 'card' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Card number" value={payment.cardNumber} onChange={e => onPaymentChange('cardNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" placeholder="MM/YY" value={payment.expiryDate} onChange={e => onPaymentChange('expiryDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" placeholder="CVV" value={payment.cvv} onChange={e => onPaymentChange('cvv', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" placeholder="Name on card" value={payment.nameOnCard} onChange={e => onPaymentChange('nameOnCard', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button onClick={goBackToShipping} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Previous</button>
                <button onClick={placeOrder} disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  {loading ? 'Placing order...' : 'Place Order'}
                </button>
              </div>
              {paymentError && <div className="mt-3 text-red-600 text-sm">{paymentError}</div>}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <aside className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {items.length === 0 ? <p className="text-gray-500">Cart is empty</p> : items.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>Tk {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-2 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>Tk {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `Tk ${shippingCost.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>Tk {tax.toFixed(2)}</span></div>
            <div className="flex justify-between border-t pt-1 font-semibold"><span>Total</span><span>Tk {total.toFixed(2)}</span></div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500"><Shield className="inline-block" /> Secure checkout & encrypted payment</div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
