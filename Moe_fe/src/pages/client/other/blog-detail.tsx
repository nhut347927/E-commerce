import React, { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Quote,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Placeholder image imports (replace with actual paths)
import blogDetails from "../../../assets/img/blog/details/blog-details.jpg";
import blogAuthor from "../../../assets/img/blog/details/blog-author.jpg";

interface FormData {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

interface Errors {
  name?: string;
  email?: string;
  comment?: string;
}

interface BlogData {
  id: string;
  title: string;
  author: string;
  date: string;
  comments: number;
}

const BlogDetail: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const blog: BlogData = {
    id: "1",
    title: "Are you one of the thousands of iPhone owners who has no idea",
    author: "Deercreative",
    date: "February 21, 2019",
    comments: 8,
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div>
      {/* Blog Hero Section */}
      <section className="h-[60vh] bg-gray-100 py-16">
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-16 flex justify-center items-center">
          <div className="text-center space-y-8">
            <h2 className="max-w-4xl text-4xl font-semibold text-gray-800">
              {blog.title}
            </h2>
            <ul className="flex justify-center space-x-4 text-sm text-gray-600">
              <li>By {blog.author}</li> <p>|</p>
              <li>{blog.date}</li>
              <p>|</p>
              <li>{blog.comments} Comments</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Blog Details Section */}
      <section className="max-w-7xl w-full mx-auto px-3 sm:px-16 -mt-52 mb-32">
        <div className="flex flex-col items-center">
          <img
            src={blogDetails}
            alt={blog.title}
            className="w-full h-auto object-cover rounded-lg shadow-md mb-8"
          />
          <div className="max-w-3xl w-full mt-8">
            {/* Blog Content */}
            <div className="space-y-6 leading-loose text-base text-gray-600">
              <p>
                Hydroderm is the highly desired anti-aging cream on the block.
                This serum restricts the occurrence of early aging signs on the
                skin and keeps the skin younger, tighter, and healthier. It
                reduces the wrinkles and loosening of skin. This cream nourishes
                the skin and brings back the glow that had lost in the run of
                hectic years.
              </p>
              <p>
                The most essential ingredient that makes hydroderm so effective
                is Vyo-Serum, which is a product of natural selected proteins.
                This concentrate works actively in bringing about the natural
                youthful glow of the skin. It tightens the skin along with its
                moisturizing effect on the skin. The other important ingredient,
                making hydroderm so effective is “marine collagen” which along
                with Vyo-Serum helps revitalize the skin.
              </p>

              <p>
                Vyo-Serum along with tightening the skin also reduces the fine
                lines indicating aging of skin. Problems like dark circles,
                puffiness, and crow’s feet can be controlled from the strong
                effects of this serum.
              </p>
              <p>
                Hydroderm is a multi-functional product that helps in reducing
                the cellulite and giving the body a toned shape, also helps in
                cleansing the skin from the root and not letting the pores clog,
                nevertheless also lets sweeps out the wrinkles and all signs of
                aging from the sensitive near the eyes.
              </p>
            </div>

            {/* Author and Tags */}
            <div className="flex justify-between items-center border-t-2 pt-8 mt-10">
              <div className="flex items-center">
                <img
                  src={blogAuthor}
                  alt="Aiden Blair"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h5 className="text-base font-semibold text-gray-800">
                    Aiden Blair
                  </h5>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  to="/blog?tag=fashion"
                  className="text-black font-bold hover:underline"
                >
                  #Fashion
                </Link>
                <Link
                  to="/blog?tag=trending"
                  className="text-black font-bold hover:underline"
                >
                  #Trending
                </Link>
                <Link
                  to="/blog?tag=2020"
                  className="text-black font-bold hover:underline"
                >
                  #2020
                </Link>
              </div>
            </div>

            {/* Navigation */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <Link
                to="/blog/prev"
                className="flex flex-col p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <p className="text-sm text-gray-600 flex items-center">
                  <ArrowLeft className="h-4 w-4 text-red-500 mr-2" /> Previous
                  Post
                </p>
                <h5 className="text-base font-semibold text-gray-800">
                  It’s Classified How To Utilize Free Classified Ad Sites
                </h5>
              </Link>
              <Link
                to="/blog/next"
                className="flex flex-col p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200 text-right"
              >
                <p className="text-sm text-gray-600 flex items-center justify-end">
                  Next Post <ArrowRight className="h-4 w-4 text-red-500 ml-2" />
                </p>
                <h5 className="text-base font-semibold text-gray-800">
                  Tips For Choosing The Perfect Gloss For Your Lips
                </h5>
              </Link>
            </div> */}

            {/* Comment Form */}
            <div className="mt-12">
              <h4 className="text-center text-2xl font-semibold text-gray-800 mb-10">
                Leave A Comment
              </h4>
              <form className="space-y-8">
              
                <div>
                  <Textarea
                    name="Comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Comment"
                    className={`h-52 border-gray-300 rounded-none text-gray-700 focus:ring-red-500 ${
                      errors.comment ? "border-red-500" : ""
                    }`}
                    rows={5}
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.comment}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full bg-black hover:bg-black/70 text-white rounded-none uppercase tracking-widest"
                >
                  Post Comment
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
