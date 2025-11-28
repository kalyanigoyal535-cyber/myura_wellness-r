import React from "react";
import { useParams, Link } from "react-router-dom";
import blogs from "../data/myuraBlogs.json";
import { ArrowLeft } from "lucide-react";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find((b: any) => b.slug === slug);

  if (!blog) {
    return (
      <div className="text-center text-gray-600 py-20">
        <h1 className="text-2xl font-semibold mb-2">Blog Not Found</h1>
        <p>Slug not found: {slug}</p>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[#F8F8F8] py-8 md:py-12">
      <div className="max-w-[750px] mx-auto px-4 md:px-6">
        
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm mb-6 text-[#1E2738] hover:text-[#5BD4C5] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        {/* Featured Image Container */}
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-[260px] sm:h-[350px] md:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-5 left-4 right-4 sm:left-6 sm:right-6">
            <span className="inline-block px-3 py-1 mb-2 text-[11px] font-medium text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
              Featured
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-white">
              {blog.title}
            </h1>
            <div className="flex justify-between text-[11px] sm:text-xs text-white/85 mt-2">
              <p>{blog.date}</p>
              <p>By {blog.author}</p>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        {blog.subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            {blog.subtitle}
          </p>
        )}

        {/* Body Content */}
        <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none prose-headings:text-[#1E2738] prose-p:text-gray-700 prose-img:rounded-xl prose-img:shadow">
          {blog.contentBlocks?.map((block: any, i: number) => {
            if (block.type === "heading")
              return (
                <h2 key={i} className="mt-10">
                  {block.data}
                </h2>
              );

            if (block.type === "text")
              return (
                <p key={i} className="whitespace-pre-line">
                  {block.data}
                </p>
              );

            if (block.type === "image")
              return (
                <div key={i} className="my-8">
                  <img
                    src={block.src}
                    alt={block.alt || "blog image"}
                    className="w-full max-h-[500px] object-cover rounded-xl shadow"
                  />
                </div>
              );

            return null;
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/blog"
            className="px-6 py-2 rounded-full bg-[#1E2738] text-white hover:bg-[#141b25] transition"
          >
            Read More Articles
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
