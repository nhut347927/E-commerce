import calendarIcon from "../../assets/img/icon/calendar.png"; 
import img1 from "../../assets/img/blog/blog-1.jpg";
import img2 from "../../assets/img/blog/blog-2.jpg";
import img3 from "../../assets/img/blog/blog-3.jpg";

const Blog = () => {
  const blogs = [
    {
      title: "What Curling Irons Are The Best Ones",
      date: "16 February 2020",
      img: img1,
    },
    {
      title: "Eternity Bands Do Last Forever",
      date: "21 February 2020",
      img: img2,
    },
    {
      title: "The Health Benefits Of Sunglasses",
      date: "28 February 2020",
      img: img3,
    },
  ];

  return (
    <section className="pb-20">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-16">
        <div className="text-center mb-12">
          <p className="text-red-500 uppercase tracking-wide font-semibold mb-6">
            Latest News
          </p>
          <h2 className="text-3xl font-bold">Fashion New Trends</h2>
        </div>

        <div className="flex flex-wrap -mx-4">
          {blogs.map((blog, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white">
                <div
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${blog.img})` }}
                ></div>
             <div className="p-6  relative -mt-24 z-10">
                  <div className="bg-white p-6 ">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <img
                        src={calendarIcon}
                        alt="calendar"
                        className="w-4 h-4 mr-2"
                      />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
