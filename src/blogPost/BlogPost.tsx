import { useParams } from "react-router-dom";
import blogs from "../data/myuraBlogs.json";

export default function BlogPost() {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return <p className="text-center text-gray-500">Blog not found</p>;
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

      {blog.contentBlocks.map((block, i) => {
  if (block.type === "heading")
    return (
      <h2 key={i} className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
        {block.data}
      </h2>
    );

  if (block.type === "text")
    return (
      <p
        key={i}
        className="text-lg text-gray-800 mb-4 leading-relaxed whitespace-pre-line"
      >
        {block.data}
      </p>
    );

  if (block.type === "image")
    return (
      <figure key={i} className="my-6">
        <img
          src={block.src}
          alt={block.alt}
          className="rounded-lg shadow-md"
        />
        {block.caption && (
          <figcaption className="text-sm text-gray-500 text-center mt-2">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );

  return null;
})}

    </div>
  );
}
