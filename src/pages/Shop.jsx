import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 
import ProductCard from '../components/ProductCard'; 
import { X } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // React Router Hooks
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract URL parameters
  const urlSubCategory = searchParams.get('subCategory');
  const urlSearchTerm = searchParams.get('search'); 

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter States
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]); // Updated to handle specific sub-categories

  // Filter Options
  const genders = ['Men', 'Women', 'Others'];
  
  const menuCategories = [
    { master: 'Apparel', subs: ['Topwear', 'Bottomwear', 'Innerwear'] },
    { master: 'Accessories', subs: ['Watches', 'Belts', 'Handbags'] },
    { master: 'Footwear', subs: ['Shoes', 'Flip Flops', 'Sandals'] },
    { master: 'Personal Care', subs: ['Lipstick', 'Deodorant'] }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase.from('shop').select('*', { count: 'exact' });

    if (urlSearchTerm) {
      query = query.ilike('productDisplayName', `%${urlSearchTerm}%`);
    }

    // Combine local selected sub-categories with the URL parameter (if any)
    const activeSubCategories = [...selectedSubCategories];
    if (urlSubCategory && !activeSubCategories.includes(urlSubCategory)) {
      activeSubCategories.push(urlSubCategory);
    }

    // Apply combined Sub-Category Filters
    if (activeSubCategories.length > 0) {
      query = query.in('subCategory', activeSubCategories);
    }

    // Apply Gender Filter
    if (selectedGenders.length > 0) {
      query = query.in('gender', selectedGenders);
    }

    // Apply Pagination
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

  useEffect(() => {
    fetchProducts();
    setPage(1); 
  }, [selectedGenders, selectedSubCategories, page, urlSubCategory, urlSearchTerm]);

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
    setSelectedSubCategories([]);
    setPage(1);
    
    if (urlSubCategory || urlSearchTerm) {
      navigate('/shop');
    }
  };

  const handleClearUrlFilter = () => {
    navigate('/shop');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selectedGenders.length > 0 || selectedSubCategories.length > 0 || urlSubCategory || urlSearchTerm;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="w-full px-4 md:px-8 py-12 flex flex-col gap-8">
      
      {/* Top Filters Section */}
      <aside className="w-full border-b border-black pb-8">
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">Filters</h2>
            
            {/* Visual Indicator for URL Parameter Filters */}
            {(urlSubCategory || urlSearchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {urlSearchTerm ? 'Search Results For:' : 'Viewing Category:'}
                </span>
                <span className="flex items-center gap-1 bg-neutral-100 border border-black px-2 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">
                  {urlSearchTerm || urlSubCategory}
                  <button onClick={handleClearUrlFilter} className="hover:text-red-500 transition-colors ml-1">
                    <X size={12} strokeWidth={2} />
                  </button>
                </span>
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="text-xs font-semibold uppercase tracking-widest hover:underline text-neutral-500 shrink-0"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Gender Filter Section */}
          <div>
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

          {/* Master & Sub Category Filter Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 border-b border-black pb-2">Categories</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {menuCategories.map((category) => (
                <div key={category.master}>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">
                    {category.master}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.subs.map((sub) => {
                      // Check if it's active locally OR via the Navbar URL
                      const isActive = selectedSubCategories.includes(sub) || urlSubCategory === sub;
                      return (
                        <button
                          key={sub}
                          onClick={() => {
                            // If they click an active URL filter, clear the URL to "uncheck" it
                            if (urlSubCategory === sub) {
                              handleClearUrlFilter();
                            } else {
                              toggleFilter(setSelectedSubCategories, sub);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs uppercase tracking-widest border border-black rounded-sm transition-colors text-left ${
                            isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="w-full">
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