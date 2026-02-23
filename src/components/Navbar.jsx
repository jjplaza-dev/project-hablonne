import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Search, ShoppingBag, Menu, X, Trash2, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  const closeAllDrawers = () => {
    setIsSidebarOpen(false);
    setIsCartOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); 
      closeAllDrawers(); 
    }
  };

  // Expanded Mega-Menu Data
  const genders = ['Men', 'Women', 'Unisex']; // Using 'Unisex' assuming it maps to 'Others' or similar in your DB
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const menuCategories = [
    { master: 'Apparel', subs: ['Topwear', 'Bottomwear', 'Innerwear'] },
    { master: 'Accessories', subs: ['Watches', 'Belts', 'Handbags'] },
    { master: 'Footwear', subs: ['Shoes', 'Flip Flops', 'Sandals'] },
    { master: 'Personal Care', subs: ['Lipstick', 'Deodorant'] }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-black text-black">
        <div className="grid grid-cols-3 items-center px-4 md:px-8 h-16 w-full">

          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              <Menu size={20} strokeWidth={1.5} />
              <span className="hidden sm:inline">Shop</span>
            </button>

            <form 
              onSubmit={handleSearch}
              className="hidden lg:flex items-center border border-black rounded-sm h-8 w-48 bg-white transition-colors focus-within:border-neutral-500 px-2 gap-2"
            >
              <button type="submit" aria-label="Submit search" className="hover:text-black text-neutral-400 transition-colors">
                <Search size={14} strokeWidth={1.5} />
              </button>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs outline-none bg-transparent w-full"
              />
            </form>
          </div>

          <div className="flex justify-center">
            <Link 
              to="/" 
              onClick={closeAllDrawers}
              className="text-2xl md:text-3xl font-bold uppercase tracking-tighter hover:text-neutral-700 transition-colors"
            >
              Hablonne
            </Link>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity relative"
            >
              <span className="hidden sm:inline">Cart</span>
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -bottom-1 -right-2 bg-black text-white text-[10px] leading-none px-[5px] py-[3px] rounded-sm">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
          </div>
          
        </div>
      </header>

      <div 
        onClick={closeAllDrawers}
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isSidebarOpen || isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      <aside 
        className={`fixed top-0 left-0 h-screen w-[85vw] sm:w-80 bg-white border-r border-black z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-black h-16 shrink-0">
          <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <Menu size={18} strokeWidth={1.5} /> Menu
          </span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="hover:text-neutral-500 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">

          <form 
            onSubmit={handleSearch}
            className="lg:hidden flex items-center border border-black rounded-sm h-10 w-full mb-8 px-3 gap-2"
          >
            <button type="submit" aria-label="Submit search" className="hover:text-black text-neutral-400 transition-colors">
              <Search size={16} strokeWidth={1.5} />
            </button>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm outline-none bg-transparent w-full"
            />
          </form>

          <div className="flex flex-col gap-8 pb-12">
            
            <Link 
              to="/shop" 
              onClick={closeAllDrawers}
              className="text-sm font-bold uppercase tracking-widest border-b border-black pb-2 hover:text-neutral-500 transition-colors w-fit"
            >
              View All Products
            </Link>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">Shop by Gender</h3>
              <ul className="flex flex-col gap-3 pl-2">
                {genders.map((gender) => (
                  <li key={gender}>
                    <Link 
                      to={`/shop?gender=${gender}`} 
                      onClick={closeAllDrawers}
                      className="group flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black transition-colors"
                    >
                      <ChevronRight size={14} strokeWidth={1.5} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">{gender}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">Collections</h3>
              <ul className="flex flex-col gap-3 pl-2">
                {seasons.map((season) => (
                  <li key={season}>
                    <Link 
                      to={`/shop?season=${season}`} 
                      onClick={closeAllDrawers}
                      className="group flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black transition-colors"
                    >
                      <ChevronRight size={14} strokeWidth={1.5} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">{season}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {menuCategories.map((category) => (
              <div key={category.master}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">
                  {category.master}
                </h3>
                <ul className="flex flex-col gap-3 pl-2">
                  {category.subs.map((sub) => (
                    <li key={sub}>
                      <Link 
                        to={`/shop?subCategory=${sub}`} 
                        onClick={closeAllDrawers}
                        className="group flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black transition-colors"
                      >
                        <ChevronRight size={14} strokeWidth={1.5} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        <span className="group-hover:translate-x-1 transition-transform">{sub}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </aside>

      <aside 
        className={`fixed top-0 right-0 h-screen w-[85vw] sm:w-[400px] bg-white border-l border-black z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-black h-16 shrink-0">
          <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} /> Cart ({totalItems})
          </span>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="hover:text-neutral-500 transition-colors"
            aria-label="Close cart"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-neutral-500">
              <ShoppingBag size={48} strokeWidth={1} className="mb-2 opacity-50" />
              <p className="text-sm uppercase tracking-widest font-medium">Your bag is empty.</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="text-xs uppercase tracking-widest border-b border-black text-black hover:text-neutral-500 transition-colors pb-1"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 border border-black p-2 rounded-sm relative group">
                
                <Link 
                  to={`/shop/${item.id}`} 
                  onClick={() => setIsCartOpen(false)}
                  className="w-20 h-28 shrink-0 bg-neutral-100 border border-black rounded-sm overflow-hidden block hover:opacity-80 transition-opacity"
                >
                  <img 
                    src={`https://peru-alpaca-102666.hostingersite.com/items-images/${item.id}.jpg`} 
                    alt={item.productDisplayName} 
                    className="w-full h-full object-cover object-top"
                  />
                </Link>

                <div className="flex flex-col flex-1 justify-between py-1">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-tight line-clamp-1 pr-6">
                      {item.productDisplayName}
                    </h4>
                    <p className="text-xs uppercase tracking-widest text-neutral-500 mt-1">
                      Size: {item.selectedSize}
                    </p>
                    <p className="text-sm font-medium mt-1">${item.price}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-black rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, 'decrease')}
                        className="px-2 py-1 hover:bg-neutral-100 transition-colors"
                      >-</button>
                      <span className="text-xs font-medium w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, 'increase')}
                        className="px-2 py-1 hover:bg-neutral-100 transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="shrink-0 border-t border-black bg-white p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-sm uppercase tracking-widest font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="text-xs text-neutral-500">Calculated at checkout</span>
              </div>
            </div>

            <div className="w-full h-px bg-black my-2"></div>

            <div className="flex justify-between items-center font-bold text-lg uppercase tracking-widest mb-4">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Link 
              to="/checkout" 
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center py-4 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default Navbar;