import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>

      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-black text-black">
        <div className="grid grid-cols-3 items-center px-4 md:px-8 h-16 w-full">
          
    
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-sm font-semibold uppercase tracking-widest hover:underline transition-all"
            >
              Shop
            </button>

            <div className="hidden lg:flex items-center border border-black rounded-sm h-8 w-48 bg-white transition-colors focus-within:border-neutral-500">
              <input 
                type="text" 
                placeholder="Search..." 
                className="px-3 text-xs outline-none bg-transparent w-full"
              />
            
            </div>
          </div>

         
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="text-2xl md:text-3xl font-bold uppercase tracking-tighter hover:text-neutral-700 transition-colors"
            >
              Hablonne
            </Link>
          </div>

          
          <div className="flex justify-end">
            <Link 
              to="/cart" 
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              <span>Cart</span>
             
              {totalItems > 0 && (
                <span className="bg-black text-white text-[10px] leading-none px-2 py-1 rounded-sm">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
          
        </div>
      </header>


      <div 
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      <aside 
        className={`fixed top-0 left-0 h-screen w-[85vw] sm:w-80 bg-white border-r border-black z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
  
        <div className="flex justify-between items-center p-4 border-b border-black h-16">
          <span className="font-bold uppercase tracking-widest text-sm">Menu</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl leading-none hover:text-neutral-500 transition-colors"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>


        <div className="p-4 flex-1 overflow-y-auto">

          <div className="lg:hidden flex items-center border border-black rounded-sm h-10 w-full mb-8">
            <input 
              type="text" 
              placeholder="Search..." 
              className="px-3 text-sm outline-none bg-transparent w-full"
            />
          </div>

          <div className="flex flex-col gap-6 text-sm uppercase tracking-widest font-medium">
            <p className="text-neutral-400">[ Sidebar Content / Links ]</p>

          </div>
          
        </div>
      </aside>
    </>
  );
};

export default Navbar;