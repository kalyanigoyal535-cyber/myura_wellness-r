import React from "react";
import { useParams } from "react-router-dom";
import blogs from "../data/myuraBlogs.json"

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // ✅ get slug from URL
  const blog = blogs.find((b: any) => b.slug === slug); // find matching blog
  console.log("🚀 ~ BlogPost ~ blog:", blog)

  // ✅ prevent crash if no blog is found
  if (!blog) {
    console.warn("Blog not found for slug:", slug);
    console.log("Available slugs:", blogs.map((b: any) => b.slug));
    return (
      <div className="text-center text-gray-600 py-20">
        <h1 className="text-2xl font-semibold mb-2">Blog Not Found</h1>
        <p>Slug not found: {slug}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full h-80 object-cover rounded-lg mb-8"
      />
      <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
      <p className="text-gray-600 mb-8">{blog.subtitle}</p>

      {blog.contentBlocks?.map((block: any, i: number) => {
  if (block.type === "heading")
    return (
      <h2 key={i} className="text-2xl font-semibold mt-8 mb-4">
        {block.data}
      </h2>
    );

  if (block.type === "text")
    return (
      <p
        key={i}
        className="text-lg mb-4 leading-relaxed whitespace-pre-line"
      >
        {block.data}
      </p>
    );

  // 🖼️ handle image block
  if (block.type === "image")
    return (
      <div key={i} className="my-8 text-center">
        <img
          src={block.src}
          alt={block.alt || "blog image"}
          className="w-full max-h-[500px] object-cover rounded-lg mx-auto"
        />
        {/* {block.caption && (
          <p className="text-sm text-gray-500 mt-2 italic">{block.caption}</p>
        )} */}
      </div>
    );

  return null;
})}

    </div>
  );
};

export default BlogPost;
