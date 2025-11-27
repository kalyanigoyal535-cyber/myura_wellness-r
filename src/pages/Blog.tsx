import React from "react";
import { Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Divider, Input } from "@mantine/core";
import BlogSection from "../components/blogTabs/BlogSection";

const Blog: React.FC = () => {
  return (
    <div className="p-4">
      <Link to="/" className="flex items-center text-lg ">
        <ArrowLeft className="mr-2" /> BACK
      </Link>

      <Divider my="sm" />

      <div className="flex flex-col items-center p-2">
        <h1 className="text-[#192537] text-3xl font-semibold">
          Myura Blogs
        </h1>
        <p>Know more about Ayurveda </p>
      </div>
  <BlogSection/>

    </div>
  );
};

export default Blog;
