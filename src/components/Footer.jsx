import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const textRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current.children,
        { 
          opacity: 0, 
          yPercent: 50 
        },
        {
          opacity: 1,
          yPercent: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 95%', 
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="h-screen w-full bg-black text-white flex flex-col justify-between pt-16 md:pt-58 px-4 md:px-8 pb-4 overflow-hidden selection:bg-white selection:text-black">
      
      <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 h-full mx-auto w-full">
        

        <div className="flex flex-col max-w-lg w-full">
          <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">
            Join Our Community
          </h3>
          <p className="text-sm font-medium tracking-widest text-neutral-400 mb-10 uppercase leading-relaxed">
            Subscribe to receive early access to new collections, exclusive editorial content, and community-only releases.
          </p>
          
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex items-end border-b border-white pb-2 group"
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent outline-none flex-1 text-sm uppercase tracking-widest placeholder:text-neutral-600 text-white"
            />
            <button 
              type="submit" 
              className="uppercase text-xs font-bold tracking-widest hover:text-neutral-400 transition-colors flex items-center gap-2"
            >
              Subscribe
              <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        <div className="flex flex-col sm:flex-row gap-16 md:gap-32 mb-10">
          
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Explore</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium uppercase tracking-widest">
              <li><Link to="#" className="hover:text-neutral-400 transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-neutral-400 transition-colors">FAQ</Link></li>
              <li><Link to="#" className="hover:text-neutral-400 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-neutral-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Social</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium uppercase tracking-widest">
              <li>
                <Link to="#" className="group flex items-center gap-1 hover:text-neutral-400 transition-colors">
                  Instagram
                  <ArrowUpRight size={14} strokeWidth={2} className="opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link to="#" className="group flex items-center gap-1 hover:text-neutral-400 transition-colors">
                  WhatsApp
                  <ArrowUpRight size={14} strokeWidth={2} className="opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <div className="flex flex-col items-center justify-end w-full mt-auto">
        
        <div className="w-full flex justify-between items-end mb-2 md:mb-4 px-1 text-[10px] md:text-xs uppercase tracking-widest font-semibold text-neutral-500">
          <span>&copy; 2026 Hablonne</span>
          <span>All Rights Reserved</span>
        </div>
        <div 
          ref={textRef}
          className="w-full flex justify-between items-center text-[15vw] sm:text-[16vw] font-bold leading-[0.75] tracking-tighter uppercase select-none overflow-hidden"
        >
          <span className="inline-block">H</span>
          <span className="inline-block">A</span>
          <span className="inline-block">B</span>
          <span className="inline-block">L</span>
          <span className="inline-block">O</span>
          <span className="inline-block">N</span>
          <span className="inline-block">N</span>
          <span className="inline-block">E</span>
        </div>
        
      </div>

    </footer>
  );
};

export default Footer;