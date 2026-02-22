import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white" data-theme="lofi">
      <Navbar />
      
      <main className="w-full flex flex-col min-h-screen">
        <Outlet /> 
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default RootLayout;