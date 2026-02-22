import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if necessary
import ProductCard from '../components/ProductCard'; // Adjust path if necessary

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter States
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Filter Options
  const genders = ['Men', 'Women', 'Others'];
  const categories = ['Apparel', 'Accessories', 'Footwear', 'Personal Care'];

  const fetchProducts = async () => {
    setLoading(true);
    
    // Add { count: 'exact' } to get the total number of items matching filters
    let query = supabase.from('shop').select('*', { count: 'exact' });

    if (selectedGenders.length > 0) {
      query = query.in('gender', selectedGenders);
    }

    if (selectedCategories.length > 0) {
      query = query.in('masterCategory', selectedCategories);
    }

    // Apply Pagination logic (0-indexed)
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
      setTotalItems(count || 0);
    }
    
    setLoading(false);
  };

  // Run fetch whenever filters OR page changes
  useEffect(() => {
    fetchProducts();
  }, [selectedGenders, selectedCategories, page]);

  // When filters change, we MUST reset to page 1
  const toggleFilter = (setState, value) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setPage(1); 
  };

  const clearFilters = () => {
    setSelectedGenders([]);
    setSelectedCategories([]);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Smooth scroll back to top of the grid when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selectedGenders.length > 0 || selectedCategories.length > 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="w-full px-4 md:px-8 py-12 flex flex-col gap-8">
      
      {/* Top Filters Section */}
      <aside className="w-full border-b border-black pb-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">Filters</h2>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="text-xs font-semibold uppercase tracking-widest hover:underline text-neutral-500"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {/* Gender Filter Section */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3">Gender</h3>
            <div className="flex flex-wrap gap-2">
              {genders.map((gender) => {
                const isActive = selectedGenders.includes(gender);
                return (
                  <button
                    key={gender}
                    onClick={() => toggleFilter(setSelectedGenders, gender)}
                    className={`px-4 py-2 text-sm uppercase tracking-widest border border-black rounded-sm transition-colors ${
                      isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    {gender}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Section */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleFilter(setSelectedCategories, category)}
                    className={`px-4 py-2 text-sm uppercase tracking-widest border border-black rounded-sm transition-colors ${
                      isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="w-full">
        {/* Results Count Header (Updated to show total items, not just current page items) */}
        <div className="mb-6 flex items-center h-[34px]">
          <span className="text-sm font-medium uppercase tracking-widest">
            {loading ? 'Loading...' : `${totalItems} Results`}
          </span>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 min-h-[50vh]">
          {loading ? (
            [...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="aspect-[1/1.25] bg-neutral-100 animate-pulse border border-black rounded-md"></div>
            ))
          ) : products.length > 0 ? (
            products.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-black rounded-md flex items-center justify-center">
              <p className="text-lg uppercase tracking-widest font-medium">No items match your filters.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-black flex justify-center items-center gap-6">
            <button 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-6 py-2 border border-black text-sm font-semibold uppercase tracking-widest transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black disabled:cursor-not-allowed"
            >
              Prev
            </button>
            
            <span className="text-sm font-medium tracking-widest uppercase">
              Page {page} of {totalPages}
            </span>

            <button 
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-6 py-2 border border-black text-sm font-semibold uppercase tracking-widest transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Shop;