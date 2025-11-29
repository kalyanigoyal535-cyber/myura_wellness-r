import React from "react";
import BlogCard from "../blogCard/BlogCard";
import { MainCard } from "../mainBlogCard/MainCard";
import blogs from "../../data/myuraBlogs.json";

const BlogSection: React.FC = () => {
  // Pick 3 blogs to show here (for example blogs 3–5)
  const displayedBlogs = blogs.slice(3, 6);

  return (
    <section className="text-[#192537]">
      {/* Featured Blog */}
      <div className="mb-12 md:mb-16">
        <MainCard />
      </div>

      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold">
          Trending Insights
        </h2>
        <p className="text-sm text-gray-500">
          Fresh from the wellness desk • updated weekly
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mt-4">
  {displayedBlogs.map((blog, i) => (
    <div
      key={blog?.id ?? blog?.slug ?? i}
      className="col-span-12 sm:col-span-6 lg:col-span-4"
    >
      <BlogCard blog={blog} />
    </div>
  ))}
</div>
    </section>
  );
};

export default BlogSection;
