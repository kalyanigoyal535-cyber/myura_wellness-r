import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }: any) => {
  return (
    <div className="col-span-12 md:col-span-4 m-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-300">
      <Link to={`/blog/${blog.slug}`}>
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h1 className="text-xl font-semibold mb-2 line-clamp-2">
            {blog.title}
          </h1>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {blog.excerpt}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <p>{blog.date}</p>
            <p className="underline">{blog.author}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
