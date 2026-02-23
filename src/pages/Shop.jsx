import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 
import ProductCard from '../components/ProductCard'; 
import { X, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSubCategory = searchParams.get('subCategory');
  const urlSearchTerm = searchParams.get('search'); 
  const urlSeason = searchParams.get('season'); 
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [totalItems, setTotalItems] = useState(0);

  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]); 
  const [selectedSeasons, setSelectedSeasons] = useState([]); 

  const genders = ['Men', 'Women', 'Unisex'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter']; 
  
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

    const activeSubCategories = [...selectedSubCategories];
    if (urlSubCategory && !activeSubCategories.includes(urlSubCategory)) {
      activeSubCategories.push(urlSubCategory);
    }

    const activeSeasons = [...selectedSeasons];
    if (urlSeason) {
      const formattedSeason = urlSeason.charAt(0).toUpperCase() + urlSeason.slice(1);
      if (!activeSeasons.includes(formattedSeason)) {
        activeSeasons.push(formattedSeason);
      }
    }

    if (activeSubCategories.length > 0) {
      query = query.in('subCategory', activeSubCategories);
    }
    if (activeSeasons.length > 0) {
      query = query.in('season', activeSeasons);
    }
    if (selectedGenders.length > 0) {
      query = query.in('gender', selectedGenders);
    }

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
  }, [selectedGenders, selectedSubCategories, selectedSeasons, page, urlSubCategory, urlSearchTerm, urlSeason]);

  const updateUrlPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newParams.delete('page');
    } else {
      newParams.set('page', newPage);
    }
    setSearchParams(newParams);
  };

  const toggleFilter = (setState, value) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );

    updateUrlPage(1); 
  };

  const clearFilters = () => {
    setSelectedGenders([]);
    setSelectedSubCategories([]);
    setSelectedSeasons([]);
    navigate('/shop');
  };

  const handleClearUrlFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('subCategory');
    newParams.delete('search');
    newParams.delete('season');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    updateUrlPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = 
    selectedGenders.length > 0 || 
    selectedSubCategories.length > 0 || 
    selectedSeasons.length > 0 || 
    urlSubCategory || 
    urlSearchTerm || 
    urlSeason;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="w-full px-4 md:px-8 py-12 flex flex-col gap-12">
      
      <aside className="w-full border-b border-black pb-12">
        <div className="flex justify-between items-end mb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">Filters</h2>
            
            {(urlSubCategory || urlSearchTerm || urlSeason) && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {urlSearchTerm ? 'Search Results For:' : 'Viewing:'}
                </span>
                <span className="flex items-center gap-1 border-b border-black pb-0.5 text-xs font-bold uppercase tracking-widest">
                  {urlSeason ? urlSeason.charAt(0).toUpperCase() + urlSeason.slice(1) : (urlSearchTerm || urlSubCategory)}
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
              className="text-xs font-semibold uppercase tracking-widest hover:text-neutral-500 transition-colors shrink-0 flex items-center gap-1"
            >
              Clear All <X size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-12">
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">Gender</h3>
            <ul className="flex flex-col gap-3">
              {genders.map((gender) => {
                const isActive = selectedGenders.includes(gender);
                return (
                  <li key={gender}>
                    <button
                      onClick={() => toggleFilter(setSelectedGenders, gender)}
                      className={`text-xs uppercase tracking-widest transition-all flex items-center gap-2 group ${
                        isActive ? 'font-bold text-black' : 'font-medium text-neutral-600 hover:text-black'
                      }`}
                    >
                      <ChevronRight size={12} strokeWidth={2} className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      <span className={`${isActive ? '-translate-x-1' : ''} group-hover:translate-x-1 transition-transform`}>
                        {gender}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">Season</h3>
            <ul className="flex flex-col gap-3">
              {seasons.map((season) => {
                const isActive = selectedSeasons.includes(season) || (urlSeason && urlSeason.toLowerCase() === season.toLowerCase());
                return (
                  <li key={season}>
                    <button
                      onClick={() => {
                        if (urlSeason && urlSeason.toLowerCase() === season.toLowerCase()) {
                          handleClearUrlFilter();
                        } else {
                          toggleFilter(setSelectedSeasons, season);
                        }
                      }}
                      className={`text-xs uppercase tracking-widest transition-all flex items-center gap-2 group ${
                        isActive ? 'font-bold text-black' : 'font-medium text-neutral-600 hover:text-black'
                      }`}
                    >
                      <ChevronRight size={12} strokeWidth={2} className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      <span className={`${isActive ? '-translate-x-1' : ''} group-hover:translate-x-1 transition-transform`}>
                        {season}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {menuCategories.map((category) => (
            <div key={category.master}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">
                {category.master}
              </h3>
              <ul className="flex flex-col gap-3">
                {category.subs.map((sub) => {
                  const isActive = selectedSubCategories.includes(sub) || urlSubCategory === sub;
                  return (
                    <li key={sub}>
                      <button
                        onClick={() => {
                          if (urlSubCategory === sub) {
                            handleClearUrlFilter();
                          } else {
                            toggleFilter(setSelectedSubCategories, sub);
                          }
                        }}
                        className={`text-xs uppercase tracking-widest transition-all flex items-center gap-2 group text-left ${
                          isActive ? 'font-bold text-black' : 'font-medium text-neutral-600 hover:text-black'
                        }`}
                      >
                        <ChevronRight size={12} strokeWidth={2} className={`transition-opacity shrink-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        <span className={`${isActive ? '-translate-x-1' : ''} group-hover:translate-x-1 transition-transform`}>
                          {sub}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

        </div>
      </aside>
      <div className="w-full">
        <div className="mb-6 flex items-center h-[34px]">
          <span className="text-sm font-medium uppercase tracking-widest">
            {loading ? 'Loading...' : `${totalItems} Results`}
          </span>
        </div>

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