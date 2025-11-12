import React from "react";
import BlogCard from "../blogCard/BlogCard";
import { MainCard } from "../mainBlogCard/MainCard";
import blogs from "../../data/myuraBlogs.json";

const BlogSection: React.FC = () => {
  // Pick 3 blogs to show here (for example blogs 3–5)
  const displayedBlogs = blogs.slice(3, 6);

  return (
    <div className="text-[#192537] p-4 max-w-7xl mx-auto">
      {/* Your main card stays unchanged */}
      <MainCard />

      {/* 👇 Now we pass actual blog data */}
      <div className="mt-4 p-4 grid grid-cols-12">
      {displayedBlogs.map((blog, i) => (
        <BlogCard key={i} blog={blog} />  
      ))}
      </div>
    </div>
  );
};

export default BlogSection;
