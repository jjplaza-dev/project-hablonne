import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react'; 

gsap.registerPlugin(ScrollTrigger);

import heroVideo from '../assets/videos/InitialEdit.mp4'; 
import sustainableVideo from '../assets/videos/SustainablePromo.mp4'; 

const seasonalCollections = [
  { 
    id: 'spring', 
    title: 'Spring', 
    description: 'Awaken with light, airy fabrics and fresh tones.',
    img: 'https://peru-alpaca-102666.hostingersite.com/items-images/1160.jpg' 
  },
  { 
    id: 'summer', 
    title: 'Summer', 
    description: 'Breathe easy in sun-drenched, effortless silhouettes.',
    img: 'https://peru-alpaca-102666.hostingersite.com/items-images/1162.jpg' 
  },
  { 
    id: 'fall', 
    title: 'Fall', 
    description: 'Layer in rich textures and warm, earth-bound colors.',
    img: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1200&auto=format&fit=crop' 
  },
  { 
    id: 'winter', 
    title: 'Winter', 
    description: 'Embrace the cold in structured, protective elegance.',
    img: 'https://peru-alpaca-102666.hostingersite.com/items-images/1161.jpg' 
  }
];

const randomXOffsets = [
  'lg:translate-x-[15%]',    
  'lg:-translate-x-[20%]',   
  'lg:translate-x-[5%]',     
  'lg:-translate-x-[10%]'    
];

const sustainabilityFeatures = [
  {
    title: "Sustainable Fabrics",
    content: "We honor this heritage by exclusively sourcing sustainable, organic materials."
  },
  {
    title: "Natural Texture",
    content: "From hand-spun cotton and raw silk to indigenous abaca and piña fibers."
  },
  {
    title: "Environment Friendly",
    content: "Our garments are designed to breathe, endure, and return to the earth."
  },
  {
    title: "The Art of Hablon",
    content: "Derived from the Hiligaynon word \"Hablon\", meaning to weave, Hablonne is rooted in a centuries-old Panay tradition. It is more than a technique; it is a narrative interlaced into every fiber."
  }
];

const Home = () => {
  const [latestItems, setLatestItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  const mainRef = useRef(null);
  const scrollContainerRef = useRef(null); 
  
 
  const heroWrapperRef = useRef(null);
  const maskLayerRef = useRef(null);
  const maskTextRef = useRef(null);
  const heroTextRef = useRef(null);
  const subElementsRef = useRef(null);


  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(subElementsRef.current, { opacity: 0, y: 20 });

      tl.to([maskTextRef.current, heroTextRef.current], {
        scale: 0.18, 
        duration: 4,
        ease: "power3.inOut"
      }, 0)
      
      .to(maskLayerRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
      }, 2.5)
      .to(heroTextRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut"
      }, 2.5)
      .to(subElementsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
      }, 3.2);

    }, heroWrapperRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchLatestArrivals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('shop')
        .select('id, productDisplayName') 
        .order('id', { ascending: true }) 
        .limit(4);

      if (error) {
        console.error('Error fetching latest arrivals:', error);
      } else {
        setLatestItems(data || []);
      }
      setLoading(false);
    };

    fetchLatestArrivals();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const parallaxImages = gsap.utils.toArray('.parallax-img');
      
      parallaxImages.forEach((img) => {
        gsap.to(img, {
          yPercent: 20, 
          ease: 'none', 
          scrollTrigger: {
            trigger: img.parentElement, 
            start: 'top bottom', 
            end: 'bottom top',   
            scrub: true,         
          },
        });
      });
    }, mainRef);

    return () => ctx.revert(); 
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="w-full" ref={mainRef}>
      <section 
        ref={heroWrapperRef} 
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      >
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div 
          ref={maskLayerRef}
          className="absolute inset-0 z-10 bg-black mix-blend-multiply flex items-center justify-center pointer-events-none"
        >
          <h1 
            ref={maskTextRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80vw] sm:text-[70vw] md:text-[50vw] font-bold tracking-tighter uppercase text-white leading-none whitespace-nowrap transform-gpu origin-center"
          >
            Hablonne
          </h1>
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">

          <h1 
            ref={heroTextRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[80vw] sm:text-[70vw] md:text-[50vw] font-bold tracking-tighter uppercase text-white leading-none whitespace-nowrap transform-gpu origin-center opacity-0"
          >
            Hablonne
          </h1>

          <div 
            ref={subElementsRef}
            className="absolute top-[70%] left-1/2 -translate-x-1/2 translate-y-[50px] md:translate-y-[100px] flex flex-col items-center w-full text-center pointer-events-auto px-4"
          >
            <div className="flex flex-col items-center gap-1.5 md:gap-2 mb-6 md:mb-8">
              <span className="text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.25em] uppercase text-white drop-shadow-md">
                Modern Heritage.
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.25em] uppercase text-white drop-shadow-md">
                Woven for Tomorrow.
              </span>
            </div>
            
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors"
            >
              Shop Collection
            </Link>
          </div>
          
        </div>
      </section>

      <section className="min-h-[80vh] lg:h-screen w-full flex flex-col lg:flex-row border-b border-black">
        <div className="w-full lg:w-1/3 flex flex-col justify-center p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-black/10 shrink-0 bg-white">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-6 leading-none">
            Latest<br />Arrivals
          </h2>
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-600 mb-10 leading-relaxed">
            Discover the newest additions to our collection. Woven with precision, designed for the modern silhouette.
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-black border border-black text-sm font-semibold uppercase tracking-widest rounded-sm hover:bg-black hover:text-white transition-colors"
            >
              View All
            </Link>
            
            <div className="hidden lg:flex items-center gap-2 ml-4">
              <button 
                onClick={scrollLeft}
                className="p-3 border border-black rounded-sm hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                <ArrowLeft size={16} strokeWidth={2} />
              </button>
              <button 
                onClick={scrollRight}
                className="p-3 border border-black rounded-sm hover:bg-black hover:text-white transition-colors"
                aria-label="Scroll right"
              >
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="w-full lg:w-2/3 flex items-center overflow-x-auto p-4 md:p-8 gap-4 md:gap-8 snap-x snap-mandatory bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="shrink-0 w-64 md:w-80 lg:w-[500px] aspect-[2/3] bg-neutral-200 animate-pulse border border-black rounded-md snap-center"></div>
            ))
          ) : (
            latestItems.map((item) => (
              <Link 
                key={item.id} 
                to={`/shop/${item.id}`} 
                className="shrink-0 w-64 md:w-80 lg:w-[500px] aspect-[2/3] border border-black rounded-md overflow-hidden snap-center hover:opacity-80 transition-opacity bg-white"
              >
                <img 
                  src={`https://peru-alpaca-102666.hostingersite.com/items-images/${item.id}.jpg`} 
                  alt={item.productDisplayName || 'Latest Arrival'} 
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </Link>
            ))
          )}
          <div className="shrink-0 w-4 md:w-8"></div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-8 xl:px-12 border-b border-black bg-black overflow-hidden w-full">
        <div className="w-full mb-16 lg:mb-32 flex justify-center">
          <h2 className="text-4xl text-white md:text-6xl font-bold tracking-tighter uppercase text-center border-b-2 border-white pb-4 px-8 inline-block">
            Collections
          </h2>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-24 lg:gap-x-12 w-full lg:pb-[25vh]">
          {seasonalCollections.map((season, index) => {
            const isOffset = index % 2 !== 0; 
            const xOffsetClass = randomXOffsets[index];
            
            return (
              <div
                key={season.id}
                className={`
                  group relative aspect-[3/4] md:aspect-[2/3] block overflow-hidden border border-black bg-neutral-100
                  w-[90vw] sm:w-[80vw] rounded-md
                  ${isOffset ? 'self-end' : 'self-start'}
                  lg:w-[35vw] lg:self-auto
                  ${isOffset ? 'lg:justify-self-end lg:translate-y-[25vh]' : 'lg:justify-self-start'}
                  ${xOffsetClass}
                `}
              >
                <img 
                  src={season.img} 
                  alt={`${season.title} Collection`} 
                  className="parallax-img absolute w-full h-[120%] -top-[10%] left-0 object-cover origin-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 flex flex-col items-center justify-center p-8 z-10 text-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter text-white drop-shadow-md">
                      {season.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base font-medium tracking-widest uppercase max-w-[80%] drop-shadow-sm opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
                      {season.description}
                    </p>
                  </div>
                  <Link 
                    to={`/shop?season=${season.id}`}
                    className="mt-4 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-all opacity-100 translate-y-4 group-hover:translate-y-0 duration-500 ease-out delay-150"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative w-full flex flex-col items-center bg-black lg:py-16 border-b border-black overflow-hidden">
        
        <div className="w-full lg:w-[95vw] relative flex flex-col lg:block">

          <div className="w-full lg:w-[600px] lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-16 z-10 bg-black text-white p-6 md:p-12 lg:bg-transparent lg:p-0 flex flex-col justify-center order-1 lg:order-none shadow-none">
            
            {sustainabilityFeatures.map((feature, index) => {
              const isOpen = activeAccordion === index;

              return (
                <div 
                  key={index} 
                  className="group/acc border-b border-white/20 lg:border-white/50 last:border-none cursor-pointer"
                  onClick={() => toggleAccordion(index)} 
                >
                  <div className="flex justify-between items-center py-5 lg:py-6">
                    <h3 className={`text-base md:text-lg lg:text-2xl font-bold uppercase tracking-widest transition-colors lg:group-hover/acc:text-neutral-300 ${isOpen ? 'text-neutral-300' : ''}`}>
                      {feature.title}
                    </h3>
                    <ChevronDown 
                      size={24} 
                      strokeWidth={1.5} 
                      className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'group-hover/acc:rotate-180'}`} 
                    />
                  </div>

                  <div 
                    className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] group-hover/acc:grid-rows-[1fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 text-sm md:text-base lg:text-lg font-medium tracking-widest leading-relaxed text-neutral-400 lg:text-white/90">
                        {feature.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

          <div className="w-full aspect-video overflow-hidden order-2 lg:order-none relative border-y border-white/20 lg:border-none">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover lg:object-center"
            >
              <source src={sustainableVideo} type="video/mp4" />
            </video>
            <div className="hidden lg:block absolute inset-0 bg-black/20 pointer-events-none"></div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;