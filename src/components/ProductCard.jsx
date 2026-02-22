import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore'; 
import { Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ProductCard = ({ item }) => {
  const cardRef = useRef(null);
  const imageUrl = `https://peru-alpaca-102666.hostingersite.com/items-images/${item.id}.jpg`;
  
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [selectedSize, setSelectedSize] = useState('');
  const sizes = ['XS', 'S', 'M', 'L'];

  // GSAP Animation setup
  useEffect(() => {
    // gsap.context ensures smooth cleanup of animations when components unmount
    let ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { 
          opacity: 0, 
          y: 40 // Start slightly lower
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            // 'top 70%' means: when the TOP of the card hits 70% down the viewport 
            // (which is exactly 30% from the bottom of the screen)
            start: 'top 70%', 
            toggleActions: 'play none none none' // Play only once
          },
        }
      );
    }, cardRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  const handleSizeClick = (e, size) => {
    e.preventDefault(); 
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!selectedSize) {
      alert(`Please select a size for ${item.productDisplayName}.`);
      return;
    }

    addToCart(item, selectedSize, 1);
    setSelectedSize('');
    alert('Added to bag!'); 
  };

  return (
   
    <div 
      ref={cardRef} 
      className="group flex flex-col border border-black/25 rounded-md overflow-hidden bg-white relative opacity-0"
    >
      
    
      <Link to={`/shop/${item.id}`} className="relative w-full aspect-[2/3] md:aspect-[1/1.25] overflow-hidden bg-white block">
        <img 
          src={imageUrl} 
          alt={item.productDisplayName} 
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
        
   
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute bottom-0 left-0 w-full flex justify-between items-center p-3 bg-white/40 backdrop-blur-md border-t border-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10 cursor-default"
        >
          
   
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

         
          <button 
            onClick={handleAddClick}
            
            className="group/add flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors"
          >
            <span>Add</span>
           
            <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full border border-white transition-transform duration-300 group-hover/add:rotate-90">
              <Plus size={12} strokeWidth={1.5} />
            </div>
          </button>

        </div>
      </Link>

   
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