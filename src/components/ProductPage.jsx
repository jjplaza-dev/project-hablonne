import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Adjust path if necessary
import { useCartStore } from '../store/cartStore';

const ProductPage = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Cart Selections
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Hardcoded sizes for now (you can adjust if sizes are added to DB later)
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('shop')
        .select('*')
        .eq('id', id)
        .single(); // .single() ensures we get an object, not an array

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setItem(data);
      }
      setLoading(false);
    };

    fetchItem();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    } else if (type === 'increase' && quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

const addToCart = useCartStore((state) => state.addToCart);

const handleAddToCart = () => {
  if (!selectedSize) {
    alert("Please select a size.");
    return;
  }
  addToCart(item, selectedSize, quantity);
};

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 md:px-8 py-12 flex items-center justify-center">
        <span className="text-sm font-medium uppercase tracking-widest animate-pulse">Loading Details...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full min-h-screen px-4 md:px-8 py-12 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Item Not Found</h2>
        <Link to="/shop" className="text-sm border-b border-black uppercase tracking-widest hover:text-neutral-500 transition-colors">Return to Shop</Link>
      </div>
    );
  }

  const imageUrl = `https://peru-alpaca-102666.hostingersite.com/items-images/${item.id}.jpg`;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 py-8 md:py-16">
      
      {/* Breadcrumbs */}
      <nav className="text-xs font-medium uppercase tracking-widest text-neutral-500 mb-8">
        <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="hover:text-black transition-colors cursor-pointer">{item.gender}</span>
        <span className="mx-2">/</span>
        <span className="text-black">{item.productDisplayName}</span>
      </nav>

      {/* Main Layout: Image Left, Details Right */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
        
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2 lg:w-3/5 border border-black rounded-md overflow-hidden bg-white aspect-[3/4] md:aspect-auto md:h-[80vh] sticky top-8">
          <img 
            src={imageUrl} 
            alt={item.productDisplayName} 
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col pt-4 md:pt-0">
          
          {/* Header Info */}
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-2">
            {item.productDisplayName}
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8">
            ${item.price}
          </p>

          <div className="w-full h-px bg-black mb-8"></div>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-widest">Select Size</h3>
              <button className="text-xs uppercase tracking-widest hover:underline text-neutral-500">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-sm font-medium uppercase tracking-widest border border-black rounded-sm transition-colors ${
                    selectedSize === size 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3">Quantity</h3>
            <div className="flex items-center border border-black rounded-sm w-fit">
              <button 
                onClick={() => handleQuantityChange('decrease')}
                className="px-4 py-2 hover:bg-neutral-100 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange('increase')}
                className="px-4 py-2 hover:bg-neutral-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-800 transition-colors mb-12"
          >
            {selectedSize ? 'Add to Bag' : 'Select a Size'}
          </button>

          {/* Product Metadata / Details Accordion-style layout */}
          <div className="border-t border-black">
            <div className="py-4 border-b border-black flex justify-between">
              <span className="text-sm font-semibold uppercase tracking-widest">Details</span>
            </div>
            <div className="py-4 text-sm text-neutral-700 flex flex-col gap-2 uppercase tracking-wide">
              <p><span className="font-semibold text-black">Color:</span> {item.baseColour}</p>
              <p><span className="font-semibold text-black">Category:</span> {item.masterCategory} / {item.subCategory}</p>
              <p><span className="font-semibold text-black">Type:</span> {item.articleType}</p>
              <p><span className="font-semibold text-black">Season:</span> {item.season} {item.year}</p>
              <p><span className="font-semibold text-black">Usage:</span> {item.usage}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;