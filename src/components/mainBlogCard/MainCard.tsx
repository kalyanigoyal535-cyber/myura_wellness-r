import { Link } from "react-router-dom";
import blogs from "../../data/myuraBlogs.json";

export const MainCard = () => {
  const mainBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 3);

  return (
    <div className="max-w-[90%] mx-auto px-4 py-10">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
        {/* LEFT SECTION (Large Featured Blog) */}
        <Link
          to={`/blog/${mainBlog.slug}`}
          className="md:col-span-6 rounded-2xl overflow-hidden group relative shadow-md hover:shadow-xl transition-all duration-300 min-h-[420px]"
        >
          <img
            src={mainBlog.thumbnail}
            alt={mainBlog.title}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>

          {/* Content */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span className="inline-flex px-3 py-1 text-[11px] mb-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              Featured Article
            </span>
            <h1 className="text-xl md:text-2xl font-semibold leading-snug">
              {mainBlog.title}
            </h1>
            <p className="text-sm text-white/90 mt-2">
              {mainBlog.excerpt.slice(0, 140)}...
            </p>
            <div className="flex justify-between text-xs opacity-80 mt-3">
              <p>{mainBlog.date}</p>
              <p>By {mainBlog.author}</p>
            </div>
          </div>
        </Link>

        {/* RIGHT SECTION (Side Blogs) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {sideBlogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="rounded-2xl overflow-hidden group relative min-h-[220px] shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>

              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-base font-semibold text-white leading-tight">
                  {blog.title}
                </h1>
                <p className="text-xs text-white/90 mt-1">
                  {blog.excerpt.slice(0, 90)}...
                </p>
                <div className="flex justify-between text-xs text-white/70 mt-2">
                  <p>{blog.date}</p>
                  <p>By {blog.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
