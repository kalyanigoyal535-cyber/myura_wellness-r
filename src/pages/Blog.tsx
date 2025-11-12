import React from "react";
import { Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Divider, Input } from "@mantine/core";
import BlogTabs from "../components/blogTabs/BlogTabs";

const Blog: React.FC = () => {
  return (
    <div className="p-4">
      {/* Reverse Back */}
      <Link to="/" className="flex items-center text-lg ">
        <ArrowLeft className="mr-2" /> BACK
      </Link>

      <Divider my="sm" />
        {/*Heading */}

      <div className="flex flex-col items-center p-2">
        <h1 className="text-[#192537] text-3xl font-semibold">
          Myura Blogs
        </h1>
        <p>Know more about Ayurveda </p>
      </div>
      {/* Tabs  */}
      <BlogTabs/>

    </div>
  );
};

export default Blog;


const blogPosts = [
  {
    id: 1,
    title: "The Power of Functional Foods: Nutrition That Heals",
    excerpt:
      "When it comes to eating healthy, there's a growing interest in foods that do more than just fill our stomachs.",
    date: "August 19, 2025",
    comments: 0,
    image: "/api/placeholder/400/300",
    category: "Nutrition",
  },
  {
    id: 2,
    title: "Understanding Ayurvedic Principles for Modern Wellness",
    excerpt:
      "Discover how ancient wisdom can guide your modern wellness journey with practical Ayurvedic principles.",
    date: "August 15, 2025",
    comments: 3,
    image: "/api/placeholder/400/300",
    category: "Wellness",
  },
  {
    id: 3,
    title: "Natural Detox: Supporting Your Body's Cleansing Process",
    excerpt:
      "Learn about gentle, natural ways to support your body's natural detoxification processes.",
    date: "August 12, 2025",
    comments: 7,
    image: "/api/placeholder/400/300",
    category: "Detox",
  },
  {
    id: 4,
    title: "The Science Behind Herbal Supplements",
    excerpt:
      "Understanding how modern research validates traditional herbal medicine practices.",
    date: "August 8, 2025",
    comments: 2,
    image: "/api/placeholder/400/300",
    category: "Science",
  },
];
