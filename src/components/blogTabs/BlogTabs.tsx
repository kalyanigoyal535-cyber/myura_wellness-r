import React, { useState } from "react";
import BlogCard from "../blogCard/BlogCard";
import images from "../../images/images";
import Testing from "../test/Testing";
import { Link } from "react-router-dom";
import { MainCard } from "../mainBlogCard/MainCard";
const Blogtabs = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Men", "Women", "Shilajit", "Herbal"];

 
  return (
    <div className="text-[#192537] p-4">
    <MainCard/>

      <div className="mt-4 p-4   grid grid-cols-12">
        {/* <MainCard/> */}
        <BlogCard />
        <BlogCard /> <BlogCard />
      </div>
    </div>
  );
};

export default Blogtabs;

// main card
