import React, { useState } from "react";
import images from "../../images/images";
import { Link } from "react-router-dom";

const Blogtabs = () => {
  const [activeTab, setActiveTab] = useState("All");
  console.log(activeTab);
  const tabs = ["All", "Men", "Women", "Shilajit", "Herbal"];

  const tabContent = {
    All: "Showing all products.",
    Men: "Showing men's wellness products.",
    Women: "Showing women's wellness products.",
    Shilajit: "Showing Shilajit-based products.",
    Herbal: "Showing herbal & natural remedies.",
  };

  return (
    <div className="text-[#192537] p-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 border-2 rounded-md transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#192537] text-white border-[#192537]"
                : "border-[#192537] hover:bg-[#192537] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 p-4 border rounded-md bg-gray-50 grid grid-cols-12">
        <BlogCard />
        <BlogCard />
      </div>
    </div>
  );
};

export default Blogtabs;

export const BlogCard = () => {
  return (
    <div className="col-span-12 md:col-span-6  flex  ">
      <img
        src={images.BannerImageDesktop1}
        alt="Blogimage"
        className="w-24 h-32"
      />
      <div className="ml-10">
        <h1 className="font-semibold text-xl">The Men's Vitality Booster</h1>
        <p>short descripition about the products</p>
        <Link to="#"> Read More </Link>
      </div>
    </div>
  );
};
