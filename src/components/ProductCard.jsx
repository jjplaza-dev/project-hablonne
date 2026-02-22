import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; // Adjust path based on your folder structure

const ProductCard = ({ item }) => {
  const imageUrl = `https://peru-alpaca-102666.hostingersite.com/items-images/${item.id}.jpg`;
  
  // Zustand Cart Action
  const addToCart = useCartStore((state) => state.addToCart);
  
  // Local state for the quick-add size selection
  const [selectedSize, setSelectedSize] = useState('');
  const sizes = ['XS', 'S', 'M', 'L'];

  // Handle Size Click (prevents link navigation)
  const handleSizeClick = (e, size) => {
    e.preventDefault(); 
    e.stopPropagation();
    setSelectedSize(size);
  };

  // Handle Add to Cart Click (prevents link navigation)
  const handleAddClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!selectedSize) {
      alert(`Please select a size for ${item.productDisplayName}.`);
      return;
    }

    addToCart(item, selectedSize, 1);
    
    // Reset selection after adding to give a subtle visual cue that action completed
    setSelectedSize('');
    // Optional: You could replace the alert with a toast notification later
    alert('Added to bag!'); 
  };

  return (
    <div className="group flex flex-col border border-black rounded-md overflow-hidden bg-white relative">
      
      {/* Upper Half: Image & Hover Overlay wrapped in a Link */}
      <Link to={`/shop/${item.id}`} className="relative w-full aspect-[2/3] md:aspect-[1/1.25] overflow-hidden bg-white block">
        <img 
          src={imageUrl} 
          alt={item.productDisplayName} 
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        
        {/* Sliding Blur Overlay */}
        <div 
          // Adding a click handler here stops clicking on the empty space of the overlay from triggering the link
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute bottom-0 left-0 w-full flex justify-between items-center p-3 bg-white/40 backdrop-blur-md border-t border-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10 cursor-default"
        >
          
          {/* Sizes Left Side (Radio Behavior) */}
          <div className="flex gap-1 text-xs font-semibold text-black tracking-widest">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleSizeClick(e, size)}
                className={`px-2 py-1 rounded-sm transition-colors border ${
                  selectedSize === size 
                    ? 'bg-black text-white border-black' 
                    : 'bg-transparent text-black border-transparent hover:border-black/30'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Add Button Right Side */}
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
          >
            <span>Add</span>
            <span className="text-base leading-none mb-[1px]">+</span>
          </button>

        </div>
      </Link>

      {/* Lower Half: Product Info wrapped in a Link */}
      <Link 
        to={`/shop/${item.id}`} 
        className="flex justify-between items-center p-4 border-t border-black bg-white text-black hover:bg-neutral-50 transition-colors"
      >
        <h3 className="font-semibold text-sm truncate pr-4 tracking-tight">
          {item.productDisplayName}
        </h3>
        <span className="text-sm font-medium whitespace-nowrap">
          ${item.price}
        </span>
      </Link>

    </div>
  );
};

export default ProductCard;