import React from 'react';
import banner1 from '../../assets/img/banner/banner-1.jpg';
import banner2 from '../../assets/img/banner/banner-2.jpg';
import banner3 from '../../assets/img/banner/banner-3.jpg';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

const Banner = () => {
  return (
    <section>
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
        <ResizablePanelGroup direction="horizontal" className="w-full border">
          {/* Banner lớn bên trái */}
          <ResizablePanel
            defaultSize={60}
            minSize={30}
            maxSize={70}
            className="h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]"
          >
            <div className="relative group overflow-hidden h-full">
              <img
                src={banner1}
                alt="Clothing Collections"
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-700" />
              <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-8 md:px-10 text-white z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight drop-shadow-md">
                  Clothing Collections 2030
                </h2>
                <span className="mt-4 sm:mt-5 px-5 sm:px-6 py-3 bg-white text-black font-semibold text-xs sm:text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition cursor-pointer">
                  Shop now
                </span>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-gray-300 w-1" />

          {/* Cột 2 bên phải gồm 2 banner nhỏ */}
          <ResizablePanel
            defaultSize={40}
            minSize={30}
            maxSize={70}
            className="h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]"
          >
            <ResizablePanelGroup direction="vertical">
              {/* Banner nhỏ 1 */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="relative group h-full overflow-hidden">
                  <img
                    src={banner2}
                    alt="Accessories"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-700" />
                  <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 text-white z-10">
                    <h2 className="text-lg sm:text-xl font-semibold drop-shadow-md">Accessories</h2>
                    <span className="mt-2 inline-block px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition cursor-pointer">
                      Shop now
                    </span>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-gray-300 h-1" />

              {/* Banner nhỏ 2 */}
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="relative group h-full overflow-hidden">
                  <img
                    src={banner3}
                    alt="Shoes Spring 2030"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition duration-700" />
                  <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 text-white z-10">
                    <h2 className="text-lg sm:text-xl font-semibold drop-shadow-md">Shoes Spring 2030</h2>
                    <span className="mt-2 inline-block px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition cursor-pointer">
                      Shop now
                    </span>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </section>
  );
};

export default Banner;
