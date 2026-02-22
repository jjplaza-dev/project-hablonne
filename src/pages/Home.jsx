import React from 'react';
import { Link } from 'react-router-dom';

// Import the video file from your assets folder
import heroVideo from '../assets/videos/InitialEdit.mp4'; 

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center border-b border-black px-4 overflow-hidden">

        {/* Hero Content (z-10 ensures it sits above the video) */}
        <div className="relative z-10 text-center flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-4 text-black">
            Hablonne
          </h1>
          <p className="text-base md:text-lg font-medium tracking-widest max-w-md mx-auto mb-8 uppercase text-black">
            Modern Heritage. Woven for Tomorrow.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex px-8 py-3 bg-black text-white text-sm font-semibold uppercase tracking-widest rounded-md hover:bg-neutral-800 transition-colors"
          >
            Shop Collection
          </Link>
        </div>
        
        {/* Background Video Wrapper */}
        <div className="absolute inset-0 z-0 bg-neutral-100">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Subtle overlay to ensure the black text remains highly legible over the video */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
        </div>
      </section>

      {/* Featured Section Placeholder */}
      <section className="py-24 px-4 md:px-8 border-b border-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-baseline mb-12">
          <h2 className="text-3xl font-bold tracking-tight uppercase">Latest Arrivals</h2>
          <Link to="/shop" className="text-sm font-bold hover:underline tracking-widest uppercase mt-4 md:mt-0">
            View All →
          </Link>
        </div>
        
        {/* Grid placeholder for the ProductCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-[2/3] border border-black rounded-md flex items-center justify-center bg-neutral-50">
              <span className="text-xs tracking-widest uppercase">Item {item}</span>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default Home;