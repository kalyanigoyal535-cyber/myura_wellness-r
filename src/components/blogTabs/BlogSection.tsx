import React, { useEffect, useState } from "react";
import BlogCard from "../blogCard/BlogCard";
import { MainCard } from "../mainBlogCard/MainCard";
import { blogsApi, Blog } from "../../services/blogs";

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogsApi.getBlogs({
          published: true,
          page_size: 20,
        });
        setBlogs(response.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blogs");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Pick 3 blogs to show here (for example blogs 3–6)
  const displayedBlogs = blogs.slice(3, 6);

  if (loading) {
    return (
      <section className="text-[#192537]">
        <div className="flex justify-center items-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="text-[#192537]">
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="text-[#192537]">
      {/* Featured Blog */}
      <div className="mb-12 md:mb-16">
        <MainCard blogs={blogs} />
      </div>

      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold">Trending Insights</h2>
        <p className="text-sm text-gray-500">
          Fresh from the wellness desk • updated weekly
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mt-4">
        {displayedBlogs.length > 0 ? (
          displayedBlogs.map((blog, i) => (
            <div
              key={blog?.id ?? blog?.slug ?? i}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
            >
              <BlogCard blog={blog} />
            </div>
          ))
        ) : (
          <div className="col-span-12 text-center py-8 text-gray-500">
            No blogs found
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
