import calendarIcon from "../../assets/img/icon/calendar.png"; 
import { Page } from "@/common/hooks/type";
import { useGetApi } from "@/common/hooks/use-get-api";
import { toast } from "@/common/hooks/use-toast";
import { BlogAll } from "@/pages/dashboard/type";
import { formatDateTime } from "@/common/lib/utils";

const Blog = () => {
  const {
    data: blogs,
  } = useGetApi<Page<BlogAll>>({
    endpoint: "/blog/all",
    params: {
      page: 0,
      size: 3,
      sort: "desc",
    },
    enabled: true,
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message || "Failed to load blogs",
        variant: "destructive",
      }),
  });

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
          {blogs?.contents.map((blog, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-white">
                <div
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(https://res.cloudinary.com/dazttnakn/image/upload/${blog.image})` }}
                ></div>
             <div className="p-6  relative -mt-24 z-10">
                  <div className="bg-white p-6 ">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <img
                        src={calendarIcon}
                        alt="calendar"
                        className="w-4 h-4 mr-2"
                      />
                      {formatDateTime(blog.createAt)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {blog.title}
                    </h3>
                     <a
                        href={`/blog-detail?code=${encodeURIComponent(
                          blog.code
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Product Detail"
                      
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
