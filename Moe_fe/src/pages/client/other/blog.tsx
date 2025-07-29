import React from 'react';
import calendarIcon from "../../../assets/img/icon/calendar.png"; 
// Placeholder image imports (replace with actual paths)
import breadcrumbBg from '../../../assets/img/breadcrumb-bg.jpg';
import blog1 from '../../../assets/img/blog/blog-1.jpg';
import blog2 from '../../../assets/img/blog/blog-2.jpg';
import blog3 from '../../../assets/img/blog/blog-3.jpg';
import blog4 from '../../../assets/img/blog/blog-4.jpg';
import blog5 from '../../../assets/img/blog/blog-5.jpg';
import blog6 from '../../../assets/img/blog/blog-6.jpg';
import blog7 from '../../../assets/img/blog/blog-7.jpg';
import blog8 from '../../../assets/img/blog/blog-8.jpg';
import blog9 from '../../../assets/img/blog/blog-9.jpg';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  image: string;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'What Curling Irons Are The Best Ones',
      date: '16 February 2020',
      image: blog1,
    },
    {
      id: '2',
      title: 'Eternity Bands Do Last Forever',
      date: '21 February 2020',
      image: blog2,
    },
    {
      id: '3',
      title: 'The Health Benefits Of Sunglasses',
      date: '28 February 2020',
      image: blog3,
    },
    {
      id: '4',
      title: 'Aiming For Higher The Mastopexy',
      date: '16 February 2020',
      image: blog4,
    },
    {
      id: '5',
      title: 'Wedding Rings A Gift For A Lifetime',
      date: '21 February 2020',
      image: blog5,
    },
    {
      id: '6',
      title: 'The Different Methods Of Hair Removal',
      date: '28 February 2020',
      image: blog6,
    },
    {
      id: '7',
      title: 'Hoop Earrings A Style From History',
      date: '16 February 2020',
      image: blog7,
    },
    {
      id: '8',
      title: 'Lasik Eye Surgery Are You Ready',
      date: '21 February 2020',
      image: blog8,
    },
    {
      id: '9',
      title: 'Lasik Eye Surgery Are You Ready',
      date: '28 February 2020',
      image: blog9,
    },
  ];

  return (
    <div>
      {/* Breadcrumb Section */}
      <div
        className="h-96 bg-cover bg-center flex justify-center items-center mb-20"
        style={{ backgroundImage: `url(${breadcrumbBg})` }}
      >
       
          <h2 className="text-6xl font-semibold text-white">Our Blog</h2>
       
      </div>

      {/* Blog Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 mb-20">
        <div className="flex flex-wrap">
          {blogPosts.map((blog, index) => (
             <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white">
                <div
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${blog.image})` }}
                ></div>
                <div className="bg-white p-6 mt-[-2rem] relative z-10">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <img src={calendarIcon} alt="calendar" className="w-4 h-4 mr-2" />
                    {blog.date}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {blog.title}
                  </h3>
                  <a
                    href="#"
                    className="text-sm text-black font-semibold underline underline-offset-4 hover:text-red-500 transition"
                  >
                    READ MORE
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;