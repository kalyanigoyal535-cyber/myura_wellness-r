import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

interface BlogCardProps {
  blog?: {
    thumbnail: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    slug: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  
  if (!blog) return null;
  return ( 
    <div className="col-span-12 md:col-span-4 m-4 bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300">
      <Link to={`/blog/${blog.slug}`}>
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-t-xl"
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
