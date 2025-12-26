import React from "react";
import { Link } from "react-router-dom";

import { Blog } from "../../services/blogs";

interface BlogCardProps {
  blog?: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  if (!blog) return null;

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="col-span-12 md:col-span-4 group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image wrapper */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={blog.featured_image_url || blog.thumbnail_url || blog.featured_image || blog.thumbnail || ''}
          alt={blog.title}
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-80 transition-opacity rounded-2xl" />
      </div>

      {/* Text Content */}
      <div className="p-4 md:p-5">
        <h1 className="text-base md:text-lg font-semibold mb-2 line-clamp-2 text-[#1E2738] group-hover:text-[#5BD4C5] transition-colors">
          {blog.title}
        </h1>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {blog.excerpt || blog.content || ''}
        </p>

        <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
          <p>{blog.date || blog.published_at || blog.created_at}</p>
          <p className="underline">{blog.author || blog.author_name || 'Admin'}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
