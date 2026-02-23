import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ChevronLeft, CreditCard, Wallet, X, AlertCircle } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsDemoModalOpen(true);
  };

  if (cart.length === 0 && !isDemoModalOpen) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Your Bag is Empty</h2>
        <p className="text-neutral-500 text-sm font-medium tracking-widest uppercase mb-8">
          Add items to your cart to proceed with checkout.
        </p>
        <Link 
          to="/shop" 
          className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-black relative">
      
      <header className="w-full py-6 px-4 md:px-8 flex justify-center items-center relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-4 md:left-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          <span>Back</span>
        </button>
       
      </header>

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row">

        <div className="w-full lg:w-[55%] xl:w-[60%] p-4 md:p-8 lg:p-12 lg:border-r border-black/10">
          <form onSubmit={handleCheckout} className="flex flex-col gap-12">

            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">1. Contact Information</h2>
              <input 
                type="email" 
                required
                placeholder="Email Address" 
                className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
              />
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">2. Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="First Name" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500" />
                <input required type="text" placeholder="Last Name" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500" />
                <input required type="text" placeholder="Address" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500 md:col-span-2" />
                <input required type="text" placeholder="City" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500" />
                <input required type="text" placeholder="Postal / ZIP Code" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500" />
                <input required type="text" placeholder="Country" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500 md:col-span-2" />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">3. Payment Method</h2>
              
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 py-4 border rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${
                      paymentMethod === 'card' ? 'border-black bg-black text-white' : 'border-black text-black hover:bg-neutral-50'
                    }`}
                  >
                    <CreditCard size={16} strokeWidth={1.5} />
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-center justify-center gap-2 py-4 border rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${
                      paymentMethod === 'online' ? 'border-black bg-black text-white' : 'border-black text-black hover:bg-neutral-50'
                    }`}
                  >
                    <Wallet size={16} strokeWidth={1.5} />
                    Online / PayPal
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-full border border-black rounded-sm px-4 py-3 flex justify-between items-center bg-white focus-within:border-neutral-500">
                      <input 
                        required 
                        type="text" 
                        placeholder="Card Number" 
                        className="w-full text-sm outline-none bg-transparent" 
                      />

                      <div className="flex gap-1 shrink-0 text-[10px] font-bold text-neutral-400">
                        <span className="border border-neutral-200 px-1 rounded-sm">VISA</span>
                        <span className="border border-neutral-200 px-1 rounded-sm">MC</span>
                        <span className="border border-neutral-200 px-1 rounded-sm">AMEX</span>
                      </div>
                    </div>
                    <input required type="text" placeholder="Name on Card" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="text" placeholder="Expiration (MM/YY)" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500" />
                      <input required type="text" placeholder="Security Code (CVC)" className="w-full border border-black rounded-sm px-4 py-3 text-sm outline-none focus:border-neutral-500" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full border border-black rounded-sm p-8 text-center animate-in fade-in slide-in-from-top-2 duration-300 bg-neutral-50 flex flex-col items-center gap-4">
                    <Wallet size={32} strokeWidth={1} className="text-neutral-400" />
                    <p className="text-sm font-medium tracking-widest uppercase text-neutral-600">
                      You will be redirected to your online payment provider to complete this purchase securely.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <button 
              type="submit" 
              className="lg:hidden w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors mt-8"
            >
              Buy Now — ${total.toFixed(2)}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-[45%] xl:w-[40%] bg-neutral-50 lg:bg-white p-4 md:p-8 lg:p-12 border-t lg:border-t-0 border-black">
          <div className="sticky top-24 flex flex-col gap-8">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-black pb-2">Order Summary</h2>

            <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-neutral-300">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 items-center">
                  <div className="w-16 h-20 shrink-0 bg-neutral-100 border border-black rounded-sm overflow-hidden">
                    <img 
                      src={`https://peru-alpaca-102666.hostingersite.com/items-images/${item.id}.jpg`} 
                      alt={item.productDisplayName} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-tight line-clamp-1">{item.productDisplayName}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium shrink-0">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-sm font-medium uppercase tracking-widest border-t border-black pt-6">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>Calculated at next step</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold uppercase tracking-widest border-t border-black pt-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="hidden lg:block w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors mt-4"
            >
              Buy Now
            </button>
          </div>
        </div>

      </div>

      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isDemoModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          onClick={() => setIsDemoModalOpen(false)} 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        ></div>

        <div className={`relative w-full max-w-md bg-white border border-black p-8 md:p-12 shadow-2xl flex flex-col items-center text-center transform transition-transform duration-500 delay-100 ${
          isDemoModalOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}>
          <button 
            onClick={() => setIsDemoModalOpen(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
          
          <AlertCircle size={48} strokeWidth={1} className="mb-6 text-black" />
          
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Demo Mode</h2>
          <p className="text-sm font-medium tracking-widest text-neutral-600 uppercase leading-relaxed mb-8">
            Thank you for exploring Hablonne. This is a portfolio concept project. No real transactions are processed, and no real items will be shipped.
          </p>
          
          <button 
            onClick={() => {
              setIsDemoModalOpen(false);
              navigate('/');
            }}
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;