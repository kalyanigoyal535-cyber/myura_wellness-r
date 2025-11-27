import { Link } from "react-router-dom";
import blogs from "../../data/myuraBlogs.json"

export const MainCard = () => {
  const mainBlog = blogs[0]; // The main big block
  const sideBlogs = blogs.slice(1, 3); // The next 2 small ones
console.log("blogs:",blogs);
  return (
    <div className="max-w-[90%] mx-auto px-4 py-10">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
        {/* LEFT SECTION (Big Block) */}
        <div className="md:col-span-6 rounded-xl flex flex-col text-black justify-center text-xl font-semibold min-h-[400px] shadow-md hover:shadow-lg">
          <Link to={`/blog/${mainBlog.slug}`}>
            <img
              src={mainBlog.thumbnail}
              alt={mainBlog.title}
              className="w-full rounded-xl"
            />
            <h1 className="mt-4">{mainBlog.title}</h1>
            <p className="text-sm font-medium mt-2">
              {mainBlog.excerpt.slice(0, 150)}...
            </p>
            <div className="flex justify-between text-xs underline mt-3">
              <p>Date: {mainBlog.date}</p>
              <p>Written by {mainBlog.author}</p>
            </div>
          </Link>
        </div>

        {/* RIGHT SECTION (Small Blog Blocks) */}
        <div className="col-span-2 flex flex-col gap-6">
          {sideBlogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="rounded-xl flex flex-col justify-center font-semibold min-h-[220px] "
            >
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="rounded-lg mb-2"
              />
              <h1 className="text-base">{blog.title}</h1>
              <p className="text-sm font-medium mt-1">
                {blog.excerpt.slice(0, 100)}...
              </p>
              <div className="flex justify-between text-xs underline mt-2">
                <p>Date: {blog.date}</p>
                <p>Written by {blog.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
