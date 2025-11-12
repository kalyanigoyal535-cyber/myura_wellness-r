import React, { useState } from "react";
import BlogCard from "../blogCard/BlogCard";
import images from "../../images/images";
import Testing from "../test/Testing";
import { Link } from "react-router-dom";
import { MainCard } from "../mainBlogCard/MainCard";
import blogs from "../../data/myuraBlogs.json"
const BlogSection = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Men", "Women", "Shilajit", "Herbal"];

  return (
    <div className="text-[#192537] p-4">
      <MainCard />
      <div className="mt-4 p-4   grid grid-cols-12">
        <BlogCard />
        <BlogCard /> 
        <BlogCard />
      </div>
    </div>
  );
};

export default BlogSection;
