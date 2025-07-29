import React from "react";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";

// Placeholder image imports (replace with actual paths)
import aboutUs from "../../../assets/img/about/about-us.jpg";
import testimonialAuthor from "../../../assets/img/about/testimonial-author.jpg";
import testimonialPic from "../../../assets/img/about/testimonial-pic.jpg";
import team1 from "../../../assets/img/about/team-1.jpg";
import team2 from "../../../assets/img/about/team-2.jpg";
import team3 from "../../../assets/img/about/team-3.jpg";
import team4 from "../../../assets/img/about/team-4.jpg";
import client1 from "../../../assets/img/clients/client-1.png";
import client2 from "../../../assets/img/clients/client-2.png";
import client3 from "../../../assets/img/clients/client-3.png";
import client4 from "../../../assets/img/clients/client-4.png";
import client5 from "../../../assets/img/clients/client-5.png";
import client6 from "../../../assets/img/clients/client-6.png";
import client7 from "../../../assets/img/clients/client-7.png";
import client8 from "../../../assets/img/clients/client-8.png";

const About: React.FC = () => {
  return (
    <div>
      {/* Breadcrumb Section */}
      <div className="py-8 bg-gray-100 mb-20">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
          <div className="flex flex-col items-start">
            <h4 className="text-2xl font-semibold text-gray-800">About Us</h4>
            <div className="flex items-center space-x-2 text-gray-600 mt-2">
              <span className="text-sm cursor-pointer">Home</span>
              <span className="text-sm">/</span>
              <span className="text-sm text-gray-400">About Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-20">
        <div className="flex flex-col items-center">
          <img
            src={aboutUs}
            alt="About Us"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="text-start">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">
              Who We Are?
            </h4>
            <p className="text-sm text-gray-600 leading-loose">
              Contextual advertising programs sometimes have strict policies
              that need to be adhered to. Let’s take Google as an example.
            </p>
          </div>
          <div className="text-start">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">
              Who We Do?
            </h4>
            <p className="text-sm text-gray-600 leading-loose">
              In this digital generation where information can be easily
              obtained within seconds, business cards still have retained their
              importance.
            </p>
          </div>
          <div className="text-start">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">
              Why Choose Us
            </h4>
            <p className="text-sm text-gray-600 leading-loose">
              A two or three storey house is the ideal way to maximise the piece
              of earth on which our home sits, but for older or infirm people.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-100 mb-20 h-auto sm:h-[80vh] flex flex-col justify-center">
  <div className="max-w-7xl w-full mx-auto px-4 sm:px-16 flex flex-col lg:flex-row gap-8 items-center">
    
    {/* Câu nói */}
    <div className="flex flex-col items-center p-6 sm:p-10 lg:p-20 text-center">
      <Quote className="h-8 w-8 text-red-500 fill-red-500 mb-4" />
      <p className="text-base sm:text-lg text-gray-600 italic leading-relaxed sm:leading-loose">
        “Cuộc đời là vô số những lần lựa chọn, bạn sẽ không thể lựa chọn đúng mãi, 
        cho nên chọn thế nào cũng được và hãy làm những điều mình cảm thấy hài lòng. 
        Nhưng hãy nhớ một điều quan trọng là bạn đã làm gì để sẵn sàng cho lựa chọn đó, 
        để khi nhắc lại bạn sẽ không nói "Nếu như...".”
      </p>

      <div className="flex items-center mt-6">
        <p className="text-lg text-gray-600 font-bold bg-slate-400 w-12 h-12 rounded-full flex justify-center items-center">
          N
        </p>
        <div className="ml-4 text-left">
          <h5 className="text-base font-semibold text-gray-800">nhut379</h5>
          <p className="text-sm text-gray-600">...</p>
        </div>
      </div>
    </div>

    {/* Ảnh testimonial: ẩn trên mobile */}
    <div className="hidden lg:block w-full lg:w-1/2">
      <img
        src={testimonialPic}
        alt="Testimonial"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  </div>
</section>


      {/* Counter Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-20">
        <div className="flex justify-between sm:px-16 border-b-2 pb-20">
          <div className="flex items-center space-x-3">
            <h2 className="text-6xl font-bold text-gray-800">102</h2>
            <span className="text-lg font-semibold text-gray-600">
              Our <br /> Clients
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-6xl font-bold text-gray-800">30</h2>
            <span className="text-base font-semibold text-gray-600">
              Total <br /> Categories
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-6xl font-bold text-gray-800">102</h2>
            <span className="text-base font-semibold text-gray-600">
              In <br /> Country
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-6xl font-bold text-gray-800">
              98<span className="text-2xl">%</span>
            </h2>
            <span className="text-base font-semibold text-gray-600">
              Happy <br /> Customer
            </span>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-8">
          <span className="text-sm text-red-500 uppercase tracking-wider">
            Our Team
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            Meet Our Team
          </h2>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center space-x-16">
            <div className="w-56 h-64 flex justify-center items-center font-bold bg-slate-300">
N
            </div>
            <div className="p-4 text-start">
              <h4 className="text-3xl font-semibold text-gray-800">
                Nhut379
              </h4>
              <span className="text-sm text-gray-600">Dev</span>
            </div>
          </div>
        </div>
      </section>

      {/* Client Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-32">
        <div className="text-center mb-20">
          <span className="text-sm text-red-500 uppercase tracking-wider">
             Partner
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            Happy Clients
          </h2>
        </div>
        <div className="flex flex-wrap justify-center space-x-10">
          <a href="#" className="flex justify-center">
            <img src={client1} alt="Client 1" className="h-12 object-contain" />
          </a>
          <a href="#" className="flex justify-center">
            <img src={client2} alt="Client 2" className="h-12 object-contain" />
          </a>
          <a href="#" className="flex justify-center">
            <img src={client3} alt="Client 3" className="h-12 object-contain" />
          </a>
          <a href="#" className="flex justify-center">
            <img src={client4} alt="Client 4" className="h-12 object-contain" />
          </a>
          <a href="#" className="flex justify-center">
            <img src={client5} alt="Client 5" className="h-12 object-contain" />
          </a>
          <a href="#" className="flex justify-center">
            <img src={client6} alt="Client 6" className="h-12 object-contain" />
          </a>
          <a href="#" className="flex justify-center">
            <img src={client7} alt="Client 7" className="h-12 object-contain" />
          </a>
          <a href="#" className="flex justify-center">
            <img src={client8} alt="Client 8" className="h-12 object-contain" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
8;
