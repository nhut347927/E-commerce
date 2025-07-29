import { useEffect, useState } from "react";
import productSale from "../../assets/img/product-sale.png";
const Categories = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 ngày sau

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: Math.max(days, 0),
        hours: Math.max(hours, 0),
        minutes: Math.max(minutes, 0),
        seconds: Math.max(seconds, 0),
      });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-[80vh] py-10 flex items-center bg-orange-50/50">
      <div className="max-w-7xl w-full h-full flex mx-auto px-3 sm:px-16 ">
       <div className="w-full h-full flex flex-col sm:flex-row space-y-20 sm:space-y-0 sm:justify-between items-center">

          <div className="space-y-5">
            <p className="inline-block text-3xl text-zinc-400 font-bold hover:text-zinc-800">
              Clothings Hot
            </p>
            <p className="inline-block text-3xl text-zinc-900 font-bold hover:text-zinc-800">
              Shoe Collection
            </p>
            <p className="inline-block text-3xl text-zinc-400 font-bold hover:text-zinc-800">
              Accessories
            </p>
          </div>

          <div className="w-full">
            <div className="flex justify-center">
              <div className="relative rounded-lg overflow-hidden">
                <img src={productSale} alt="Hot Deal" className="w-96 h-auto" />
                <div className="absolute top-0 right-0 bg-zinc-950 text-white flex justify-center items-center w-24 h-24 rounded-full">
                  <div className="text-center">
                    <span className="block text-xs uppercase">Sale Of</span>
                    <h5 className="text-lg font-semibold">$29.99</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <span className="text-sm text-red-600 uppercase tracking-widest font-medium">
                Deal Of The Week
              </span>
              <h2 className=" text-black text-4xl font-medium mt-4">
                Multi-pocket Chest Bag Black
              </h2>

              <div className="flex text-center space-x-4 mb-4 mt-6">
                <div className="mt-1">
                  <span className="text-black text-4xl font-medium">
                    {timeLeft.days}
                  </span>
                  <p className="text-black text-base font-sans mt-4">Days</p>
                </div>
                <p className="text-black text-4xl font-medium">:</p>
                <div className="mt-1">
                  <span className="text-black text-4xl font-medium">
                    {timeLeft.hours}
                  </span>
                  <p className="text-black text-base font-sans mt-4">Hours</p>
                </div>
                <p className="text-black text-4xl font-medium">:</p>
                <div className="mt-1">
                  <span className="text-black text-4xl font-medium">
                    {timeLeft.minutes}
                  </span>
                  <p className="text-black text-base font-sans mt-4">Minutes</p>
                </div>
                <p className="text-black text-4xl font-medium">:</p>
                <div className="mt-1">
                  <span className="text-black text-4xl font-medium">
                    {timeLeft.seconds}
                  </span>
                  <p className="text-black text-base font-sans mt-4">Seconds</p>
                </div>
              </div>

              <button className="bg-black text-white text-sm uppercase font-semibold px-12 py-4 tracking-widest items-center hover:bg-gray-900 transition mt-6">
                Shop now <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
