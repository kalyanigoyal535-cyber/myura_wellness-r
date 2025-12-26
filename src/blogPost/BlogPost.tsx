import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogsApi, Blog, ContentBlock } from "../services/blogs";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await blogsApi.getBlog(slug);
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] py-8 md:py-12 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center text-gray-600 py-20">
        <h1 className="text-2xl font-semibold mb-2">Blog Not Found</h1>
        <p>{error || `Slug not found: ${slug}`}</p>
        <Link
          to="/blog"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/uploads/")) {
      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const baseUrl = API_BASE_URL.replace("/api", "");
      return `${baseUrl}${imagePath}`;
    }
    return imagePath;
  };

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
            src={
              getImageUrl(blog.featured_image_url) ||
              getImageUrl(blog.thumbnail_url) ||
              getImageUrl(blog.featured_image) ||
              getImageUrl(blog.thumbnail) ||
              ""
            }
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
              <p>{blog.date || blog.published_at || blog.created_at}</p>
              <p>By {blog.author || blog.author_name || "Admin"}</p>
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
          {blog.content_blocks && blog.content_blocks.length > 0 ? (
            blog.content_blocks.map((block: ContentBlock, i: number) => {
              if (block.type === "heading")
                return (
                  <h2 key={i} className="mt-10">
                    {block.data as string}
                  </h2>
                );

              if (block.type === "text")
                return (
                  <p key={i} className="whitespace-pre-line">
                    {block.data as string}
                  </p>
                );

              if (block.type === "list" && Array.isArray(block.data))
                return (
                  <ul key={i} className="list-disc list-inside my-4 space-y-2">
                    {block.data.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                );

              if (block.type === "image")
                return (
                  <div key={i} className="my-8">
                    <img
                      src={getImageUrl(block.src)}
                      alt={block.alt || "blog image"}
                      className="w-full max-h-[500px] object-cover rounded-xl shadow"
                    />
                    {block.caption && (
                      <p className="text-sm text-gray-500 text-center mt-2">
                        {block.caption}
                      </p>
                    )}
                  </div>
                );

              return null;
            })
          ) : (
            <div className="whitespace-pre-line">
              {blog.content || blog.excerpt || ""}
            </div>
          )}
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
